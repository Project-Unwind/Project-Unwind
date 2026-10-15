
import {
  requestStarted,
  requestFinished
} from "../services/monitoring/apiMetrics.service.js";

/**
 * API Performance Monitoring Middleware
 *
 * Records:
 * - HTTP request counts
 * - Request duration
 * - HTTP status distribution
 * - Active requests
 * - Aborted requests
 *
 * Privacy:
 * - Never stores request bodies
 * - Never stores authorization headers
 * - Never stores query parameters
 * - Uses normalized route templates where possible
 */

function getMonitoringPath(req) {
  const routePath = req.route?.path;

  // Use the matched Express route when available.
  if (typeof routePath === "string") {
    const baseUrl = req.baseUrl || "";

    const fullPath = `${baseUrl}/${routePath}`
      .replace(/\/+/g, "/");

    return fullPath;
  }

  // Fallback for unmatched requests and unsupported
  // route patterns. The metrics service sanitizes this.
  return req.originalUrl || req.path || "/";
}

export function apiMonitoring(req, res, next) {
  const startTime = process.hrtime.bigint();

  requestStarted();

  let completed = false;

  function finish(aborted = false) {
    if (completed) return;

    completed = true;

    const durationMs =
      Number(process.hrtime.bigint() - startTime) /
      1_000_000;

    
requestFinished(
  req.method,
  req.originalUrl || req.path || "/",
  res.statusCode,
  durationMs,
  aborted,
  typeof req.route?.path === "string"
    ? req.route.path
    : null,
  req.baseUrl || ""
);

  }

  res.once("finish", () => {
    finish(false);
  });

  res.once("close", () => {
    if (!res.writableFinished) {
      finish(true);
    }
  });

  next();
}
