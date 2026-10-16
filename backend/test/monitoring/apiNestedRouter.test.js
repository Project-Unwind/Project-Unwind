
import test, { beforeEach } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import express from "express";

import {
  apiMonitoring,
  monitoredRouter,
  monitoredNestedRouter
} from "../../src/middleware/apiMonitoring.js";

import {
  getApiMetrics,
  resetApiMetricsForTesting
} from "../../src/services/monitoring/apiMetrics.service.js";

/*
 * Representative Express router structure.
 * No real database or authentication required.
 */

const app = express();
app.use(apiMonitoring);

// Journal: /api/journal/entries/:entryId
const journalEntryRouter = express.Router();

journalEntryRouter.get("/:entryId", (req, res) => {
  res.status(200).json({ success: true });
});

const journalRouter = express.Router();

journalRouter.use(
  "/entries",
  ...monitoredNestedRouter("/entries", journalEntryRouter)
);

app.use(
  "/api/journal",
  ...monitoredRouter("/api/journal", journalRouter)
);

// Trackers: /api/trackers/habits/:habitId/logs
const habitLogsRouter = express.Router();

habitLogsRouter.get("/", (req, res) => {
  res.status(200).json({ success: true });
});

const trackerRouter = express.Router();

trackerRouter.use(
  "/habits/:habitId/logs",
  ...monitoredNestedRouter(
    "/habits/:habitId/logs",
    habitLogsRouter
  )
);

app.use(
  "/api/trackers",
  ...monitoredRouter("/api/trackers", trackerRouter)
);

// Static route comparison
const adminRouter = express.Router();

adminRouter.get("/overview", (req, res) => {
  res.status(200).json({ success: true });
});

app.use(
  "/api/admin/monitoring",
  ...monitoredRouter(
    "/api/admin/monitoring",
    adminRouter
  )
);

async function withServer(callback) {
  const server = http.createServer(app);

  await new Promise(resolve => {
    server.listen(0, "127.0.0.1", resolve);
  });

  try {
    const port = server.address().port;
    await callback(port);
  } finally {
    await new Promise((resolve, reject) => {
      server.close(error =>
        error ? reject(error) : resolve()
      );
    });
  }
}

async function sendRequest(port, path) {
  return new Promise((resolve, reject) => {
    http.get(
      {
        hostname: "127.0.0.1",
        port,
        path
      },
      res => {
        res.resume();
        res.on("end", () => resolve(res.statusCode));
        res.on("error", reject);
      }
    ).on("error", reject);
  });
}

function labels() {
  return getApiMetrics().endpoints.map(
    item => item.endpoint
  );
}

beforeEach(() => {
  resetApiMetricsForTesting();
});

test(
  "Journal nested router preserves entries and masks entry ID",
  async () => {
    await withServer(async port => {
      const status = await sendRequest(
        port,
        "/api/journal/entries/private-entry-123?token=secret"
      );

      assert.equal(status, 200);

      const result = labels();

      console.log("JOURNAL LABEL:", result);

      assert.deepEqual(result, [
        "GET /api/journal/entries/:param"
      ]);

      const serialized = JSON.stringify(getApiMetrics());

      assert.ok(!serialized.includes("private-entry-123"));
      assert.ok(!serialized.includes("secret"));
    });
  }
);

test(
  "Tracker nested router masks habit ID",
  async () => {
    await withServer(async port => {
      const status = await sendRequest(
        port,
        "/api/trackers/habits/habit-987/logs"
      );

      assert.equal(status, 200);

      const result = labels();

      console.log("TRACKER LABEL:", result);

      assert.deepEqual(result, [
        "GET /api/trackers/habits/:param/logs"
      ]);

      assert.ok(
        !JSON.stringify(getApiMetrics()).includes("habit-987")
      );
    });
  }
);

test(
  "Dynamic habit ID matching a static name is masked",
  async () => {
    await withServer(async port => {
      const status = await sendRequest(
        port,
        "/api/trackers/habits/settings/logs"
      );

      assert.equal(status, 200);

      assert.deepEqual(labels(), [
        "GET /api/trackers/habits/:param/logs"
      ]);
    });
  }
);

test(
  "Trusted admin routes retain static labels",
  async () => {
    await withServer(async port => {
      const status = await sendRequest(
        port,
        "/api/admin/monitoring/overview"
      );

      assert.equal(status, 200);

      assert.deepEqual(labels(), [
        "GET /api/admin/monitoring/overview"
      ]);
    });
  }
);

test(
  "No duplicate request counting across nested routers",
  async () => {
    await withServer(async port => {
      await sendRequest(
        port,
        "/api/journal/entries/first"
      );

      await sendRequest(
        port,
        "/api/journal/entries/second"
      );

      const metrics = getApiMetrics();

      assert.equal(metrics.requests, 2);
      assert.equal(metrics.activeRequests, 0);

      const recordedTotal = metrics.endpoints.reduce(
        (sum, item) => sum + item.requests,
        0
      );

      assert.equal(recordedTotal, 2);
      assert.equal(metrics.endpoints.length, 1);
    });
  }
);
