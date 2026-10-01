import {
  processDueNotifications
} from "../../services/notification/notificationScheduler.service.js";

/*
|--------------------------------------------------------------------------
| Process Scheduled Notifications
|--------------------------------------------------------------------------
*/

export async function processNotificationCron(
  req,
  res
) {
  console.log(
    "[CRON] Notification processing started"
  );

  try {
    const result =
      await processDueNotifications();

    if (
      result?.skipped
    ) {
      console.log(
        "[CRON] Notification processing skipped - lock unavailable"
      );

      return res
        .status(200)
        .json({
          success: true,
          message:
            "Notification processing skipped",
          sent: 0,
          skipped: true
        });
    }

    const sent =
      Number(
        result?.sent
      ) || 0;

    console.log(
      `[CRON] Notification processing completed | sent=${sent}`
    );

    return res
      .status(200)
      .json({
        success: true,
        message:
          "Notification processing completed",
        sent,
        skipped: false
      });
  } catch (error) {
    console.error(
      "[CRON] Notification processing failed",
      error?.message ||
        error
    );

    return res
      .status(500)
      .json({
        success: false,
        message:
          "Notification processing failed"
      });
  }
}