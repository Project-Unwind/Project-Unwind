
import { Router } from "express";

import {
  monitoredNestedRouter
} from "../../middleware/apiMonitoring.js";

import energyTrackerRoutes from "./energyTracker.routes.js";
import habitLogRoutes from "./habitLog.routes.js";
import habitTrackerRoutes from "./habitTracker.routes.js";
import moodTrackerRoutes from "./moodTracker.routes.js";
import sleepTrackerRoutes from "./sleepTracker.routes.js";
import trackerMetadataRoutes from "./trackerMetadata.routes.js";
import trackerReminderRoutes from "./trackerReminder.routes.js";
import trackerSettingsRoutes from "./trackerSettings.routes.js";
import waterTrackerRoutes from "./waterTracker.routes.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Tracker Module
|--------------------------------------------------------------------------
|
| Base URL: /api/trackers
|
| Preserve trusted nested templates and mask
| dynamic values such as :habitId.
|
*/

router.use(
  "/metadata",
  ...monitoredNestedRouter("/metadata", trackerMetadataRoutes)
);

router.use(
  "/settings",
  ...monitoredNestedRouter("/settings", trackerSettingsRoutes)
);

router.use(
  "/reminders",
  ...monitoredNestedRouter("/reminders", trackerReminderRoutes)
);

router.use(
  "/mood",
  ...monitoredNestedRouter("/mood", moodTrackerRoutes)
);

router.use(
  "/sleep",
  ...monitoredNestedRouter("/sleep", sleepTrackerRoutes)
);

router.use(
  "/habits",
  ...monitoredNestedRouter("/habits", habitTrackerRoutes)
);

router.use(
  "/habits/:habitId/logs",
  ...monitoredNestedRouter(
    "/habits/:habitId/logs",
    habitLogRoutes
  )
);

router.use(
  "/energy",
  ...monitoredNestedRouter("/energy", energyTrackerRoutes)
);

router.use(
  "/water",
  ...monitoredNestedRouter("/water", waterTrackerRoutes)
);

export default router;
