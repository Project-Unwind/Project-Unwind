process.env.NODE_ENV = "test";

process.env.GOOGLE_CLIENT_ID ||= "test-google-client-id";
process.env.GOOGLE_CLIENT_SECRET ||= "test-google-client-secret";
process.env.GOOGLE_CALLBACK_URL ||=
  "http://localhost:5000/api/auth/google/callback";