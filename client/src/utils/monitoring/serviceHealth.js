
/**
 * UNWIND PULSE
 * Service Health Calculation Utility
 *
 * Pure functions with no React or API dependencies.
 */

export const MIN_SERVICE_REQUESTS = 5;

export const SERVICE_THRESHOLDS = {
  warningErrorRate: 3,
  criticalErrorRate: 10,
  warningAbortRate: 3,
  criticalAbortRate: 10,
  warningLatencyMs: 1000,
  criticalLatencyMs: 3000
};

export const SERVICE_PREFIXES = {
  auth: [
    "/api/auth",
    "/api/password",
    "/api/account",
    "/api/profile"
  ],
  journal: [
    "/api/journal",
    "/api/journals"
  ],
  community: [
    "/api/community",
    "/api/posts",
    "/api/comments",
    "/api/testimonials"
  ],
  chat: [
    "/api/chat",
    "/api/chat-rooms",
    "/api/chat-messages",
    "/api/messages",
    "/api/rooms",
    "/api/private-rooms",
    "/api/direct-conversations",
    "/api/direct-messages"
  ],
  notifications: [
    "/api/notifications"
  ],
  admin: [
    "/api/admin"
  ]
};

function safeNumber(value) {
  const number = Number(value);

  return Number.isFinite(number)
    ? Math.max(0, number)
    : 0;
}

export function parseEndpoint(label) {
  const text = String(label || "").trim();
  const separator = text.indexOf(" ");

  if (separator === -1) {
    return {
      method: "",
      path: text
    };
  }

  return {
    method: text.slice(0, separator).toUpperCase(),
    path: text.slice(separator + 1)
  };
}

export function belongsToService(endpoint, serviceId) {
  const prefixes = SERVICE_PREFIXES[serviceId] || [];
  const { path } = parseEndpoint(endpoint.endpoint);

  return prefixes.some(prefix =>
    path === prefix || path.startsWith(`${prefix}/`)
  );
}

export function classifyServiceHealth(stats) {
  if (stats.requests < MIN_SERVICE_REQUESTS) {
    return "unknown";
  }

  if (
    stats.errorRatePercent >=
      SERVICE_THRESHOLDS.criticalErrorRate ||
    stats.abortedRatePercent >=
      SERVICE_THRESHOLDS.criticalAbortRate ||
    stats.averageLatencyMs >=
      SERVICE_THRESHOLDS.criticalLatencyMs
  ) {
    return "critical";
  }

  if (
    stats.errorRatePercent >=
      SERVICE_THRESHOLDS.warningErrorRate ||
    stats.abortedRatePercent >=
      SERVICE_THRESHOLDS.warningAbortRate ||
    stats.averageLatencyMs >=
      SERVICE_THRESHOLDS.warningLatencyMs
  ) {
    return "degraded";
  }

  return "healthy";
}

export function calculateServiceMetrics(
  serviceId,
  endpoints = []
) {
  const matched = endpoints.filter(endpoint =>
    belongsToService(endpoint, serviceId)
  );

  const applicationEndpoints = matched.filter(
    endpoint =>
      parseEndpoint(endpoint.endpoint).method !== "OPTIONS"
  );

  const preflightRequests = matched
    .filter(endpoint =>
      parseEndpoint(endpoint.endpoint).method === "OPTIONS"
    )
    .reduce(
      (sum, endpoint) =>
        sum + safeNumber(endpoint.requests),
      0
    );

  let requests = 0;
  let abortedRequests = 0;
  let serverErrors = 0;
  let totalLatencyMs = 0;

  for (const endpoint of applicationEndpoints) {
    const count = safeNumber(endpoint.requests);

    requests += count;

    abortedRequests += safeNumber(
      endpoint.abortedRequests
    );

    serverErrors += safeNumber(
      endpoint.statusCodes?.["5xx"]
    );

    totalLatencyMs +=
      safeNumber(endpoint.averageLatencyMs) * count;
  }

  const completedResponses = Math.max(
    0,
    requests - abortedRequests
  );

  const averageLatencyMs = requests
    ? totalLatencyMs / requests
    : 0;

  const errorRatePercent = completedResponses
    ? (serverErrors / completedResponses) * 100
    : 0;

  const abortedRatePercent = requests
    ? (abortedRequests / requests) * 100
    : 0;

  const stats = {
    requests,
    completedResponses,
    abortedRequests,
    serverErrors,
    averageLatencyMs,
    errorRatePercent,
    abortedRatePercent,
    preflightRequests,
    endpoints: applicationEndpoints
  };

  return {
    ...stats,
    health: classifyServiceHealth(stats)
  };
}
