
import test from "node:test";
import assert from "node:assert/strict";

import {
  detectApiAnomalies,
  THRESHOLDS,
  MIN_REQUESTS
} from "../../src/utils/monitoring/detectApiAnomalies.js";

/* =====================================================
   TEST DATA FACTORY
   ===================================================== */

function createEndpoint({
  name = "GET /api/journal",
  requests = 20,
  aborted = 0,
  errors = 0,
  latency = 200
} = {}) {
  return {
    endpoint: name,
    requests,
    abortedRequests: aborted,
    averageLatencyMs: latency,
    statusCodes: {
      "2xx": Math.max(0, requests - aborted - errors),
      "3xx": 0,
      "4xx": 0,
      "5xx": errors
    }
  };
}

/* =====================================================
   TEST 1 — NORMAL ENDPOINT
   ===================================================== */

test("healthy metrics produce no anomalies", () => {
  const anomalies = detectApiAnomalies([
    createEndpoint()
  ]);

  assert.deepEqual(anomalies, []);
});

/* =====================================================
   TEST 2 — INSUFFICIENT REQUESTS
   ===================================================== */

test("fewer than five requests produce no anomalies", () => {
  const anomalies = detectApiAnomalies([
    createEndpoint({
      requests: MIN_REQUESTS - 1,
      errors: 2,
      latency: 5000
    })
  ]);

  assert.equal(anomalies.length, 0);
});

/* =====================================================
   TEST 3 — CRITICAL SERVER ERRORS
   ===================================================== */

test("detects critical HTTP 5xx rate", () => {
  const anomalies = detectApiAnomalies([
    createEndpoint({
      requests: 20,
      errors: 3
    })
  ]);

  const finding = anomalies.find(
    item => item.type === "server_error"
  );

  assert.ok(finding);
  assert.equal(finding.severity, "critical");
  assert.equal(finding.value, 15);
  assert.equal(finding.sampleSize, 20);
});

/* =====================================================
   TEST 4 — WARNING SERVER ERRORS
   ===================================================== */

test("detects warning-level HTTP 5xx rate", () => {
  const anomalies = detectApiAnomalies([
    createEndpoint({
      requests: 40,
      errors: 2
    })
  ]);

  const finding = anomalies.find(
    item => item.type === "server_error"
  );

  assert.ok(finding);
  assert.equal(finding.severity, "warning");
  assert.equal(finding.value, 5);
});

/* =====================================================
   TEST 5 — ABORTED REQUEST DENOMINATOR
   ===================================================== */

test("5xx rate uses completed HTTP responses", () => {
  const anomalies = detectApiAnomalies([
    createEndpoint({
      requests: 10,
      aborted: 2,
      errors: 1
    })
  ]);

  const serverError = anomalies.find(
    item => item.type === "server_error"
  );

  assert.ok(serverError);
  assert.equal(serverError.value, 12.5);
  assert.equal(serverError.sampleSize, 8);
});

/* =====================================================
   TEST 6 — INSUFFICIENT COMPLETED RESPONSES
   ===================================================== */

test("server errors require five completed responses", () => {
  const anomalies = detectApiAnomalies([
    createEndpoint({
      requests: 10,
      aborted: 7,
      errors: 1
    })
  ]);

  assert.equal(
    anomalies.some(item => item.type === "server_error"),
    false
  );

  // Aborted-request anomalies may still exist.
  assert.equal(
    anomalies.some(item => item.type === "aborted"),
    true
  );
});

/* =====================================================
   TEST 7 — OPTIONS EXCLUSION
   ===================================================== */

test("OPTIONS preflights never trigger anomalies", () => {
  const anomalies = detectApiAnomalies([
    createEndpoint({
      name: "OPTIONS /api/auth/me",
      requests: 100,
      errors: 30,
      latency: 6000
    })
  ]);

  assert.deepEqual(anomalies, []);
});

/* =====================================================
   TEST 8 — WARNING LATENCY
   ===================================================== */

test("detects warning-level request duration", () => {
  const anomalies = detectApiAnomalies([
    createEndpoint({
      latency: 1500
    })
  ]);

  const finding = anomalies.find(
    item => item.type === "latency"
  );

  assert.ok(finding);
  assert.equal(finding.severity, "warning");
  assert.equal(finding.value, 1500);
});

/* =====================================================
   TEST 9 — CRITICAL LATENCY
   ===================================================== */

test("detects critical request duration", () => {
  const anomalies = detectApiAnomalies([
    createEndpoint({
      latency: 3500
    })
  ]);

  const finding = anomalies.find(
    item => item.type === "latency"
  );

  assert.ok(finding);
  assert.equal(finding.severity, "critical");
});

/* =====================================================
   TEST 10 — MISSING LATENCY
   ===================================================== */

test("missing latency is not treated as zero", () => {
  const endpoint = createEndpoint();

  delete endpoint.averageLatencyMs;

  const anomalies = detectApiAnomalies([endpoint]);

  assert.equal(
    anomalies.some(item => item.type === "latency"),
    false
  );
});

/* =====================================================
   TEST 11 — CRITICAL ABORT RATE
   ===================================================== */

test("detects critical aborted-request rate", () => {
  const anomalies = detectApiAnomalies([
    createEndpoint({
      requests: 20,
      aborted: 4
    })
  ]);

  const finding = anomalies.find(
    item => item.type === "aborted"
  );

  assert.ok(finding);
  assert.equal(finding.severity, "critical");
  assert.equal(finding.value, 20);
});

/* =====================================================
   TEST 12 — WARNING ABORT RATE
   ===================================================== */

test("detects warning-level aborted-request rate", () => {
  const anomalies = detectApiAnomalies([
    createEndpoint({
      requests: 40,
      aborted: 2
    })
  ]);

  const finding = anomalies.find(
    item => item.type === "aborted"
  );

  assert.ok(finding);
  assert.equal(finding.severity, "warning");
  assert.equal(finding.value, 5);
});

/* =====================================================
   TEST 13 — MULTIPLE FINDINGS
   ===================================================== */

test("one endpoint can produce multiple anomalies", () => {
  const anomalies = detectApiAnomalies([
    createEndpoint({
      requests: 20,
      aborted: 2,
      errors: 3,
      latency: 3500
    })
  ]);

  assert.equal(anomalies.length, 3);

  assert.deepEqual(
    new Set(anomalies.map(item => item.type)),
    new Set([
      "server_error",
      "latency",
      "aborted"
    ])
  );

  assert.ok(
    anomalies.every(item => item.severity === "critical")
  );
});

/* =====================================================
   TEST 14 — SEVERITY SORTING
   ===================================================== */

test("critical findings appear before warnings", () => {
  const anomalies = detectApiAnomalies([
    createEndpoint({
      name: "GET /api/journal",
      requests: 40,
      errors: 2
    }),

    createEndpoint({
      name: "GET /api/community",
      requests: 20,
      errors: 3
    })
  ]);

  assert.equal(anomalies.length, 2);
  assert.equal(anomalies[0].severity, "critical");
  assert.equal(anomalies[1].severity, "warning");
});

/* =====================================================
   TEST 15 — INVALID INPUT
   ===================================================== */

test("invalid input is handled safely", () => {
  assert.deepEqual(detectApiAnomalies(null), []);
  assert.deepEqual(detectApiAnomalies({}), []);
  assert.deepEqual(detectApiAnomalies([null]), []);
});

/* =====================================================
   TEST 16 — AGGREGATED OTHER LABEL
   ===================================================== */

test("unattributed OTHER traffic is ignored", () => {
  const anomalies = detectApiAnomalies([
    createEndpoint({
      name: "OTHER",
      requests: 100,
      errors: 50,
      latency: 5000
    })
  ]);

  assert.deepEqual(anomalies, []);
});

/* =====================================================
   TEST 17 — THRESHOLD CONFIGURATION
   ===================================================== */

test("configured thresholds remain consistent", () => {
  assert.equal(MIN_REQUESTS, 5);

  assert.deepEqual(THRESHOLDS, {
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
  });
});

/* =====================================================
   TEST 18 — INVALID RESPONSE COUNTS
   ===================================================== */

test("invalid 5xx counts cannot create false alerts", () => {
  const endpoint = createEndpoint({
    requests: 10
  });

  endpoint.statusCodes["5xx"] = 50;

  const anomalies = detectApiAnomalies([endpoint]);

  assert.equal(
    anomalies.some(item => item.type === "server_error"),
    false
  );
});
