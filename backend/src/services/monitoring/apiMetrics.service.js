
const WINDOW_MINUTES = 60;
const MAX_ENDPOINTS_PER_MINUTE = 100;

const LATENCY_BUCKETS = [
  25, 50, 100, 200, 300, 500,
  750, 1000, 2000, 5000, 10000,
  Infinity
];

const SAFE_SEGMENTS = new Set([
  "api", "auth", "login", "logout", "register",
  "refresh", "verify", "otp", "password",
  "forgot", "reset", "profile", "account",
  "chatbot", "community", "posts", "comments",
  "likes", "chat", "messages", "rooms",
  "private-rooms", "direct-conversations",
  "direct-messages", "reports", "dass",
  "journal", "entries", "trackers", "mood",
  "sleep", "water", "energy", "habits",
  "testimonials", "public", "dashboard",
  "admin", "access", "users", "moderation",
  "moderation-decisions", "audit-logs",
  "analytics", "overview", "notifications",
  "monitoring", "endpoints", "trends",
  "health", "search", "export", "upload",
  "attachments", "prompts", "security",
  "metadata", "history", "settings",
  "consent", "results", "summary", "me"
]);

const minutes = new Map();
let activeRequests = 0;

function currentMinute() {
  return Math.floor(Date.now() / 60000);
}

function createStats() {
  return {
    requests: 0,
    totalDurationMs: 0,
    maxDurationMs: 0,
    statusCodes: {
      "2xx": 0,
      "3xx": 0,
      "4xx": 0,
      "5xx": 0
    },
    latencyBuckets: LATENCY_BUCKETS.map(() => 0)
  };
}

function cleanup() {
  const oldest = currentMinute() - WINDOW_MINUTES + 1;

  for (const minute of minutes.keys()) {
    if (minute < oldest) {
      minutes.delete(minute);
    }
  }
}

function sanitizePath(rawPath) {
  const pathname = String(rawPath || "/")
    .split("?")[0]
    .slice(0, 512);

  const segments = pathname
    .split("/")
    .filter(Boolean)
    .slice(0, 8);

  if (!segments.length) return "/";

  return "/" + segments.map(segment => {
    const normalized = segment.toLowerCase();

    return SAFE_SEGMENTS.has(normalized)
      ? normalized
      : ":param";
  }).join("/");
}

function addStats(stats, statusCode, durationMs) {
  stats.requests++;
  stats.totalDurationMs += durationMs;
  stats.maxDurationMs = Math.max(
    stats.maxDurationMs,
    durationMs
  );

  const group = `${Math.floor(statusCode / 100)}xx`;

  if (Object.hasOwn(stats.statusCodes, group)) {
    stats.statusCodes[group]++;
  }

  const index = LATENCY_BUCKETS.findIndex(
    limit => durationMs <= limit
  );

  stats.latencyBuckets[index]++;
}

function mergeStats(target, source) {
  target.requests += source.requests;
  target.totalDurationMs += source.totalDurationMs;

  target.maxDurationMs = Math.max(
    target.maxDurationMs,
    source.maxDurationMs
  );

  for (const key of Object.keys(target.statusCodes)) {
    target.statusCodes[key] += source.statusCodes[key];
  }

  source.latencyBuckets.forEach((count, index) => {
    target.latencyBuckets[index] += count;
  });
}

function percentile(stats, percent) {
  if (!stats.requests) return 0;

  const target = Math.ceil(stats.requests * percent);
  let cumulative = 0;

  for (let i = 0; i < LATENCY_BUCKETS.length; i++) {
    cumulative += stats.latencyBuckets[i];

    if (cumulative >= target) {
      const limit = LATENCY_BUCKETS[i];

      return Number.isFinite(limit)
        ? limit
        : null;
    }
  }

  return null;
}

function summarize(stats) {
  const average = stats.requests
    ? stats.totalDurationMs / stats.requests
    : 0;

  return {
    requests: stats.requests,
    averageLatencyMs: Number(average.toFixed(2)),
    p50LatencyMs: percentile(stats, 0.50),
    p95LatencyMs: percentile(stats, 0.95),
    p99LatencyMs: percentile(stats, 0.99),
    maxLatencyMs: Number(
      stats.maxDurationMs.toFixed(2)
    ),
    errorRatePercent: stats.requests
      ? Number((
          stats.statusCodes["5xx"] /
          stats.requests * 100
        ).toFixed(2))
      : 0,
    statusCodes: { ...stats.statusCodes }
  };
}

export function requestStarted() {
  activeRequests++;
}

export function requestFinished(
  method,
  rawPath,
  statusCode,
  durationMs
) {
  activeRequests = Math.max(0, activeRequests - 1);

  const minute = currentMinute();
  cleanup();

  if (!minutes.has(minute)) {
    minutes.set(minute, {
      overall: createStats(),
      endpoints: new Map()
    });
  }

  const record = minutes.get(minute);

  addStats(record.overall, statusCode, durationMs);

  const endpoint = `${method} ${sanitizePath(rawPath)}`;

  const key = record.endpoints.has(endpoint) ||
    record.endpoints.size < MAX_ENDPOINTS_PER_MINUTE
      ? endpoint
      : "OTHER";

  if (!record.endpoints.has(key)) {
    record.endpoints.set(key, createStats());
  }

  addStats(
    record.endpoints.get(key),
    statusCode,
    durationMs
  );
}

export function getApiMetrics() {
  cleanup();

  const overall = createStats();
  const endpointTotals = new Map();
  const trends = [];

  const now = currentMinute();

  for (
    let minute = now - WINDOW_MINUTES + 1;
    minute <= now;
    minute++
  ) {
    const record = minutes.get(minute);

    if (record) {
      mergeStats(overall, record.overall);

      for (const [endpoint, stats] of record.endpoints) {
        if (!endpointTotals.has(endpoint)) {
          endpointTotals.set(endpoint, createStats());
        }

        mergeStats(endpointTotals.get(endpoint), stats);
      }
    }

    const stats = record
      ? record.overall
      : createStats();

    trends.push({
      timestamp: new Date(minute * 60000).toISOString(),
      requests: stats.requests,
      averageLatencyMs: summarize(stats).averageLatencyMs,
      serverErrors: stats.statusCodes["5xx"]
    });
  }

  const endpoints = [...endpointTotals.entries()]
    .map(([endpoint, stats]) => ({
      endpoint,
      ...summarize(stats)
    }))
    .sort((a, b) => b.requests - a.requests);

  return {
    windowMinutes: WINDOW_MINUTES,
    generatedAt: new Date().toISOString(),
    activeRequests,
    requestsPerMinute: Number(
      (overall.requests / WINDOW_MINUTES).toFixed(2)
    ),
    ...summarize(overall),
    endpoints,
    trends
  };
}
