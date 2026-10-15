
import test, { beforeEach } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import express from "express";

import {
  apiMonitoring
} from "../../src/middleware/apiMonitoring.js";

import {
  getApiMetrics,
  requestStarted,
  requestFinished,
  resetApiMetricsForTesting
} from "../../src/services/monitoring/apiMetrics.service.js";

/* =====================================================
   TEST EXPRESS APPLICATION
   ===================================================== */

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
  res.status(200).json({ success: true });
});

app.get("/test/slow", (req, res) => {
  setTimeout(() => {
    if (!res.destroyed) {
      res.status(200).json({ success: true });
    }
  }, 1000);
});

app.get("/test/concurrent", (req, res) => {
  setTimeout(() => {
    if (!res.destroyed) {
      res.status(200).json({ success: true });
    }
  }, 50);
});

// Used to test distinct static route identification.
app.get("/api/admin/settings", (req, res) => {
  res.status(200).json({ success: true });
});

app.get("/api/admin/overview", (req, res) => {
  res.status(200).json({ success: true });
});

/* =====================================================
   TEST HELPERS
   ===================================================== */

async function startServer() {
  const server = http.createServer(app);

  await new Promise(resolve => {
    server.listen(0, "127.0.0.1", resolve);
  });

  return {
    server,
    port: server.address().port
  };
}

async function stopServer(server) {
  await new Promise((resolve, reject) => {
    server.close(error => {
      if (error) reject(error);
      else resolve();
    });
  });
}

function sendRequest(port, path, abort = false) {
  return new Promise((resolve, reject) => {
    const req = http.get(
      {
        hostname: "127.0.0.1",
        port,
        path
      },
      res => {
        res.resume();

        res.on("end", () => {
          resolve(res.statusCode);
        });

        res.on("error", error => {
          reject(error);
        });
      }
    );

    req.on("error", error => {
      if (abort && error.code === "ECONNRESET") {
        resolve("ABORTED");
      } else {
        reject(error);
      }
    });

    if (abort) {
      setTimeout(() => {
        req.destroy();
      }, 100);
    }
  });
}

function findEndpoint(metrics, route) {
  return metrics.endpoints.find(
    item => item.endpoint === route
  );
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/* =====================================================
   TEST ISOLATION
   ===================================================== */

beforeEach(() => {
  resetApiMetricsForTesting();
});

/* =====================================================
   TEST 1 — REGRESSION
   ===================================================== */

test("API monitoring regression tests", async () => {
  const { server, port } = await startServer();

  try {
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

    await wait(50);

    const metrics = getApiMetrics();

    assert.equal(metrics.requests, 4);
    assert.equal(metrics.statusCodes["2xx"], 1);
    assert.equal(metrics.statusCodes["4xx"], 1);
    assert.equal(metrics.statusCodes["5xx"], 1);
    assert.equal(metrics.abortedRequests, 1);
    assert.equal(metrics.activeRequests, 0);

    // Static route names must remain distinguishable.
    const successEndpoint = findEndpoint(
      metrics,
      "GET /test/success"
    );

    const notFoundEndpoint = findEndpoint(
      metrics,
      "GET /test/notfound"
    );

    const errorEndpoint = findEndpoint(
      metrics,
      "GET /test/error"
    );

    const slowEndpoint = findEndpoint(
      metrics,
      "GET /test/slow"
    );

    assert.ok(successEndpoint);
    assert.ok(notFoundEndpoint);
    assert.ok(errorEndpoint);
    assert.ok(slowEndpoint);

    assert.equal(successEndpoint.requests, 1);
    assert.equal(notFoundEndpoint.requests, 1);
    assert.equal(errorEndpoint.requests, 1);
    assert.equal(slowEndpoint.requests, 1);

    assert.equal(
      slowEndpoint.abortedRequests,
      1
    );

    // The one aborted request is excluded from
    // the denominator for HTTP 5xx response rate.
    assert.equal(
      metrics.errorRatePercent,
      33.33
    );

    console.log("\nREGRESSION RESULTS");
    console.log({
      requests: metrics.requests,
      statusCodes: metrics.statusCodes,
      abortedRequests: metrics.abortedRequests,
      errorRatePercent: metrics.errorRatePercent,
      endpoints: metrics.endpoints.map(
        item => item.endpoint
      )
    });

  } finally {
    await stopServer(server);
  }
});

/* =====================================================
   TEST 2 — EXACTLY ONCE RECORDING
   ===================================================== */

test(
  "completed requests are counted exactly once",
  async () => {
    const { server, port } = await startServer();

    try {
      const status = await sendRequest(
        port,
        "/test/success"
      );

      assert.equal(status, 200);

      const metrics = getApiMetrics();

      assert.equal(metrics.requests, 1);
      assert.equal(metrics.statusCodes["2xx"], 1);
      assert.equal(metrics.abortedRequests, 0);
      assert.equal(metrics.activeRequests, 0);

      const endpoint = findEndpoint(
        metrics,
        "GET /test/success"
      );

      assert.ok(endpoint);
      assert.equal(endpoint.requests, 1);

    } finally {
      await stopServer(server);
    }
  }
);

/* =====================================================
   TEST 3 — LATENCY METRICS
   ===================================================== */

test(
  "API latency metrics are calculated correctly",
  async () => {
    const { server, port } = await startServer();

    try {
      const before = getApiMetrics();

      assert.equal(before.requests, 0);

      const status = await sendRequest(
        port,
        "/test/slow"
      );

      assert.equal(status, 200);

      const metrics = getApiMetrics();

      assert.equal(metrics.requests, 1);
      assert.equal(metrics.statusCodes["2xx"], 1);
      assert.equal(metrics.abortedRequests, 0);

      const endpoint = findEndpoint(
        metrics,
        "GET /test/slow"
      );

      assert.ok(
        endpoint,
        "Slow endpoint metrics must exist"
      );

      assert.equal(endpoint.requests, 1);

      assert.ok(
        endpoint.averageLatencyMs >= 900,
        "Average latency should reflect the delay"
      );

      assert.ok(
        endpoint.maxLatencyMs >= 900,
        "Maximum latency should reflect the delay"
      );

      assert.ok(
        endpoint.p95LatencyMs !== null &&
        endpoint.p95LatencyMs >= 1000,
        "P95 must reflect the slow request"
      );

      assert.ok(
        Math.abs(
          endpoint.averageLatencyMs -
          endpoint.maxLatencyMs
        ) < 1,
        "Single-request average and maximum should match"
      );

      assert.equal(metrics.activeRequests, 0);

      console.log("\nLATENCY TEST RESULTS");
      console.log({
        requests: endpoint.requests,
        averageLatencyMs: endpoint.averageLatencyMs,
        p95LatencyMs: endpoint.p95LatencyMs,
        maxLatencyMs: endpoint.maxLatencyMs,
        abortedRequests: endpoint.abortedRequests
      });

    } finally {
      await stopServer(server);
    }
  }
);

/* =====================================================
   TEST 4 — PRIVACY
   ===================================================== */

test(
  "API monitoring does not expose sensitive URL data",
  async () => {
    const { server, port } = await startServer();

    const sensitiveId = "private-user-12345";
    const sensitiveToken = "secret-jwt-value";

    try {
      const status = await sendRequest(
        port,
        `/api/journal/${sensitiveId}?token=${sensitiveToken}`
      );

      assert.equal(status, 200);

      const metrics = getApiMetrics();

      const endpoint = findEndpoint(
        metrics,
        "GET /api/journal/:param"
      );

      assert.ok(
        endpoint,
        "Dynamic journal ID must be sanitized"
      );

      assert.equal(endpoint.requests, 1);

      const serialized = JSON.stringify(metrics);

      assert.equal(
        serialized.includes(sensitiveId),
        false,
        "User ID must not appear in metrics"
      );

      assert.equal(
        serialized.includes(sensitiveToken),
        false,
        "Query token must not appear in metrics"
      );

      console.log(
        "\nPRIVACY CHECK PASSED:",
        endpoint.endpoint
      );

    } finally {
      await stopServer(server);
    }
  }
);

/* =====================================================
   TEST 5 — CONCURRENCY
   ===================================================== */

test(
  "50 concurrent requests are recorded accurately",
  async () => {
    const { server, port } = await startServer();

    const CONCURRENT_REQUESTS = 50;

    try {
      const responses = await Promise.all(
        Array.from(
          { length: CONCURRENT_REQUESTS },
          () => sendRequest(
            port,
            "/test/concurrent"
          )
        )
      );

      assert.equal(
        responses.length,
        CONCURRENT_REQUESTS
      );

      assert.ok(
        responses.every(status => status === 200),
        "All concurrent requests must succeed"
      );

      const metrics = getApiMetrics();

      const endpoint = findEndpoint(
        metrics,
        "GET /test/concurrent"
      );

      assert.ok(
        endpoint,
        "Concurrent endpoint metrics must exist"
      );

      assert.equal(
        metrics.requests,
        CONCURRENT_REQUESTS
      );

      assert.equal(
        endpoint.requests,
        CONCURRENT_REQUESTS
      );

      assert.equal(
        metrics.statusCodes["2xx"],
        CONCURRENT_REQUESTS
      );

      assert.equal(
        metrics.abortedRequests,
        0
      );

      assert.equal(
        metrics.activeRequests,
        0
      );

      console.log("\nCONCURRENCY TEST RESULTS");
      console.log({
        concurrentRequests: CONCURRENT_REQUESTS,
        successfulResponses: responses.length,
        requestsRecorded: metrics.requests,
        endpointRequestsRecorded: endpoint.requests,
        activeRequests: metrics.activeRequests
      });

    } finally {
      await stopServer(server);
    }
  }
);

/* =====================================================
   TEST 6 — STATIC ROUTE SEPARATION
   ===================================================== */

test(
  "distinct static Express routes remain separate",
  async () => {
    const { server, port } = await startServer();

    try {
      assert.equal(
        await sendRequest(
          port,
          "/api/admin/settings"
        ),
        200
      );

      assert.equal(
        await sendRequest(
          port,
          "/api/admin/overview"
        ),
        200
      );

      const metrics = getApiMetrics();

      const settingsEndpoint = findEndpoint(
        metrics,
        "GET /api/admin/settings"
      );

      const overviewEndpoint = findEndpoint(
        metrics,
        "GET /api/admin/overview"
      );

      assert.ok(
        settingsEndpoint,
        "Settings route must be preserved"
      );

      assert.ok(
        overviewEndpoint,
        "Overview route must be preserved"
      );

      assert.equal(settingsEndpoint.requests, 1);
      assert.equal(overviewEndpoint.requests, 1);
      assert.equal(metrics.requests, 2);

      console.log("\nSTATIC ROUTE SEPARATION PASSED");
      console.log(
        metrics.endpoints.map(
          item => item.endpoint
        )
      );

    } finally {
      await stopServer(server);
    }
  }
);

/* =====================================================
   TEST 7 — HTTP ERROR RATE DENOMINATOR
   ===================================================== */

test(
  "HTTP 5xx rate excludes aborted requests",
  () => {
    // One successful completed HTTP response.
    requestStarted();

    requestFinished(
      "GET",
      "/test/success",
      200,
      20,
      false
    );

    // One completed HTTP 500 response.
    requestStarted();

    requestFinished(
      "GET",
      "/test/error",
      500,
      30,
      false
    );

    // One aborted request without an HTTP response.
    requestStarted();

    requestFinished(
      "GET",
      "/test/slow",
      200,
      100,
      true
    );

    const metrics = getApiMetrics();

    assert.equal(metrics.requests, 3);

    assert.equal(
      metrics.abortedRequests,
      1
    );

    assert.equal(
      metrics.statusCodes["2xx"],
      1
    );

    assert.equal(
      metrics.statusCodes["5xx"],
      1
    );

    // 1 HTTP 500 / 2 completed responses = 50%.
    assert.equal(
      metrics.errorRatePercent,
      50
    );

    assert.equal(
      metrics.abortedRatePercent,
      33.33
    );

    assert.equal(metrics.activeRequests, 0);

    console.log("\nERROR RATE TEST RESULTS");
    console.log({
      totalRequests: metrics.requests,
      completedResponses:
        metrics.requests - metrics.abortedRequests,
      abortedRequests: metrics.abortedRequests,
      errorRatePercent: metrics.errorRatePercent,
      abortedRatePercent: metrics.abortedRatePercent
    });
  }
);
