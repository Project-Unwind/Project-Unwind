
import api from "../api";

/**
 * Admin API Monitoring Service
 *
 * Uses Unwind's existing Axios client.
 *
 * Features:
 * - JWT authentication
 * - Admin access cookies
 * - Existing token refresh handling
 * - No additional dependencies
 */

/**
 * Retrieve API performance monitoring metrics.
 *
 * Backend:
 * GET /api/admin/monitoring/overview
 *
 * Returns:
 * - Request counts
 * - Response latency
 * - P50, P95, P99
 * - HTTP status distribution
 * - Aborted requests
 * - Endpoint performance
 * - 60-minute request trends
 */

export async function getAdminMonitoringOverview(
  options = {}
) {
  const response = await api.get(
    "/admin/monitoring/overview",
    {
      signal: options.signal
    }
  );

  if (
    response.data?.success !== true ||
    !response.data?.data
  ) {
    throw new Error(
      "Invalid API monitoring response"
    );
  }

  return response.data.data;
}
