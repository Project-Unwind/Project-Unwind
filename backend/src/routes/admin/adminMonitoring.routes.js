
import express from "express";

import {
  authenticate
} from "../../middleware/authenticate.js";

import {
  requireAdmin
} from "../../middleware/admin/requireAdmin.js";

import {
  requireAdminAccess
} from "../../middleware/admin/requireAdminAccess.js";

import {
  adminReadLimiter
} from "../../middleware/rateLimiter.js";

import {
  getApiMonitoringOverviewController
} from "../../controllers/admin/adminMonitoring.controller.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Admin Monitoring Security
|--------------------------------------------------------------------------
|
| 1. Authenticate the user
| 2. Verify admin role
| 3. Verify additional admin access
| 4. Apply admin read rate limiter
|
*/


router.use(
  adminReadLimiter,
  authenticate,
  requireAdmin,
  requireAdminAccess
);


/*
|--------------------------------------------------------------------------
| API Monitoring Overview
|--------------------------------------------------------------------------
|
| GET /api/admin/monitoring/overview
|
| Returns:
| - Total requests
| - Average latency
| - P50, P95, P99 latency
| - Requests per minute
| - HTTP status distribution
| - Error rate
| - Active requests
| - Endpoint statistics
| - 60-minute trends
|
*/

router.get(
  "/overview",
  getApiMonitoringOverviewController
);

export default router;
