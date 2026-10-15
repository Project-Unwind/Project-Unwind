
/**
 * UNWIND PULSE
 * API Anomaly Detection Engine
 *
 * Pure, rules-based monitoring.
 *
 * No database queries.
 * No network requests.
 * No background processing.
 */

const MIN_REQUESTS = 5;

const THRESHOLDS = {
  serverErrors: {
    warning: 3,
    critical: 10
  },

  latencyMs: {
    warning: 1000,
    critical: 3000
  },

  abortedRate: {
    warning: 3,
    critical: 10
  }
};

/* =====================================================
   HELPERS
   ===================================================== */

function validNumber(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const number = Number(value);

  return Number.isFinite(number) && number >= 0
    ? number
    : null;
}

function validCount(value) {
  const number = validNumber(value);

  return number !== null && Number.isSafeInteger(number)
    ? number
    : null;
}

function round(value) {
  return Number(value.toFixed(2));
}

function getMethod(endpointName) {
  return String(endpointName || "")
    .trim()
    .split(/\s+/)[0]
    .toUpperCase();
}

function createAnomaly({
  endpoint,
  type,
  severity,
  title,
  description,
  value,
  threshold,
  recommendation,
  sampleSize
}) {
  return {
    id: `${endpoint}:${type}`,
    endpoint,
    type,
    severity,
    title,
    description,
    value: round(value),
    threshold,
    recommendation,
    sampleSize
  };
}

/* =====================================================
   MAIN DETECTION FUNCTION
   ===================================================== */

export function detectApiAnomalies(endpoints = []) {
  if (!Array.isArray(endpoints)) {
    return [];
  }

  const anomalies = [];

  for (const endpoint of endpoints) {
    if (!endpoint || typeof endpoint !== "object") {
      continue;
    }

    const name = String(endpoint.endpoint || "").trim();

    if (!name || name === "OTHER") {
      continue;
    }

    // CORS preflights are not application requests.
    if (getMethod(name) === "OPTIONS") {
      continue;
    }

    const requests = validCount(endpoint.requests);

    if (requests === null || requests < MIN_REQUESTS) {
      continue;
    }

    const abortedRequests = validCount(
      endpoint.abortedRequests
    );

    // Aborted count is required to determine the
    // number of completed HTTP responses.
    const hasValidAbortedCount =
      abortedRequests !== null &&
      abortedRequests <= requests;

    const completedResponses = hasValidAbortedCount
      ? requests - abortedRequests
      : null;

    /* =================================================
       1. HTTP SERVER ERROR DETECTION
       ================================================= */

    // Prefer the underlying response counts rather
    // than relying on rounded errorRatePercent.
    const serverErrors = validCount(
      endpoint.statusCodes?.["5xx"]
    );

    if (
      completedResponses !== null &&
      completedResponses >= MIN_REQUESTS &&
      serverErrors !== null &&
      serverErrors <= completedResponses
    ) {
      const serverErrorRate =
        (serverErrors / completedResponses) * 100;

      let severity = null;
      let threshold = null;

      if (
        serverErrorRate >=
        THRESHOLDS.serverErrors.critical
      ) {
        severity = "critical";
        threshold = THRESHOLDS.serverErrors.critical;
      } else if (
        serverErrorRate >=
        THRESHOLDS.serverErrors.warning
      ) {
        severity = "warning";
        threshold = THRESHOLDS.serverErrors.warning;
      }

      if (severity) {
        anomalies.push(createAnomaly({
          endpoint: name,
          type: "server_error",
          severity,
          title: severity === "critical"
            ? "Critical Server Error Rate"
            : "Elevated Server Error Rate",
          description:
            `${name} returned HTTP 5xx for ` +
            `${serverErrors} of ${completedResponses} ` +
            `completed responses (${round(serverErrorRate)}%).`,
          value: serverErrorRate,
          threshold,
          sampleSize: completedResponses,
          recommendation:
            "Review backend error logs, failing routes, " +
            "database operations and upstream dependencies."
        }));
      }
    }

    /* =================================================
       2. REQUEST DURATION DETECTION
       ================================================= */

    // Backend averageLatencyMs currently includes
    // recorded aborted-request durations.
    const averageLatency = validNumber(
      endpoint.averageLatencyMs
    );

    if (averageLatency !== null) {
      let severity = null;
      let threshold = null;

      if (
        averageLatency >=
        THRESHOLDS.latencyMs.critical
      ) {
        severity = "critical";
        threshold = THRESHOLDS.latencyMs.critical;
      } else if (
        averageLatency >=
        THRESHOLDS.latencyMs.warning
      ) {
        severity = "warning";
        threshold = THRESHOLDS.latencyMs.warning;
      }

      if (severity) {
        anomalies.push(createAnomaly({
          endpoint: name,
          type: "latency",
          severity,
          title: severity === "critical"
            ? "Severe API Request Duration"
            : "Elevated API Request Duration",
          description:
            `${name} has an average recorded request ` +
            `duration of ${round(averageLatency)} ms.`,
          value: averageLatency,
          threshold,
          sampleSize: requests,
          recommendation:
            "Inspect request processing time, slow " +
            "database queries, blocking operations and " +
            "external dependencies. Check aborted " +
            "requests separately."
        }));
      }
    }

    /* =================================================
       3. ABORTED REQUEST DETECTION
       ================================================= */

    if (hasValidAbortedCount) {
      const abortedRate =
        (abortedRequests / requests) * 100;

      let severity = null;
      let threshold = null;

      if (
        abortedRate >=
        THRESHOLDS.abortedRate.critical
      ) {
        severity = "critical";
        threshold = THRESHOLDS.abortedRate.critical;
      } else if (
        abortedRate >=
        THRESHOLDS.abortedRate.warning
      ) {
        severity = "warning";
        threshold = THRESHOLDS.abortedRate.warning;
      }

      if (severity) {
        anomalies.push(createAnomaly({
          endpoint: name,
          type: "aborted",
          severity,
          title: severity === "critical"
            ? "High Request Abortion Rate"
            : "Elevated Request Abortion Rate",
          description:
            `${abortedRequests} of ${requests} requests ` +
            `to ${name} were aborted ` +
            `(${round(abortedRate)}%).`,
          value: abortedRate,
          threshold,
          sampleSize: requests,
          recommendation:
            "Investigate client disconnects, request " +
            "timeouts, unstable connections and slow " +
            "response processing."
        }));
      }
    }
  }

  /* =====================================================
     SORT FINDINGS
     ===================================================== */

  const priority = {
    critical: 2,
    warning: 1
  };

  return anomalies.sort((a, b) => {
    const severityDifference =
      priority[b.severity] - priority[a.severity];

    if (severityDifference !== 0) {
      return severityDifference;
    }

    // Deterministic ordering for findings of
    // the same severity.
    const endpointDifference =
      a.endpoint.localeCompare(b.endpoint);

    if (endpointDifference !== 0) {
      return endpointDifference;
    }

    return a.type.localeCompare(b.type);
  });
}

export {
  THRESHOLDS,
  MIN_REQUESTS
};
