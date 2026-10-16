
/**
 * UNWIND PULSE
 * Endpoint Diagnostics Utility
 *
 * Pure functions for:
 * - Metric normalization
 * - Endpoint classification
 * - Sorting
 * - Filtering
 * - Secure CSV serialization
 */

export const MIN_DIAGNOSTIC_REQUESTS = 5;

export const DIAGNOSTIC_THRESHOLDS = {
  serverErrorRate: 3,
  abortedRate: 3,
  averageLatencyMs: 1000
};

export function validNumber(value) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  const number = Number(value);

  return Number.isFinite(number) && number >= 0
    ? number
    : null;
}

export function validCount(value) {
  const number = validNumber(value);

  return number !== null && Number.isSafeInteger(number)
    ? number
    : null;
}

export function calculateEndpointMetrics(endpoint) {
  const requests = validCount(endpoint?.requests);
  const abortedRequests = validCount(
    endpoint?.abortedRequests
  );

  const validAborts =
    requests !== null &&
    abortedRequests !== null &&
    abortedRequests <= requests;

  const completedResponses = validAborts
    ? requests - abortedRequests
    : null;

  const serverErrors = validCount(
    endpoint?.statusCodes?.["5xx"]
  );

  const validServerErrors =
    completedResponses !== null &&
    serverErrors !== null &&
    serverErrors <= completedResponses;

  const errorRatePercent =
    validServerErrors && completedResponses > 0
      ? (serverErrors / completedResponses) * 100
      : null;

  const abortedRatePercent =
    validAborts && requests > 0
      ? (abortedRequests / requests) * 100
      : null;

  return {
    requests,
    abortedRequests,
    completedResponses,
    serverErrors,
    errorRatePercent,
    abortedRatePercent,
    averageLatencyMs: validNumber(
      endpoint?.averageLatencyMs
    ),
    p50LatencyMs: endpoint?.p50LatencyMs,
    p95LatencyMs: endpoint?.p95LatencyMs,
    p99LatencyMs: endpoint?.p99LatencyMs,
    maxLatencyMs: validNumber(
      endpoint?.maxLatencyMs
    )
  };
}

export function getEndpointStatus(endpoint, stats) {
  const method = String(endpoint?.endpoint || "")
    .trim()
    .split(/\s+/)[0]
    .toUpperCase();

  if (method === "OPTIONS") {
    return "preflight";
  }

  if (
    stats.requests === null ||
    stats.requests < MIN_DIAGNOSTIC_REQUESTS
  ) {
    return "insufficient";
  }

  if (
    stats.completedResponses >= MIN_DIAGNOSTIC_REQUESTS &&
    stats.errorRatePercent !== null &&
    stats.errorRatePercent >=
      DIAGNOSTIC_THRESHOLDS.serverErrorRate
  ) {
    return "errors";
  }

  if (
    stats.abortedRatePercent !== null &&
    stats.abortedRatePercent >=
      DIAGNOSTIC_THRESHOLDS.abortedRate
  ) {
    return "aborted";
  }

  if (
    stats.averageLatencyMs !== null &&
    stats.averageLatencyMs >=
      DIAGNOSTIC_THRESHOLDS.averageLatencyMs
  ) {
    return "slow";
  }

  if (
    stats.completedResponses === null ||
    stats.completedResponses < MIN_DIAGNOSTIC_REQUESTS ||
    stats.errorRatePercent === null ||
    stats.abortedRatePercent === null ||
    stats.averageLatencyMs === null
  ) {
    return "insufficient";
  }

  return "healthy";
}

export function prepareEndpoint(endpoint) {
  const stats = calculateEndpointMetrics(endpoint);

  return {
    endpoint,
    stats,
    status: getEndpointStatus(endpoint, stats)
  };
}

export function getSortValue(item, key) {
  if (key === "requests") {
    return item.stats.requests;
  }

  if (key === "abortedRequests") {
    return item.stats.abortedRequests;
  }

  if (key === "averageLatencyMs") {
    return item.stats.averageLatencyMs;
  }

  if (key === "errorRatePercent") {
    return item.stats.errorRatePercent;
  }

  if (key === "p95LatencyMs") {
    if (
      item.endpoint.p95LatencyMs === null &&
      item.stats.requests > 0
    ) {
      return Infinity;
    }

    return validNumber(item.endpoint.p95LatencyMs);
  }

  return null;
}

export function compareEndpoints(
  a,
  b,
  key,
  direction = "desc"
) {
  const aValue = getSortValue(a, key);
  const bValue = getSortValue(b, key);

  if (aValue === null && bValue === null) {
    return a.endpoint.endpoint.localeCompare(
      b.endpoint.endpoint
    );
  }

  // Missing measurements always sort last.
  if (aValue === null) return 1;
  if (bValue === null) return -1;

  // Avoid Infinity - Infinity producing NaN.
  let comparison = 0;

  if (aValue < bValue) comparison = -1;
  if (aValue > bValue) comparison = 1;

  if (direction === "desc") {
    comparison *= -1;
  }

  return comparison ||
    a.endpoint.endpoint.localeCompare(
      b.endpoint.endpoint
    );
}

export function processEndpoints(
  endpoints = [],
  {
    search = "",
    filter = "all",
    sortKey = "requests",
    sortDirection = "desc"
  } = {}
) {
  if (!Array.isArray(endpoints)) return [];

  const query = String(search).trim().toLowerCase();

  return endpoints
    .filter(endpoint =>
      endpoint &&
      typeof endpoint === "object" &&
      typeof endpoint.endpoint === "string"
    )
    .map(prepareEndpoint)
    .filter(item => {
      const matchesSearch =
        item.endpoint.endpoint
          .toLowerCase()
          .includes(query);

      const matchesFilter =
        filter === "all" || item.status === filter;

      return matchesSearch && matchesFilter;
    })
    .sort((a, b) =>
      compareEndpoints(
        a,
        b,
        sortKey,
        sortDirection
      )
    );
}

export function formatLatency(value, requests = 0) {
  if (value === null && requests > 0) {
    return "> 10,000 ms";
  }

  const number = validNumber(value);

  return number === null
    ? "N/A"
    : `${number.toFixed(2)} ms`;
}

/* =====================================================
   CSV SERIALIZATION
   ===================================================== */

export function escapeCSV(value) {
  let text = String(value ?? "");

  // Remove control characters, including newlines.

// Remove control characters, including newlines.
text = Array.from(text, char => {
  const code = char.charCodeAt(0);

  if (
    code <= 31 ||
    (code >= 127 && code <= 159)
  ) {
    return " ";
  }

  return char;
}).join("");


  // Reduce spreadsheet formula-injection risk.
  if (/^\s*[=+\-@]/.test(text)) {
    text = `'${text}`;
  }

  return `"${text.replace(/"/g, '""')}"`;
}

function csvNumber(value) {
  const number = validNumber(value);
  return number === null ? "" : number;
}

function csvPercent(value) {
  const number = validNumber(value);

  return number === null
    ? ""
    : Number(number.toFixed(2));
}

function csvPercentile(value, requests) {
  if (value === null && requests > 0) {
    return ">10000";
  }

  return csvNumber(value);
}

export function createDiagnosticsCSV(items = []) {
  const headers = [
    "Endpoint",
    "Requests",
    "Completed Responses",
    "Average Latency (ms)",
    "P50 (ms)",
    "P95 (ms)",
    "P99 (ms)",
    "5xx Error Rate (%)",
    "Aborted Requests",
    "Aborted Rate (%)",
    "Status"
  ];

  const rows = items.map(item => {
    const { endpoint, stats, status } = item;

    return [
      endpoint.endpoint,
      csvNumber(stats.requests),
      csvNumber(stats.completedResponses),
      csvNumber(stats.averageLatencyMs),
      csvPercentile(
        stats.p50LatencyMs,
        stats.requests
      ),
      csvPercentile(
        stats.p95LatencyMs,
        stats.requests
      ),
      csvPercentile(
        stats.p99LatencyMs,
        stats.requests
      ),
      csvPercent(stats.errorRatePercent),
      csvNumber(stats.abortedRequests),
      csvPercent(stats.abortedRatePercent),
      status
    ];
  });

  return [headers, ...rows]
    .map(row => row.map(escapeCSV).join(","))
    .join("\r\n");
}
