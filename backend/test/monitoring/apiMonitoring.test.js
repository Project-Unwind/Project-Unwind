
import test, { beforeEach } from "node:test";

import assert from "node:assert/strict";
import http from "node:http";
import express from "express";

import {
  apiMonitoring
} from "../../src/middleware/apiMonitoring.js";


import {
  getApiMetrics,
  resetApiMetricsForTesting
} from "../../src/services/monitoring/apiMetrics.service.js";


// Create isolated Express test application
const app = express();

app.use(apiMonitoring);

app.get("/test/success", (req, res) => {
  res.status(200).json({ success: true });
});

app.get("/test/notfound", (req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.get("/test/error", (req, res) => {
  res.status(500).json({ error: "Test error" });
});

app.get("/api/journal/:id", (req, res) => {
  res.status(200).json({
    success: true
  });
});


app.get("/test/slow", (req, res) => {
  setTimeout(() => {
    if (!res.destroyed) {
      res.status(200).json({ success: true });
    }
  }, 1000);
});

/*
|--------------------------------------------------------------------------
| Concurrent Request Test Route
|--------------------------------------------------------------------------
|
| Simulates a lightweight API operation.
| Does not access Neon or external services.
|
*/

app.get("/test/concurrent", (req, res) => {
  setTimeout(() => {
    res.status(200).json({
      success: true
    });
  }, 50);
});


function sendRequest(port, path, abort = false) {
  return new Promise((resolve, reject) => {
    const req = http.get({
      hostname: "127.0.0.1",
      port,
      path
    }, res => {
      res.resume();
      res.on("end", () => resolve(res.statusCode));
    });

    req.on("error", error => {
      if (abort && error.code === "ECONNRESET") {
        resolve("ABORTED");
      } else {
        reject(error);
      }
    });

    if (abort) {
      setTimeout(() => req.destroy(), 100);
    }
  });
}

/*
|--------------------------------------------------------------------------
| Monitoring Test Isolation
|--------------------------------------------------------------------------
|
| Clear previous test metrics before each test.
| Tests must run without overlapping requests.
|
*/

beforeEach(() => {
  resetApiMetricsForTesting();
});

test("API monitoring regression tests", async () => {
  const server = http.createServer(app);

  await new Promise(resolve => {
    server.listen(0, "127.0.0.1", resolve);
  });

  const port = server.address().port;

  try {
    const before = getApiMetrics();

    assert.equal(
      await sendRequest(port, "/test/success"),
      200
    );

    assert.equal(
      await sendRequest(port, "/test/notfound"),
      404
    );

    assert.equal(
      await sendRequest(port, "/test/error"),
      500
    );

    assert.equal(
      await sendRequest(port, "/test/slow", true),
      "ABORTED"
    );

    // Allow Express response-close handling to complete
    await new Promise(resolve => setTimeout(resolve, 50));

    const after = getApiMetrics();

    assert.equal(
      after.requests - before.requests,
      4
    );

    assert.equal(
      after.statusCodes["2xx"] -
        before.statusCodes["2xx"],
      1
    );

    assert.equal(
      after.statusCodes["4xx"] -
        before.statusCodes["4xx"],
      1
    );

    assert.equal(
      after.statusCodes["5xx"] -
        before.statusCodes["5xx"],
      1
    );

    assert.equal(
      after.abortedRequests - before.abortedRequests,
      1
    );

    const slowEndpoint = after.endpoints.find(
      item => item.endpoint === "GET /:param/:param"
    );

    assert.ok(slowEndpoint);
    assert.equal(slowEndpoint.requests, 4);
    assert.equal(slowEndpoint.abortedRequests, 1);

  } finally {
    await new Promise(resolve => server.close(resolve));
  }
});

test("completed requests are counted exactly once", async () => {
  const server = http.createServer(app);

  await new Promise(resolve => {
    server.listen(0, "127.0.0.1", resolve);
  });

  const port = server.address().port;

  try {
    const before = getApiMetrics();

    const status = await sendRequest(
      port,
      "/test/success"
    );

    assert.equal(status, 200);

    // Allow response lifecycle events to finish
    await new Promise(resolve => setTimeout(resolve, 50));

    const after = getApiMetrics();

    assert.equal(
      after.requests - before.requests,
      1,
      "A completed request must be recorded once"
    );

    assert.equal(
      after.statusCodes["2xx"] -
        before.statusCodes["2xx"],
      1,
      "One successful response must be recorded"
    );

    assert.equal(
      after.abortedRequests - before.abortedRequests,
      0,
      "A completed request must not be marked aborted"
    );
  } finally {
    await new Promise(resolve => server.close(resolve));
  }
});


test("API latency metrics are calculated correctly", async () => {
  const server = http.createServer(app);

  // Start an isolated local HTTP server
  await new Promise(resolve => {
    server.listen(0, "127.0.0.1", resolve);
  });

  const port = server.address().port;

  try {
    // Metrics should be cleared by beforeEach()
    const before = getApiMetrics();

    assert.equal(
      before.requests,
      0,
      "Metrics must start at zero"
    );

    // Send request to the 1000ms slow endpoint
    const status = await sendRequest(
      port,
      "/test/slow"
    );

    // Verify successful HTTP response
    assert.equal(status, 200);

    // Retrieve metrics after request completion
    const after = getApiMetrics();

    // Verify exactly one request was recorded
    assert.equal(
      after.requests,
      1,
      "Exactly one request must be recorded"
    );

    // Verify one successful response
    assert.equal(
      after.statusCodes["2xx"],
      1,
      "One successful response must be recorded"
    );

    // Verify no aborted requests
    assert.equal(
      after.abortedRequests,
      0,
      "Request must not be marked aborted"
    );

    // Find sanitized endpoint statistics
    const endpoint = after.endpoints.find(
      item => item.endpoint === "GET /:param/:param"
    );

    assert.ok(
      endpoint,
      "Slow endpoint metrics must exist"
    );

    // Verify endpoint request count
    assert.equal(
      endpoint.requests,
      1,
      "Only one slow request should be recorded"
    );

    // Verify average latency
    assert.ok(
      endpoint.averageLatencyMs >= 900,
      "Average latency should reflect the 1000ms delay"
    );

    // Verify maximum latency
    assert.ok(
      endpoint.maxLatencyMs >= 900,
      "Maximum latency should reflect the delay"
    );

    // Verify P95 histogram bucket
    assert.ok(
      endpoint.p95LatencyMs !== null &&
      endpoint.p95LatencyMs >= 1000,
      "P95 should include the slow request"
    );

    // Verify average and maximum are consistent
    assert.ok(
      Math.abs(
        endpoint.averageLatencyMs -
        endpoint.maxLatencyMs
      ) < 1,
      "For one request, average and maximum latency should match"
    );

    // Verify active requests return to zero
    assert.equal(
      after.activeRequests,
      0,
      "No requests should remain active"
    );

    console.log("\nLATENCY TEST RESULTS");

    console.log({
      requests: endpoint.requests,
      averageLatencyMs: endpoint.averageLatencyMs,
      p95LatencyMs: endpoint.p95LatencyMs,
      maxLatencyMs: endpoint.maxLatencyMs,
      abortedRequests: endpoint.abortedRequests
    });

  } finally {
    // Always close the temporary test server
    await new Promise(resolve => {
      server.close(resolve);
    });
  }
});


test("API monitoring does not expose sensitive URL data", async () => {
  const server = http.createServer(app);

  await new Promise(resolve => {
    server.listen(0, "127.0.0.1", resolve);
  });

  const port = server.address().port;

  const sensitiveId = "private-user-12345";
  const sensitiveToken = "secret-jwt-value";

  try {
    const status = await sendRequest(
      port,
      `/api/journal/${sensitiveId}?token=${sensitiveToken}`
    );

    assert.equal(status, 200);

    const metrics = getApiMetrics();

    const endpoint = metrics.endpoints.find(
      item => item.endpoint === "GET /api/journal/:param"
    );

    assert.ok(
      endpoint,
      "Sanitized journal endpoint must exist"
    );

    assert.ok(
      endpoint.requests >= 1,
      "Journal request must be recorded"
    );

    const serializedMetrics = JSON.stringify(metrics);

    assert.equal(
      serializedMetrics.includes(sensitiveId),
      false,
      "User identifiers must not appear in metrics"
    );

    assert.equal(
      serializedMetrics.includes(sensitiveToken),
      false,
      "Query tokens must not appear in metrics"
    );

    console.log(
      "Privacy check passed:",
      endpoint.endpoint
    );

  } finally {
    await new Promise(resolve => server.close(resolve));
  }
});

test("50 concurrent requests are recorded accurately", async () => {
  const server = http.createServer(app);

  await new Promise(resolve => {
    server.listen(0, "127.0.0.1", resolve);
  });

  const port = server.address().port;

  const CONCURRENT_REQUESTS = 50;
  const endpointName = "GET /:param/:param";

  try {
    // Snapshot overall and endpoint metrics
    const before = getApiMetrics();

    const endpointBefore = before.endpoints.find(
      item => item.endpoint === endpointName
    );

    const previousEndpointRequests =
      endpointBefore?.requests ?? 0;

    const previousEndpointAborts =
      endpointBefore?.abortedRequests ?? 0;

    // Send 50 requests concurrently
    const responses = await Promise.all(
      Array.from(
        { length: CONCURRENT_REQUESTS },
        () => sendRequest(port, "/test/concurrent")
      )
    );

    // Verify that all requests succeeded
    assert.equal(responses.length, CONCURRENT_REQUESTS);

    assert.ok(
      responses.every(status => status === 200),
      "All concurrent requests must return HTTP 200"
    );

    // Give Express finish events time to settle
    await new Promise(resolve => setTimeout(resolve, 50));

    const after = getApiMetrics();

    const endpointAfter = after.endpoints.find(
      item => item.endpoint === endpointName
    );

    // Verify overall request count
    assert.equal(
      after.requests - before.requests,
      CONCURRENT_REQUESTS,
      "Overall metrics must record all 50 requests"
    );

    // Verify successful HTTP responses
    assert.equal(
      after.statusCodes["2xx"] -
        before.statusCodes["2xx"],
      CONCURRENT_REQUESTS,
      "All 50 requests must be counted as successful"
    );

    // Verify endpoint-level request count
    assert.ok(
      endpointAfter,
      "Concurrent endpoint metrics must exist"
    );

    assert.equal(
      endpointAfter.requests - previousEndpointRequests,
      CONCURRENT_REQUESTS,
      "Endpoint metrics must record all 50 requests"
    );

    // No requests should be aborted
    assert.equal(
      endpointAfter.abortedRequests - previousEndpointAborts,
      0,
      "Concurrent requests must not be marked aborted"
    );

    // Active request counter should return to zero
    assert.equal(
      after.activeRequests,
      0,
      "No requests should remain active"
    );

    console.log("\nCONCURRENCY TEST RESULTS");

    console.log({
      concurrentRequests: CONCURRENT_REQUESTS,
      successfulResponses: responses.length,
      requestsRecorded: after.requests - before.requests,
      endpointRequestsRecorded:
        endpointAfter.requests - previousEndpointRequests,
      activeRequests: after.activeRequests
    });

  } finally {
    await new Promise(resolve => server.close(resolve));
  }
});
