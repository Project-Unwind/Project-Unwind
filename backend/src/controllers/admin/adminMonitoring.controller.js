
import {
  getApiMetrics
} from "../../services/monitoring/apiMetrics.service.js";

/**
 * Admin API Monitoring Controller
 *
 * Retrieves API performance statistics collected
 * by the in-memory monitoring service.
 *
 * Features:
 * - Total request count
 * - Average response latency
 * - P50, P95 and P99 response latency
 * - HTTP status code distribution
 * - Server error rate
 * - Requests per minute
 * - Active requests
 * - Endpoint-level performance statistics
 * - Request trends over the last 60 minutes
 *
 * Resource usage:
 * - No database queries
 * - No database writes
 * - No external API requests
 * - No background jobs
 */

export function getApiMonitoringOverviewController(
  req,
  res
) {
  try {
    // Retrieve aggregated in-memory metrics
    const metrics = getApiMetrics();

    // Disable response caching for live metrics
    res.set("Cache-Control", "no-store");

    return res.status(200).json({
      success: true,
      message: "API monitoring metrics retrieved successfully",
      data: metrics
    });

  } catch (error) {
    // Log error without exposing internal details
    console.error(
      "[API MONITORING] Failed to retrieve metrics:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve API monitoring metrics"
    });
  }
}
