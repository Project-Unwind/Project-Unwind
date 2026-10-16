
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
 * - Passes route information to the metrics service
 *   for normalization and sanitization
 */

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
            req.monitoringTrustedBase || "",
req.monitoringNestedPaths || []
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

/**
 * Registers a static router mount with an explicit
 * developer-defined monitoring prefix.
 *
 * The mountPath must be a static path declared by
 * the application, never a value from req.originalUrl.
 */
export function monitoredRouter(mountPath, router) {
  if (
    typeof mountPath !== "string" ||
    !/^\/[a-zA-Z0-9/_-]+$/.test(mountPath) ||
    mountPath.includes("//")
  ) {
    throw new Error(
      "Monitoring router mount must be a static path"
    );
  }

  return [
    (req, res, next) => {
      req.monitoringTrustedBase = mountPath;
      next();
    },
    router
  ];
}


/**
 * Record a developer-defined nested Express mount.
 *
 * Example:
 * /habits/:habitId/logs
 *
 * Only templates written in source code are accepted.
 * Do not pass req.path, req.baseUrl, or user input.
 */
export function monitoredNestedRouter(
  mountTemplate,
  router
) {
  const segment = "(?:[a-zA-Z0-9_-]+|:[a-zA-Z][a-zA-Z0-9_]*)";
  const validTemplate = new RegExp(
    `^/${segment}(?:/${segment})*$`
  );

  if (
    typeof mountTemplate !== "string" ||
    !validTemplate.test(mountTemplate)
  ) {
    throw new Error(
      "Invalid nested monitoring route template"
    );
  }

  return [
    (req, res, next) => {
      req.monitoringNestedPaths = [
        ...(req.monitoringNestedPaths || []),
        mountTemplate
      ];

      next();
    },
    router
  ];
}
