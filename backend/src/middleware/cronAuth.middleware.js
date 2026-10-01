import crypto from "crypto";

/*
|--------------------------------------------------------------------------
| Cron Authentication
|--------------------------------------------------------------------------
|
| Protects internal scheduled-job endpoints.
|
| Expected header:
|
| Authorization: Bearer <CRON_SECRET>
|
|--------------------------------------------------------------------------
*/

function safeCompare(
  suppliedSecret,
  expectedSecret
) {
  const suppliedBuffer =
    Buffer.from(
      suppliedSecret,
      "utf8"
    );

  const expectedBuffer =
    Buffer.from(
      expectedSecret,
      "utf8"
    );

  if (
    suppliedBuffer.length !==
    expectedBuffer.length
  ) {
    return false;
  }

  return crypto.timingSafeEqual(
    suppliedBuffer,
    expectedBuffer
  );
}

export function authenticateCron(
  req,
  res,
  next
) {
  const cronSecret =
    process.env.CRON_SECRET;

  /*
  |--------------------------------------------------------------------------
  | Fail Closed
  |--------------------------------------------------------------------------
  */

  if (!cronSecret) {
    console.error(
      "[CRON] CRON_SECRET is not configured"
    );

    return res
      .status(503)
      .json({
        success: false,
        message:
          "Scheduled job service unavailable"
      });
  }

  const authorization =
    req.get(
      "authorization"
    );

  if (
    !authorization ||
    !authorization.startsWith(
      "Bearer "
    )
  ) {
    return res
      .status(401)
      .json({
        success: false,
        message:
          "Unauthorized"
      });
  }

  const suppliedSecret =
    authorization
      .slice(
        "Bearer ".length
      )
      .trim();

  if (
    !suppliedSecret ||
    !safeCompare(
      suppliedSecret,
      cronSecret
    )
  ) {
    return res
      .status(401)
      .json({
        success: false,
        message:
          "Unauthorized"
      });
  }

  next();
}