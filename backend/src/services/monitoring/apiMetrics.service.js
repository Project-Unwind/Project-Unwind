
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
    abortedRequests: 0,
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


/**
 * Sanitize a developer-defined Express route template.
 *
 * Static route segments are preserved.
 * Dynamic parameters and wildcard patterns are masked.
 *
 * Never call this function with a raw client URL.
 */
function sanitizeRouteTemplate(routePath) {
  if (typeof routePath !== "string") {
    return "/";
  }

  const segments = routePath
    .split("/")
    .filter(Boolean)
    .slice(0, 8);

  if (!segments.length) {
    return "/";
  }

  return "/" + segments.map(segment => {
    // Express dynamic parameters, including optional
    // parameters and parameter regex constraints.
    if (segment.startsWith(":")) {
      return ":param";
    }

    // Preserve only simple, developer-defined literals.
    if (/^[a-zA-Z0-9_-]+$/.test(segment)) {
      return segment.toLowerCase();
    }

    // Mask wildcards and unsupported route syntax.
    return ":param";
  }).join("/");
}



function addStats(
  stats,
  statusCode,
  durationMs,
  aborted = false
) {
  stats.requests++;

  stats.totalDurationMs += durationMs;

  stats.maxDurationMs = Math.max(
    stats.maxDurationMs,
    durationMs
  );

  if (aborted) {
    stats.abortedRequests++;
  } else {
    const group = `${Math.floor(statusCode / 100)}xx`;

    if (Object.hasOwn(stats.statusCodes, group)) {
      stats.statusCodes[group]++;
    }
  }

  const index = LATENCY_BUCKETS.findIndex(
    limit => durationMs <= limit
  );

  stats.latencyBuckets[index]++;
}



function mergeStats(target, source) {
  target.requests += source.requests;
  target.abortedRequests += source.abortedRequests;
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
  // Calculate average request duration
  const average = stats.requests
    ? stats.totalDurationMs / stats.requests
    : 0;

  // Calculate server error rate (HTTP 5xx)
  
  // Completed HTTP responses exclude aborted requests.
  const completedResponses = Math.max(
    0,
    stats.requests - stats.abortedRequests
  );

  // Calculate HTTP 5xx rate using completed responses.
  const serverErrorRate = completedResponses
    ? (
        stats.statusCodes["5xx"] /
        completedResponses
      ) * 100
    : 0;


  // Calculate aborted request rate
  const abortedRate = stats.requests
    ? (
        stats.abortedRequests /
        stats.requests
      ) * 100
    : 0;

  return {
    requests: stats.requests,

    // Aborted request metrics
    abortedRequests: stats.abortedRequests,
    abortedRatePercent: Number(
      abortedRate.toFixed(2)
    ),

    // Response latency metrics
    averageLatencyMs: Number(
      average.toFixed(2)
    ),

    p50LatencyMs: percentile(stats, 0.50),
    p95LatencyMs: percentile(stats, 0.95),
    p99LatencyMs: percentile(stats, 0.99),

    maxLatencyMs: Number(
      stats.maxDurationMs.toFixed(2)
    ),

    // HTTP server error rate
    errorRatePercent: Number(
      serverErrorRate.toFixed(2)
    ),

    // HTTP response distribution
    statusCodes: {
      ...stats.statusCodes
    }
  };
}


export function requestStarted() {
  activeRequests++;
}


/**
 * Reset in-memory API metrics for isolated tests.
 *
 * Intended for automated testing only.
 * Never expose this through an HTTP endpoint.
 */
export function resetApiMetricsForTesting() {
  if (process.env.NODE_ENV !== "test") {
    throw new Error(
      "Metrics reset is only permitted in test mode"
    );
  }

  if (activeRequests !== 0) {
    throw new Error(
      "Cannot reset metrics while requests are active"
    );
  }

  minutes.clear();
}




export function requestFinished(
  method,
  rawPath,
  statusCode,
  durationMs,
  aborted = false,
  routeTemplate = null,
  routeBaseUrl = ""
)
{
  // 1. Decrease active request counter
  activeRequests = Math.max(0, activeRequests - 1);

  // 2. Get current monitoring minute
  const minute = currentMinute();

  // 3. Remove expired monitoring data
  cleanup();

  // 4. Initialize minute record if missing
  if (!minutes.has(minute)) {
    minutes.set(minute, {
      overall: createStats(),
      endpoints: new Map()
    });
  }

  const record = minutes.get(minute);

  // 5. Update overall API statistics
  addStats(
    record.overall,
    statusCode,
    durationMs,
    aborted
  );

  // 6. Sanitize endpoint path
  
  // A matched route template comes from Express itself.
  // A router's baseUrl can contain actual client values,
  // so sanitize it using the conservative allowlist.
  const monitoredPath =
    typeof routeTemplate === "string"
      ? (
          sanitizePath(routeBaseUrl) === "/"
            ? sanitizeRouteTemplate(routeTemplate)
            : (
                sanitizePath(routeBaseUrl) +
                sanitizeRouteTemplate(routeTemplate)
              ).replace(/\/+/g, "/")
        )
      : sanitizePath(rawPath);

  const endpoint = `${method} ${monitoredPath}`;


  // 7. Apply endpoint storage limit
  const key =
    record.endpoints.has(endpoint) ||
    record.endpoints.size < MAX_ENDPOINTS_PER_MINUTE
      ? endpoint
      : "OTHER";

  // 8. Get or initialize endpoint statistics
  let endpointStats = record.endpoints.get(key);

  if (!endpointStats) {
    endpointStats = createStats();
    record.endpoints.set(key, endpointStats);
  }

  // 9. Update endpoint-level statistics
  addStats(
    endpointStats,
    statusCode,
    durationMs,
    aborted
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

      for (const [endpoint, stats] of record.endpoints.entries()) {
        let accumulated = endpointTotals.get(endpoint);

        if (!accumulated) {
          accumulated = createStats();
          endpointTotals.set(endpoint, accumulated);
        }

        mergeStats(accumulated, stats);
      }
    }

    const minuteStats = record
      ? record.overall
      : createStats();

    trends.push({
      timestamp: new Date(
        minute * 60000
      ).toISOString(),

      requests: minuteStats.requests,

      abortedRequests: minuteStats.abortedRequests,

      averageLatencyMs:
        summarize(minuteStats).averageLatencyMs,

      serverErrors: minuteStats.statusCodes["5xx"]
    });
  }

  const endpoints = Array.from(
    endpointTotals.entries(),
    ([endpoint, stats]) => ({
      endpoint,
      ...summarize(stats)
    })
  ).sort((a, b) => b.requests - a.requests);

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


