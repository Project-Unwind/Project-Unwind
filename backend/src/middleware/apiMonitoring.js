
import {
  requestStarted,
  requestFinished
} from "../services/monitoring/apiMetrics.service.js";

/**
 * API Performance Monitoring Middleware
 *
 * Tracks:
 * - Incoming HTTP requests
 * - Request processing duration
 * - HTTP response status codes
 * - Concurrent active requests
 *
 * Does not store:
 * - Request bodies
 * - Authentication tokens
 * - User information
 * - Journal entries
 * - Query parameters
 */

export function apiMonitoring(req, res, next) {
  // Record high-resolution request start time
  const startTime = process.hrtime.bigint();

  // Increase active request counter
  requestStarted();

  // Prevent recording the same request twice
  let completed = false;

  function finish() {
    if (completed) return;

    completed = true;

    // Calculate elapsed time in milliseconds
    const durationMs =
      Number(process.hrtime.bigint() - startTime) /
      1_000_000;

    // Send performance data to metrics service
    requestFinished(
      req.method,
      req.originalUrl,
      res.statusCode,
      durationMs
    );
  }

  // Called when response completes normally
  res.once("finish", finish);

  // Called when connection closes unexpectedly
  res.once("close", () => {
    if (!res.writableFinished) {
      finish();
    }
  });

  // Continue to next Express middleware
  next();
}
