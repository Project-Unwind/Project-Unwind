
import test from "node:test";
import assert from "node:assert/strict";

import {
  calculateEndpointMetrics,
  getEndpointStatus,
  prepareEndpoint,
  processEndpoints,
  compareEndpoints,
  formatLatency,
  escapeCSV,
  createDiagnosticsCSV
} from "../../src/utils/monitoring/endpointDiagnostics.js";

function makeEndpoint({
  name = "GET /api/journal",
  requests = 20,
  aborted = 0,
  errors = 0,
  latency = 200,
  p95 = 300
} = {}) {
  return {
    endpoint: name,
    requests,
    abortedRequests: aborted,
    averageLatencyMs: latency,
    p50LatencyMs: 100,
    p95LatencyMs: p95,
    p99LatencyMs: 500,
    maxLatencyMs: 600,
    statusCodes: {
      "2xx": Math.max(
        0,
        requests - aborted - errors
      ),
      "3xx": 0,
      "4xx": 0,
      "5xx": errors
    }
  };
}

test("normalizes endpoint metrics", () => {
  const stats = calculateEndpointMetrics(
    makeEndpoint()
  );

  assert.equal(stats.requests, 20);
  assert.equal(stats.completedResponses, 20);
  assert.equal(stats.errorRatePercent, 0);
  assert.equal(stats.abortedRatePercent, 0);
});

test("calculates 5xx rate from completed responses", () => {
  const stats = calculateEndpointMetrics(
    makeEndpoint({
      requests: 10,
      aborted: 2,
      errors: 1
    })
  );

  assert.equal(stats.completedResponses, 8);
  assert.equal(stats.errorRatePercent, 12.5);
  assert.equal(stats.abortedRatePercent, 20);
});

test("classifies healthy endpoints", () => {
  const item = prepareEndpoint(makeEndpoint());

  assert.equal(item.status, "healthy");
});

test("classifies insufficient traffic", () => {
  const item = prepareEndpoint(
    makeEndpoint({ requests: 4 })
  );

  assert.equal(item.status, "insufficient");
});

test("classifies slow endpoints", () => {
  const item = prepareEndpoint(
    makeEndpoint({ latency: 1500 })
  );

  assert.equal(item.status, "slow");
});

test("classifies server errors", () => {
  const item = prepareEndpoint(
    makeEndpoint({ errors: 2 })
  );

  assert.equal(item.status, "errors");
});

test("classifies excessive aborted requests", () => {
  const item = prepareEndpoint(
    makeEndpoint({ aborted: 3 })
  );

  assert.equal(item.status, "aborted");
});

test("classifies OPTIONS as preflight", () => {
  const item = prepareEndpoint(
    makeEndpoint({
      name: "OPTIONS /api/auth/me",
      requests: 100
    })
  );

  assert.equal(item.status, "preflight");
});

test("missing measurements are not healthy", () => {
  const endpoint = makeEndpoint();
  delete endpoint.averageLatencyMs;

  assert.equal(
    prepareEndpoint(endpoint).status,
    "insufficient"
  );
});

test("invalid error counts are not accepted", () => {
  const endpoint = makeEndpoint({
    requests: 10
  });

  endpoint.statusCodes["5xx"] = 99;

  const stats = calculateEndpointMetrics(endpoint);

  assert.equal(stats.errorRatePercent, null);
  assert.equal(
    getEndpointStatus(endpoint, stats),
    "insufficient"
  );
});

test("search is case insensitive", () => {
  const result = processEndpoints(
    [
      makeEndpoint({
        name: "GET /api/journal"
      }),
      makeEndpoint({
        name: "GET /api/auth/me"
      })
    ],
    { search: "JOURNAL" }
  );

  assert.equal(result.length, 1);
  assert.equal(
    result[0].endpoint.endpoint,
    "GET /api/journal"
  );
});

test("filters endpoints by status", () => {
  const result = processEndpoints(
    [
      makeEndpoint({
        name: "GET /api/journal"
      }),
      makeEndpoint({
        name: "GET /api/auth/me",
        latency: 2000
      })
    ],
    { filter: "slow" }
  );

  assert.equal(result.length, 1);
  assert.equal(result[0].status, "slow");
});

test("sorts requests in descending order", () => {
  const result = processEndpoints(
    [
      makeEndpoint({
        name: "GET /api/a",
        requests: 5
      }),
      makeEndpoint({
        name: "GET /api/b",
        requests: 50
      })
    ]
  );

  assert.equal(
    result[0].endpoint.endpoint,
    "GET /api/b"
  );
});

test("sorts ascending correctly", () => {
  const result = processEndpoints(
    [
      makeEndpoint({
        name: "GET /api/a",
        requests: 50
      }),
      makeEndpoint({
        name: "GET /api/b",
        requests: 5
      })
    ],
    {
      sortKey: "requests",
      sortDirection: "asc"
    }
  );

  assert.equal(
    result[0].endpoint.endpoint,
    "GET /api/b"
  );
});

test("sorts missing values last", () => {
  const missing = makeEndpoint({
    name: "GET /api/missing"
  });

  delete missing.averageLatencyMs;

  const result = processEndpoints(
    [
      missing,
      makeEndpoint({
        name: "GET /api/normal"
      })
    ],
    {
      sortKey: "averageLatencyMs",
      sortDirection: "asc"
    }
  );

  assert.equal(
    result[1].endpoint.endpoint,
    "GET /api/missing"
  );
});

test("sorts histogram overflow above finite P95", () => {
  const result = processEndpoints(
    [
      makeEndpoint({
        name: "GET /api/normal",
        p95: 2000
      }),
      makeEndpoint({
        name: "GET /api/overflow",
        p95: null
      })
    ],
    {
      sortKey: "p95LatencyMs",
      sortDirection: "desc"
    }
  );

  assert.equal(
    result[0].endpoint.endpoint,
    "GET /api/overflow"
  );
});

test("formats missing latency correctly", () => {
  assert.equal(
    formatLatency(undefined, 10),
    "N/A"
  );

  assert.equal(
    formatLatency(null, 10),
    "> 10,000 ms"
  );

  assert.equal(
    formatLatency(125.5, 10),
    "125.50 ms"
  );
});

test("escapes CSV quotation marks", () => {
  assert.equal(
    escapeCSV('GET /api/"test"'),
    '"GET /api/""test"""'
  );
});

test("neutralizes leading spreadsheet formulas", () => {
  for (const prefix of ["=", "+", "-", "@"]) {
    const result = escapeCSV(
      `${prefix}SUM(1,1)`
    );

    assert.ok(result.startsWith('"\''));
  }
});

test("neutralizes formulas with leading whitespace", () => {
  const result = escapeCSV(
    "   =HYPERLINK(\"test\")"
  );

  assert.ok(result.startsWith('"\''));
});

test("removes newlines from CSV cells", () => {
  const result = escapeCSV(
    "GET /api/a\n=SUM(1,1)"
  );

  assert.equal(result.includes("\n"), false);
});

test("generates CSV with correct data", () => {
  const item = prepareEndpoint(
    makeEndpoint({
      requests: 10,
      aborted: 2,
      errors: 1
    })
  );

  const csv = createDiagnosticsCSV([item]);
  const lines = csv.split("\r\n");

  assert.equal(lines.length, 2);
  assert.ok(lines[0].includes("Completed Responses"));
  assert.ok(lines[1].includes('"12.5"'));
  assert.ok(lines[1].includes('"20"'));
  assert.ok(lines[1].includes('"errors"'));
});

test("CSV handles missing measurements", () => {
  const endpoint = makeEndpoint();
  delete endpoint.averageLatencyMs;

  const csv = createDiagnosticsCSV([
    prepareEndpoint(endpoint)
  ]);

  assert.ok(csv.includes('"insufficient"'));
  assert.ok(csv.includes('""'));
});

test("invalid endpoint collections are handled", () => {
  assert.deepEqual(processEndpoints(null), []);
  assert.deepEqual(processEndpoints({}), []);
  assert.deepEqual(processEndpoints([null]), []);
});

test("sorting is deterministic for equal values", () => {
  const a = prepareEndpoint(
    makeEndpoint({ name: "GET /api/a" })
  );

  const b = prepareEndpoint(
    makeEndpoint({ name: "GET /api/b" })
  );

  assert.ok(
    compareEndpoints(a, b, "requests", "desc") < 0
  );
});
