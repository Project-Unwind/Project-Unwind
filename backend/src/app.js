
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import passport from "./config/googleOAuth.js";

// =====================================================
// Authentication and Account Routes
// =====================================================

import accountRoutes from "./routes/account.routes.js";
import authRoutes from "./routes/auth.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import passwordRoutes from "./routes/password.routes.js";

// =====================================================
// Internal Jobs and Notifications
// =====================================================

import notificationCronRoutes
  from "./routes/internal/notificationCron.routes.js";

import notificationRoutes
  from "./routes/notification/notification.routes.js";

// =====================================================
// Community Routes
// =====================================================

import communityProfileRoutes
  from "./routes/communityProfile.routes.js";

import communityPostRoutes
  from "./routes/communityPost.routes.js";

import postCommentRoutes
  from "./routes/postComment.routes.js";

import commentLikeRoutes
  from "./routes/commentLike.routes.js";

import chatRoomRoutes
  from "./routes/chatRoom.routes.js";

import chatMessageRoutes
  from "./routes/chatMessage.routes.js";

import privateRoomRoutes
  from "./routes/privateRoom.routes.js";

import directConversationRoutes
  from "./routes/directConversation.routes.js";

import directMessageRoutes
  from "./routes/directMessage.routes.js";

import reportRoutes
  from "./routes/report.routes.js";

// =====================================================
// Wellness and Application Routes
// =====================================================

import chatbotRoutes
  from "./routes/chatbot/chatbot.routes.js";

import dassRoutes from "./routes/dass.routes.js";

import journalRoutes from "./routes/journal/index.js";

import trackerRoutes from "./routes/trackers/index.js";

import testimonialRoutes
  from "./routes/testimonial.routes.js";

import publicRoutes
  from "./routes/public/public.routes.js";

import dashboardRoutes
  from "./routes/dashboard/dashboard.routes.js";

// =====================================================
// Admin Routes
// =====================================================

import adminAccessRoutes
  from "./routes/admin/adminAccess.routes.js";

import adminDashboardRoutes
  from "./routes/admin/adminDashboard.routes.js";

import adminReportRoutes
  from "./routes/admin/adminReport.routes.js";

import adminModerationRoutes
  from "./routes/admin/adminModeration.routes.js";

import adminUserRoutes
  from "./routes/admin/adminUser.routes.js";

import adminTestimonialRoutes
  from "./routes/admin/adminTestimonial.routes.js";

import adminCommunityModerationRoutes
  from "./routes/admin/adminCommunityModeration.routes.js";

import adminAuditRoutes
  from "./routes/admin/adminAudit.routes.js";

import adminModerationDecisionRoutes
  from "./routes/admin/adminModerationDecision.routes.js";

import adminAnalyticsRoutes
  from "./routes/admin/adminAnalytics.routes.js";

import adminMonitoringRoutes
  from "./routes/admin/adminMonitoring.routes.js";

// =====================================================
// Monitoring Middleware
// =====================================================

import {
  apiMonitoring,
  monitoredRouter
} from "./middleware/apiMonitoring.js";

// =====================================================
// Error Middleware
// =====================================================

import {
  notFound
} from "./middleware/notFound.js";

import {
  errorHandler
} from "./middleware/errorHandler.js";

// =====================================================
// Application Configuration
// =====================================================

dotenv.config();

const app = express();

app.set("trust proxy", 1);

/*
|--------------------------------------------------------------------------
| API Performance Monitoring
|--------------------------------------------------------------------------
|
| - HTTP request counts
| - Response latency
| - HTTP status distribution
| - Active requests
| - Aborted requests
| - Endpoint performance
|
| Lightweight in-memory collection.
| No database writes or external API calls.
|
*/

app.use(apiMonitoring);

/*
|--------------------------------------------------------------------------
| Security Middleware
|--------------------------------------------------------------------------
*/

app.use(helmet());

app.use(
  cors({
    origin:
      process.env.FRONTEND_URL ||
      "http://localhost:5173",

    credentials: true
  })
);

/*
|--------------------------------------------------------------------------
| Request Body and Cookie Parsing
|--------------------------------------------------------------------------
*/

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true
  })
);

app.use(cookieParser());

/*
|--------------------------------------------------------------------------
| Passport — Google OAuth
|--------------------------------------------------------------------------
|
| Passport handles the Google OAuth handshake.
| JWT access and refresh token authentication
| remains unchanged.
|
*/

app.use(passport.initialize());

/*
|--------------------------------------------------------------------------
| Health Checks
|--------------------------------------------------------------------------
*/

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "UNWIND API is running 🚀"
  });
});

app.get("/api/health", (req, res) => {
  console.log(
    `[HEALTH CHECK] Ping sucessfully received at ${new Date().toISOString()}`
  );

  res.status(200).json({
    success: true,
    status: "healthy",
    service: "Unwind API",
    timestamp: new Date().toISOString()
  });
});

/*
|--------------------------------------------------------------------------
| Internal Scheduled Jobs
|--------------------------------------------------------------------------
*/

app.use(
  "/api/internal/notifications",
  ...monitoredRouter(
    "/api/internal/notifications",
    notificationCronRoutes
  )
);

/*
|--------------------------------------------------------------------------
| Notifications
|--------------------------------------------------------------------------
*/

app.use(
  "/api/notifications",
  ...monitoredRouter(
    "/api/notifications",
    notificationRoutes
  )
);

/*
|--------------------------------------------------------------------------
| Authentication and Account Routes
|--------------------------------------------------------------------------
*/

app.use(
  "/api/auth",
  ...monitoredRouter(
    "/api/auth",
    authRoutes
  )
);

app.use(
  "/api/password",
  ...monitoredRouter(
    "/api/password",
    passwordRoutes
  )
);

app.use(
  "/api/profile",
  ...monitoredRouter(
    "/api/profile",
    profileRoutes
  )
);

app.use(
  "/api/account",
  ...monitoredRouter(
    "/api/account",
    accountRoutes
  )
);

/*
|--------------------------------------------------------------------------
| AI Chatbot
|--------------------------------------------------------------------------
*/

app.use(
  "/api/chatbot",
  ...monitoredRouter(
    "/api/chatbot",
    chatbotRoutes
  )
);

/*
|--------------------------------------------------------------------------
| Community Profiles and Posts
|--------------------------------------------------------------------------
*/

app.use(
  "/api/community",
  ...monitoredRouter(
    "/api/community",
    communityProfileRoutes
  )
);

app.use(
  "/api/community/posts",
  ...monitoredRouter(
    "/api/community/posts",
    communityPostRoutes
  )
);

app.use(
  "/api/community",
  ...monitoredRouter(
    "/api/community",
    postCommentRoutes
  )
);

app.use(
  "/api/community",
  ...monitoredRouter(
    "/api/community",
    commentLikeRoutes
  )
);

/*
|--------------------------------------------------------------------------
| Community Chat
|--------------------------------------------------------------------------
*/

app.use(
  "/api/community/chat",
  ...monitoredRouter(
    "/api/community/chat",
    chatRoomRoutes
  )
);

app.use(
  "/api/community/chat",
  ...monitoredRouter(
    "/api/community/chat",
    chatMessageRoutes
  )
);

/*
|--------------------------------------------------------------------------
| Private Rooms
|--------------------------------------------------------------------------
*/

app.use(
  "/api/community/private-rooms",
  ...monitoredRouter(
    "/api/community/private-rooms",
    privateRoomRoutes
  )
);

/*
|--------------------------------------------------------------------------
| Direct Conversations and Messages
|--------------------------------------------------------------------------
*/

app.use(
  "/api/community/direct-conversations",
  ...monitoredRouter(
    "/api/community/direct-conversations",
    directConversationRoutes
  )
);

app.use(
  "/api/community/direct-messages",
  ...monitoredRouter(
    "/api/community/direct-messages",
    directMessageRoutes
  )
);

/*
|--------------------------------------------------------------------------
| Community Reports
|--------------------------------------------------------------------------
*/

app.use(
  "/api/community/reports",
  ...monitoredRouter(
    "/api/community/reports",
    reportRoutes
  )
);

/*
|--------------------------------------------------------------------------
| DASS-21
|--------------------------------------------------------------------------
*/

app.use(
  "/api/dass",
  ...monitoredRouter(
    "/api/dass",
    dassRoutes
  )
);

/*
|--------------------------------------------------------------------------
| Journal
|--------------------------------------------------------------------------
*/

app.use(
  "/api/journal",
  ...monitoredRouter(
    "/api/journal",
    journalRoutes
  )
);

/*
|--------------------------------------------------------------------------
| Wellness Trackers
|--------------------------------------------------------------------------
*/

app.use(
  "/api/trackers",
  ...monitoredRouter(
    "/api/trackers",
    trackerRoutes
  )
);

/*
|--------------------------------------------------------------------------
| Testimonials
|--------------------------------------------------------------------------
*/

app.use(
  "/api/testimonials",
  ...monitoredRouter(
    "/api/testimonials",
    testimonialRoutes
  )
);

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

app.use(
  "/api/public",
  ...monitoredRouter(
    "/api/public",
    publicRoutes
  )
);

/*
|--------------------------------------------------------------------------
| User Dashboard
|--------------------------------------------------------------------------
*/

app.use(
  "/api/dashboard",
  ...monitoredRouter(
    "/api/dashboard",
    dashboardRoutes
  )
);

/*
|--------------------------------------------------------------------------
| Admin Access
|--------------------------------------------------------------------------
*/

app.use(
  "/api/admin/access",
  ...monitoredRouter(
    "/api/admin/access",
    adminAccessRoutes
  )
);

/*
|--------------------------------------------------------------------------
| Admin Dashboard
|--------------------------------------------------------------------------
*/

app.use(
  "/api/admin/dashboard",
  ...monitoredRouter(
    "/api/admin/dashboard",
    adminDashboardRoutes
  )
);

/*
|--------------------------------------------------------------------------
| Admin Reports
|--------------------------------------------------------------------------
*/

app.use(
  "/api/admin/reports",
  ...monitoredRouter(
    "/api/admin/reports",
    adminReportRoutes
  )
);

/*
|--------------------------------------------------------------------------
| Admin Moderation
|--------------------------------------------------------------------------
*/

app.use(
  "/api/admin/moderation",
  ...monitoredRouter(
    "/api/admin/moderation",
    adminModerationRoutes
  )
);

/*
|--------------------------------------------------------------------------
| Admin Users
|--------------------------------------------------------------------------
*/

app.use(
  "/api/admin/users",
  ...monitoredRouter(
    "/api/admin/users",
    adminUserRoutes
  )
);

/*
|--------------------------------------------------------------------------
| Admin Testimonials
|--------------------------------------------------------------------------
*/

app.use(
  "/api/admin/testimonials",
  ...monitoredRouter(
    "/api/admin/testimonials",
    adminTestimonialRoutes
  )
);

/*
|--------------------------------------------------------------------------
| Admin Community Moderation
|--------------------------------------------------------------------------
*/

app.use(
  "/api/admin/community",
  ...monitoredRouter(
    "/api/admin/community",
    adminCommunityModerationRoutes
  )
);

/*
|--------------------------------------------------------------------------
| Admin Audit Logs
|--------------------------------------------------------------------------
*/

app.use(
  "/api/admin/audit-logs",
  ...monitoredRouter(
    "/api/admin/audit-logs",
    adminAuditRoutes
  )
);

/*
|--------------------------------------------------------------------------
| Admin Moderation Decisions
|--------------------------------------------------------------------------
*/

app.use(
  "/api/admin/moderation-decisions",
  ...monitoredRouter(
    "/api/admin/moderation-decisions",
    adminModerationDecisionRoutes
  )
);

/*
|--------------------------------------------------------------------------
| Admin Analytics
|--------------------------------------------------------------------------
*/

app.use(
  "/api/admin/analytics",
  ...monitoredRouter(
    "/api/admin/analytics",
    adminAnalyticsRoutes
  )
);

/*
|--------------------------------------------------------------------------
| Admin API Monitoring — Unwind Pulse
|--------------------------------------------------------------------------
*/

app.use(
  "/api/admin/monitoring",
  ...monitoredRouter(
    "/api/admin/monitoring",
    adminMonitoringRoutes
  )
);

/*
|--------------------------------------------------------------------------
| 404 Handler
|--------------------------------------------------------------------------
*/

app.use(notFound);

/*
|--------------------------------------------------------------------------
| Global Error Handler
|--------------------------------------------------------------------------
|
| Must remain last.
|
*/

app.use(errorHandler);

export default app;
