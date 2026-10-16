
import test from "node:test";
import assert from "node:assert/strict";

import {
  requestStarted,
  requestFinished,
  getApiMetrics,
  resetApiMetricsForTesting
} from "../../src/services/monitoring/apiMetrics.service.js";

/* =====================================================
   TEST HELPERS
   ===================================================== */

function recordRequest({
  method = "GET",
  rawPath = "/",
  routeTemplate = null,
  trustedBase = "",
  statusCode = 200
} = {}) {
  requestStarted();

  requestFinished(
    method,
    rawPath,
    statusCode,
    25,
    false,
    routeTemplate,
    trustedBase
  );
}

function getLabels() {
  return getApiMetrics().endpoints.map(
    endpoint => endpoint.endpoint
  );
}

function reset() {
  resetApiMetricsForTesting();
}

/* =====================================================
   1. DYNAMIC IDENTIFIER PRIVACY
   ===================================================== */

test(
  "nested router masks dynamic user identifiers",
  () => {
    reset();

    recordRequest({
      rawPath: "/api/users/user-829/profile",
      routeTemplate: "/profile"
    });

    const labels = getLabels();

    assert.equal(labels.length, 1);

    assert.equal(
      labels[0],
      "GET /api/:param/:param/:param"
    );

    assert.ok(!labels[0].includes("user-829"));
  }
);

/* =====================================================
   2. STATIC-NAME COLLISION
   ===================================================== */

test(
  "dynamic values matching static names are masked",
  () => {
    reset();

    recordRequest({
      rawPath: "/api/users/admin/profile",
      routeTemplate: "/profile"
    });

    assert.equal(
      getLabels()[0],
      "GET /api/:param/:param/:param"
    );
  }
);

/* =====================================================
   3. QUERY PARAMETER PRIVACY
   ===================================================== */

test(
  "matched route does not expose query parameters",
  () => {
    reset();

    recordRequest({
      rawPath:
        "/api/users/123/profile?token=secret-value",
      routeTemplate: "/profile"
    });

    const label = getLabels()[0];

    assert.equal(
      label,
      "GET /api/:param/:param/:param"
    );

    assert.ok(!label.includes("123"));
    assert.ok(!label.includes("token"));
    assert.ok(!label.includes("secret-value"));
  }
);

/* =====================================================
   4. UNMATCHED ROUTE PRIVACY
   ===================================================== */

test(
  "unmatched routes mask unknown segments",
  () => {
    reset();

    recordRequest({
      rawPath:
        "/api/journal/private-user-123?key=secret"
    });

    const label = getLabels()[0];

    assert.equal(
      label,
      "GET /api/:param/:param"
    );

    assert.ok(!label.includes("private-user-123"));
    assert.ok(!label.includes("secret"));
  }
);

/* =====================================================
   5. TRUSTED STATIC ROUTE
   ===================================================== */

test(
  "matched static route templates remain readable",
  () => {
    reset();

    recordRequest({
      rawPath:
        "/api/admin/monitoring/overview",
      trustedBase: "/api/admin/monitoring",
      routeTemplate: "/overview"
    });

    assert.equal(
      getLabels()[0],
      "GET /api/admin/monitoring/overview"
    );
  }
);

/* =====================================================
   6. TRUSTED ROUTE PARAMETERS
   ===================================================== */

test(
  "route template parameters are normalized",
  () => {
    reset();

    recordRequest({
      rawPath: "/api/journal/abc123",
      trustedBase: "/api/journal",
      routeTemplate: "/:entryId"
    });

    assert.equal(
      getLabels()[0],
      "GET /api/journal/:param"
    );
  }
);

/* =====================================================
   7. ENDPOINT STORAGE LIMIT
   ===================================================== */

test(
  "endpoint storage respects the configured cap",
  () => {
    reset();

    for (let i = 0; i < 150; i++) {
      recordRequest({
        rawPath: `/api/journal/route-${i}`,
        trustedBase: "/api/journal",
        routeTemplate: `/route-${i}`
      });
    }

    const metrics = getApiMetrics();

    assert.equal(metrics.requests, 150);

    assert.ok(
      metrics.endpoints.length <= 100,
      `Expected at most 100 endpoint labels, got ${
        metrics.endpoints.length
      }`
    );

    const other = metrics.endpoints.find(
      endpoint => endpoint.endpoint === "OTHER"
    );

    assert.ok(
      other,
      "Expected overflow traffic in OTHER bucket"
    );

    assert.ok(other.requests > 0);

    const endpointRequestTotal =
      metrics.endpoints.reduce(
        (total, endpoint) =>
          total + endpoint.requests,
        0
      );

    assert.equal(endpointRequestTotal, 150);
  }
);

/* =====================================================
   8. REQUEST COUNT ACCURACY
   ===================================================== */

test(
  "request counts remain accurate after normalization",
  () => {
    reset();

    recordRequest({
      rawPath: "/api/users/111/profile",
      routeTemplate: "/profile"
    });

    recordRequest({
      rawPath: "/api/users/222/profile",
      routeTemplate: "/profile"
    });

    const metrics = getApiMetrics();

    assert.equal(metrics.requests, 2);

    assert.equal(metrics.endpoints.length, 1);

    assert.equal(
      metrics.endpoints[0].endpoint,
      "GET /api/:param/:param/:param"
    );

    assert.equal(metrics.endpoints[0].requests, 2);
    assert.equal(metrics.activeRequests, 0);
  }
);

/* =====================================================
   9. TRUSTED PREFIX COLLISION
   ===================================================== */

test(
  "dynamic router values cannot impersonate trusted static paths",
  () => {
    reset();

    // A dynamic section has the value "posts".
    // No trusted mount was provided.
    recordRequest({
      rawPath: "/api/community/posts/details",
      routeTemplate: "/details"
    });

    const label = getLabels()[0];

    assert.equal(
      label,
      "GET /api/:param/:param/:param"
    );

    assert.ok(!label.includes("community"));
    assert.ok(!label.includes("posts"));
    assert.ok(!label.includes("details"));
  }
);

/* =====================================================
   10. ADMIN PREFIX COLLISION
   ===================================================== */

test(
  "dynamic values matching admin prefix remain masked",
  () => {
    reset();

    // No trusted mount was provided.
    // The raw URL must not establish trust.
    recordRequest({
      rawPath: "/api/admin/settings",
      routeTemplate: "/settings"
    });

    const label = getLabels()[0];

    assert.equal(
      label,
      "GET /api/:param/:param"
    );

    assert.ok(!label.includes("admin"));
    assert.ok(!label.includes("settings"));
  }
);
