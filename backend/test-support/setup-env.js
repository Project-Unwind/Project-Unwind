process.env.NODE_ENV = "test";

/* Google OAuth */
process.env.GOOGLE_CLIENT_ID ||= "test-google-client-id";
process.env.GOOGLE_CLIENT_SECRET ||= "test-google-client-secret";
process.env.GOOGLE_CALLBACK_URL ||=
  "http://localhost:5000/api/auth/google/callback";

/* Brevo */
process.env.BREVO_API_KEY ||= "test-brevo-api-key";
process.env.BREVO_SENDER_EMAIL ||= "test@example.com";

/* Cloudinary */
process.env.CLOUDINARY_CLOUD_NAME ||= "test-cloud";
process.env.CLOUDINARY_API_KEY ||= "000000000000000";
process.env.CLOUDINARY_API_SECRET ||= "test-cloudinary-secret";

/* Authentication */
process.env.JWT_SECRET ||=
  "test-jwt-secret-that-is-long-enough-for-testing";
process.env.JWT_REFRESH_SECRET ||=
  "test-refresh-secret-that-is-long-enough-for-testing";

/* Application */
process.env.CLIENT_URL ||= "http://localhost:5173";