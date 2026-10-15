
import test from "node:test";
import assert from "node:assert/strict";

import {
  calculateServiceMetrics,
  classifyServiceHealth,
  belongsToService,
  parseEndpoint
} from "../../src/utils/monitoring/serviceHealth.js";

function endpoint(
  name,
  requests,
  {
    aborted = 0,
    errors = 0,
    latency = 100
  } = {}
) {
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

test("parses HTTP endpoint labels", () => {
  assert.deepEqual(
    parseEndpoint("GET /api/journal/:param"),
    {
      method: "GET",
      path: "/api/journal/:param"
    }
  );
});

test("groups endpoints by exact module prefixes", () => {
  assert.equal(
    belongsToService(
      endpoint("GET /api/chat-messages/history", 5),
      "chat"
    ),
    true
  );

  assert.equal(
    belongsToService(
      endpoint("GET /api/chatbot/summary", 5),
      "chat"
    ),
    false
  );

  assert.equal(
    belongsToService(
      endpoint("GET /api/admin/overview", 5),
      "admin"
    ),
    true
  );
});

test("excludes OPTIONS requests from health metrics", () => {
  const metrics = calculateServiceMetrics("auth", [
    endpoint("OPTIONS /api/auth/me", 100, {
      latency: 2
    }),
    endpoint("GET /api/auth/me", 10, {
      latency: 200
    })
  ]);

  assert.equal(metrics.requests, 10);
  assert.equal(metrics.preflightRequests, 100);
  assert.equal(metrics.averageLatencyMs, 200);
  assert.equal(metrics.health, "healthy");
});

test("calculates weighted average latency", () => {
  const metrics = calculateServiceMetrics("journal", [
    endpoint("GET /api/journal", 8, {
      latency: 100
    }),
    endpoint("POST /api/journal", 2, {
      latency: 600
    })
  ]);

  assert.equal(metrics.requests, 10);
  assert.equal(metrics.averageLatencyMs, 200);
});

test("excludes aborted requests from 5xx denominator", () => {
  const metrics = calculateServiceMetrics("journal", [
    endpoint("GET /api/journal", 10, {
      aborted: 2,
      errors: 1
    })
  ]);

  assert.equal(metrics.completedResponses, 8);
  assert.equal(metrics.errorRatePercent, 12.5);
  assert.equal(metrics.abortedRatePercent, 20);
  assert.equal(metrics.health, "critical");
});

test("returns unknown for insufficient traffic", () => {
  const metrics = calculateServiceMetrics("chat", [
    endpoint("GET /api/chat", 3)
  ]);

  assert.equal(metrics.requests, 3);
  assert.equal(metrics.health, "unknown");
});

test("detects degraded service latency", () => {
  const metrics = calculateServiceMetrics("journal", [
    endpoint("GET /api/journal", 10, {
      latency: 1500
    })
  ]);

  assert.equal(metrics.health, "degraded");
});

test("detects critical server errors", () => {
  const metrics = calculateServiceMetrics("admin", [
    endpoint("GET /api/admin/overview", 10, {
      errors: 2
    })
  ]);

  assert.equal(metrics.errorRatePercent, 20);
  assert.equal(metrics.health, "critical");
});

test("reports no activity as unknown", () => {
  const metrics = calculateServiceMetrics("notifications", []);

  assert.equal(metrics.requests, 0);
  assert.equal(metrics.health, "unknown");
});

test("classifies healthy service metrics", () => {
  assert.equal(
    classifyServiceHealth({
      requests: 20,
      errorRatePercent: 0,
      abortedRatePercent: 0,
      averageLatencyMs: 150
    }),
    "healthy"
  );
});
