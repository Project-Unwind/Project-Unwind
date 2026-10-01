import express from "express";

import {
  authenticateCron
} from "../../middleware/cronAuth.middleware.js";

import {
  processNotificationCron
} from "../../controllers/internal/notificationCron.controller.js";

const router =
  express.Router();

/*
|--------------------------------------------------------------------------
| Internal Notification Cron
|--------------------------------------------------------------------------
*/

router.post(
  "/process",
  authenticateCron,
  processNotificationCron
);

export default router;