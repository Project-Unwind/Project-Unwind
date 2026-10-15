
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
  // Record high-resolution start time
  const startTime = process.hrtime.bigint();

  requestStarted();

  // Prevent duplicate recording
  let completed = false;

  function finish(aborted = false) {
    if (completed) return;

    completed = true;

    const durationMs =
      Number(process.hrtime.bigint() - startTime) /
      1_000_000;

    requestFinished(
      req.method,
      req.originalUrl,
      res.statusCode,
      durationMs,
      aborted
    );
  }

  // Response completed successfully or with an HTTP error
  res.once("finish", () => {
    finish(false);
  });

  // Response connection closed before completion
  res.once("close", () => {
    if (!res.writableFinished) {
      finish(true);
    }
  });

  next();
}

