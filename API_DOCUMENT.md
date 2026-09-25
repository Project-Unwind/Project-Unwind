# Unwind Backend API Documentation

> **Source snapshot:** `Unwind-backend-docs.zip` — supplied 25 September 2026
> **Scope:** implemented Express routes and Socket.IO handlers in the supplied backend
> **Source of truth:** `backend/src/app.js`, `backend/src/routes/`, `backend/src/controllers/`, `backend/src/validators/`, `backend/src/sockets/`

| | |
|---|---|
| **Base URL (local)** | `http://localhost:5000` |
| **Base URL (previous deployment)** | `https://project-unwind.onrender.com` *(verify current deployment settings before use)* |
| **HTTP prefix** | `/api` — this snapshot does **not** mount `/api/v1` |

> ⚠️ **Verification note:** This documents the uploaded snapshot only — it is not a live production probe. No real user credentials or database were used, and deployment behavior has not been verified.

---

## Table of Contents

1. [How to Use the API](#1-how-to-use-the-api)
2. [Response & Error Conventions](#2-response--error-conventions)
3. [Core Workflows & Exact Inputs](#3-core-workflows--exact-inputs)
   - [Registration, Verification & Sessions](#registration-verification-and-sessions)
   - [Password & Account](#password-and-account)
   - [DASS-21](#dass-21)
   - [Journal](#journal)
   - [Community & Messaging](#community-and-messaging)
   - [Chatbot](#chatbot)
4. [Endpoint Inventory](#4-endpoint-inventory)
5. [Socket.IO Interface](#5-socketio-interface)
6. [Implementation Notes & Verification Limits](#6-implementation-notes-and-verification-limits)

---

## 1. How to Use the API

Most protected HTTP requests need an `Authorization: Bearer <accessToken>` header.

| Step | Endpoint | Purpose |
|---|---|---|
| 1 | `POST /api/auth/login` | Obtain the access token |
| 2 | `POST /api/auth/refresh` | Rotate the session using the HTTP-only `refreshToken` cookie; returns a new access token |

Requests relying on cookies must send credentials (`credentials: "include"` in `fetch`).

**Cookie behavior**
- The refresh cookie is `HttpOnly`, `SameSite=Lax`, and `Secure` in production.
- With `rememberMe: true`, its browser expiry is **30 days**.
- Actual refresh-token/access-token lifetimes are configurable; JWT defaults are **30 days** and **15 minutes** respectively (`src/config/jwt.js`).
- Cookie and cross-site behavior depend on the deployed origins.

### Example: Login → Authenticated Request

```js
const base = "http://localhost:5000";

const response = await fetch(`${base}/api/auth/login`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify({ identifier: "your_username", password: "YourPassword1!" })
});

const { data } = await response.json();
const accessToken = data.accessToken;

const me = await fetch(`${base}/api/auth/me`, {
  headers: { Authorization: `Bearer ${accessToken}` },
  credentials: "include"
});
```

**Content types**
- Use `Content-Type: application/json` for ordinary JSON bodies.
- Profile images, community post media, and journal attachments use `multipart/form-data` — let the browser set its boundary.
- Path identifiers are frequently UUIDs, though exact constraints are defined per validator/service.
- Pagination, filters, sort options, and limits differ by endpoint — **check the validator before adding query params.**

### 🔒 Journal Lock

Endpoints using `requireJournalUnlock` additionally require:

```
X-Journal-Unlock-Token: <journalUnlockToken>
```

when the user has enabled a PIN. Obtain this token via `POST /api/journal/security/unlock`.

> Some journal metadata, search, PDF, and voice routes do **not** apply this middleware in this snapshot — route presence alone doesn't imply the same unlock requirement.

### 🛡️ Admin Access

Most `/api/admin/*` routes require **all** of:
1. A valid bearer token
2. An account with the `admin` role
3. A second admin access session

`POST /api/admin/access/verify` accepts `{ "password": "..." }` and sets the HTTP-only `admin_access_token` cookie — send cookies on subsequent admin requests.

| Route | Requires bearer + admin role | Requires existing admin session |
|---|:---:|:---:|
| `POST /api/admin/access/verify` | ✅ | ❌ (cannot require one) |
| `GET /api/admin/access/status` | ✅ | ✅ |
| `POST /api/admin/access/revoke` | ✅ | ✅ |

> Community report moderation also has separate admin/moderator routes under `/api/community/reports/moderation/*`.

---

## 2. Response & Error Conventions

Most JSON controllers respond with `success`, `message`, and sometimes `data`:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {},
    "accessToken": "<redacted>",
    "sessionId": "<session-id>",
    "rememberMe": false
  }
}
```

> `{}` is a placeholder for the user object — its fields depend on the auth service. This response also sets the refresh cookie.

- `POST /api/auth/refresh` → responds with `data.accessToken`
- Logout clears the cookie

**Validation errors** (shared Zod middleware) return `HTTP 400`:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [{ "field": "body.email", "message": "Invalid email address" }]
}
```

> The community profile route uses a **different** validation shape (`errors` as a field-to-messages object).

### Status Code Reference

| Code | Meaning |
|---|---|
| `401` | Authentication failure |
| `403` | Suspended / banned / disabled account |
| `423` | Journal lock |
| `404` | Unknown path (`"Route not found"`) |
| `409` | Duplicate database value |

> ⚠️ Error bodies are **not uniform** — the global handler sometimes includes `status`, while other middleware returns only `success`/`message`. Not every successful route has a `data` wrapper: PDF downloads, plain-text chatbot streams, redirects, and socket events all have their own formats.

---

## 3. Core Workflows & Exact Inputs

### Registration, Verification and Sessions

| Request | Input / Behavior |
|---|---|
| `POST /api/auth/register` | `multipart/form-data`. Fields: `email`, `username`, `password`, `fullName`; optional `displayName`, `dateOfBirth`, `gender`, `occupationType`, `profileImage`. Returns `201` and sends verification email. Profile image optional, JPEG/PNG/WebP, ≤5 MiB. |
| `POST /api/auth/verify-email-otp` | JSON `{ "email": "...", "otp": "123456" }` |
| `POST /api/auth/verify-email-link` | JSON `{ "userId": "<uuid>", "token": "..." }` |
| `POST /api/auth/resend-verification` | JSON `{ "email": "..." }` |
| `POST /api/auth/login` | JSON `{ "identifier": "email-or-username", "password": "...", "rememberMe": false }`; optional `deviceName`, `browser`, `operatingSystem`. Returns access token + session ID; sets cookie. |
| `POST /api/auth/refresh` | No body; requires `refreshToken` cookie; rotates cookie, returns `data.accessToken`. |
| `POST /api/auth/logout` | Uses refresh cookie; clears it. |
| `POST /api/auth/logout-all` | Bearer token required; revokes all devices, clears cookie. |
| `GET /api/auth/me` | Bearer token required; returns current account + profile. |
| `GET /api/auth/google` | Starts Google OAuth redirect. |
| `GET /api/auth/google/callback` | OAuth callback. |
| `GET /api/auth/google/failure` | Handles OAuth failure. |
| `POST /api/auth/google/complete-profile` | Finishes a new Google account using `googleSignupToken`, `username`, `dateOfBirth`, `gender`, `occupationType`. |

> **Password rule:** 8–100 characters, uppercase, lowercase, digit, and an allowed special character.
>
> ⚠️ The auth routes in this snapshot call auth controllers **directly**, without `validate(registerSchema)`/`validate(loginSchema)` route middleware. The service layer may enforce additional or different checks — do not treat these schemas as guaranteed route-level validation.

### Password and Account

| Request | Input |
|---|---|
| `POST /api/password/forgot` | `{ "email": "..." }` |
| `POST /api/password/reset-otp` | `{ "email": "...", "otp": "123456", "newPassword": "..." }` |
| `POST /api/password/reset-link` | `{ "userId": "<uuid>", "token": "...", "newPassword": "..." }` |
| `PATCH /api/password/change` | Bearer; `{ "currentPassword": "...", "newPassword": "...", "confirmPassword": "..." }` |
| `PATCH /api/profile` | Bearer; fields per `profile.validator.js` |
| `PATCH /api/profile/picture` | Bearer; multipart field `profileImage` (JPEG/PNG/WebP, ≤5 MiB) |
| `DELETE /api/profile/picture` | Bearer |
| `POST /api/account/delete/request-otp` → `POST /api/account/delete/verify-otp` → `DELETE /api/account` | Account-deletion sequence — follow service responses/validators for OTP values and final authorization |

### DASS-21

1. Give consent: `POST /api/dass/consent` with `{ "consentGiven": true, "consentVersion": "1.0" }` (version defaults to `1.0`)
2. Fetch questions, start an assessment
3. Save one answer per: `PUT /api/dass/assessments/:assessmentId/responses` with `{ "questionId": 1, "answerValue": 0 }` (`answerValue` is an integer `0–3`)
4. Submit, abandon, view history, or fetch report/PDF via the endpoints in the [inventory](#4-endpoint-inventory)

> This is a self-assessment feature, **not** a medical diagnosis.

### Journal

- Unlock with PIN: `POST /api/journal/security/unlock` → `{ "pin": "0048" }`
  - PINs are **strings** of 4–6 digits (to preserve leading zeros)
  - Response provides `data.journalUnlockToken` and `data.expiresAt`
- Create a PIN: `{ "pin": "0048", "confirmPin": "0048" }`

**Journal entry fields** (see `journalEntry.validator.js` for full list):

| Field | Constraint |
|---|---|
| `title` | up to 255 chars |
| `content` | up to 100,000 chars |
| `entryType` | — |
| `entryStatus` | `draft`, `completed`, `archived` |
| `moodLabel` | `very_low`, `low`, `neutral`, `good`, `very_good` |
| `moodScore` | integer 1–5 |
| `entryDate` | `YYYY-MM-DD` |

Entries support drafts, favourites, archive, soft delete, permanent delete, calendar, autosave, attachments, prompts, voice, search, and PDF export. Attachment routes use multipart uploads; PDFs return a file response rather than JSON.

### Community and Messaging

- Select community identity: `POST /api/community/identity`
- Posts, likes, comments, reports, public chat, private rooms, and direct messages — see [inventory](#4-endpoint-inventory)
- `POST /api/community/posts` accepts up to **4** multipart files under field `media`
  - Permitted types: JPEG, PNG, WebP, GIF, MP4, WebM, MOV
  - 10 MiB per-file limit
- Community restrictions may block writes even with a valid token
- Real-time messaging uses the same server over Socket.IO — see [section 5](#5-socketio-interface)

### Chatbot

`POST /api/chatbot/message/stream`
- Requires bearer auth
- Body: `{ "conversationId": "<uuid>", "message": "..." }` (`message` is 1–5,000 chars after trimming)
- Responds as `text/plain; charset=utf-8` in chunks
- Includes `X-Chatbot-Source` header, and in a safety case, `X-Chatbot-Intent: crisis`
- **Not** a Server-Sent Events (`text/event-stream`) endpoint

> The conversation, settings, and stored-message routes use ordinary JSON.

---

## 4. Endpoint Inventory

The following transcribes the mounted HTTP route declarations in the supplied snapshot. The **Handler** column names the actual controller/handler symbol for tracing exact query, body, status codes, and response data.

> Except for explicit public endpoints, assume bearer authentication where the route/router uses `authenticate`. Role, journal-unlock, ownership, moderation, and rate-limit middleware vary by endpoint. This index is a route map — the workflow descriptions above and source validators provide the input contracts for highlighted operations.

**Public health checks (outside route modules):** `GET /` and `GET /api/health` (`/api/health` returns `success`, `status`, `service`, `timestamp`)

<details>
<summary><strong>account.routes.js</strong> (3)</summary>

| Method | Path | Handler |
|---|---|---|
| POST | `/api/account/delete/request-otp` | `requestAccountDeletionOtpController` |
| POST | `/api/account/delete/verify-otp` | `verifyAccountDeletionOtpController` |
| DELETE | `/api/account` | `deleteAccountController` |

</details>

<details>
<summary><strong>admin/adminAccess.routes.js</strong> (3)</summary>

| Method | Path | Handler |
|---|---|---|
| POST | `/api/admin/access/verify` | `verifyAdminAccessController` |
| GET | `/api/admin/access/status` | `getAdminAccessStatusController` |
| POST | `/api/admin/access/revoke` | `revokeAdminAccessController` |

</details>

<details>
<summary><strong>admin/adminAnalytics.routes.js</strong> (1)</summary>

| Method | Path | Handler |
|---|---|---|
| GET | `/api/admin/analytics/overview` | `getAdminAnalyticsOverviewController` |

</details>

<details>
<summary><strong>admin/adminAudit.routes.js</strong> (2)</summary>

| Method | Path | Handler |
|---|---|---|
| GET | `/api/admin/audit-logs` | `getAdminAuditLogsController` |
| GET | `/api/admin/audit-logs/:auditId` | `getAdminAuditLogByIdController` |

</details>

<details>
<summary><strong>admin/adminCommunityModeration.routes.js</strong> (2)</summary>

| Method | Path | Handler |
|---|---|---|
| PATCH | `/api/admin/community/:targetType/:targetId/remove` | `removeCommunityContentController` |
| PATCH | `/api/admin/community/:targetType/:targetId/restore` | `restoreCommunityContentController` |

</details>

<details>
<summary><strong>admin/adminDashboard.routes.js</strong> (1)</summary>

| Method | Path | Handler |
|---|---|---|
| GET | `/api/admin/dashboard` | `getAdminDashboardController` |

</details>

<details>
<summary><strong>admin/adminModeration.routes.js</strong> (5)</summary>

| Method | Path | Handler |
|---|---|---|
| POST | `/api/admin/moderation/users/:userId/warn` | `warnUserController` |
| POST | `/api/admin/moderation/users/:userId/restrict` | `restrictUserController` |
| POST | `/api/admin/moderation/users/:userId/suspend` | `suspendUserController` |
| POST | `/api/admin/moderation/users/:userId/ban` | `banUserController` |
| POST | `/api/admin/moderation/users/:userId/restore` | `restoreUserController` |

</details>

<details>
<summary><strong>admin/adminModerationDecision.routes.js</strong> (6)</summary>

| Method | Path | Handler |
|---|---|---|
| GET | `/api/admin/moderation-decisions` | `getModerationProposalsController` |
| GET | `/api/admin/moderation-decisions/:proposalId` | `getModerationProposalController` |
| POST | `/api/admin/moderation-decisions/users/:userId/suspension` | `createLongSuspensionProposalController` |
| POST | `/api/admin/moderation-decisions/users/:userId/ban` | `createPermanentBanProposalController` |
| POST | `/api/admin/moderation-decisions/:proposalId/approve` | `approveModerationProposalController` |
| POST | `/api/admin/moderation-decisions/:proposalId/reject` | `rejectModerationProposalController` |

</details>

<details>
<summary><strong>admin/adminReport.routes.js</strong> (4)</summary>

| Method | Path | Handler |
|---|---|---|
| GET | `/api/admin/reports` | `getAdminReportsController` |
| GET | `/api/admin/reports/:reportId` | `getAdminReportByIdController` |
| PATCH | `/api/admin/reports/:reportId/review` | `markReportUnderReviewController` |
| PATCH | `/api/admin/reports/:reportId/resolve` | `resolveReportController` |

</details>

<details>
<summary><strong>admin/adminTestimonial.routes.js</strong> (4)</summary>

| Method | Path | Handler |
|---|---|---|
| GET | `/api/admin/testimonials` | `getAdminTestimonialsController` |
| GET | `/api/admin/testimonials/:testimonialId` | `getAdminTestimonialByIdController` |
| PATCH | `/api/admin/testimonials/:testimonialId/approve` | `approveTestimonialController` |
| PATCH | `/api/admin/testimonials/:testimonialId/reject` | `rejectTestimonialController` |

</details>

<details>
<summary><strong>admin/adminUser.routes.js</strong> (2)</summary>

| Method | Path | Handler |
|---|---|---|
| GET | `/api/admin/users` | `getAdminUsersController` |
| GET | `/api/admin/users/:userId` | `getAdminUserByIdController` |

</details>

<details>
<summary><strong>auth.routes.js</strong> (13)</summary>

| Method | Path | Handler |
|---|---|---|
| POST | `/api/auth/register` | `register` |
| POST | `/api/auth/login` | `login` |
| POST | `/api/auth/refresh` | `refreshToken` |
| POST | `/api/auth/logout` | `logout` |
| POST | `/api/auth/verify-email-otp` | `verifyEmailOTP` |
| POST | `/api/auth/verify-email-link` | `verifyEmailLink` |
| POST | `/api/auth/resend-verification` | `resendVerification` |
| GET | `/api/auth/google` | *(redirect, no named handler)* |
| GET | `/api/auth/google/callback` | `googleCallback` |
| GET | `/api/auth/google/failure` | `googleAuthFailure` |
| POST | `/api/auth/google/complete-profile` | `completeGoogleProfile` |
| POST | `/api/auth/logout-all` | `logoutAllDevices` |
| GET | `/api/auth/me` | `getCurrentUser` |

</details>

<details>
<summary><strong>chatMessage.routes.js</strong> (7)</summary>

| Method | Path | Handler |
|---|---|---|
| GET | `/api/community/chat/public/history` | `getPublicChatHistoryController` |
| POST | `/api/community/chat/public/messages` | `sendPublicChatMessageController` |
| GET | `/api/community/chat/messages/:messageId` | `getChatMessageController` |
| PATCH | `/api/community/chat/messages/:messageId` | `editChatMessageController` |
| DELETE | `/api/community/chat/messages/:messageId` | `deleteChatMessageController` |
| GET | `/api/community/chat/rooms/:roomId/unread-count` | `getUnreadMessageCountController` |
| PATCH | `/api/community/chat/rooms/:roomId/read` | `markMessagesAsReadController` |

</details>

<details>
<summary><strong>chatRoom.routes.js</strong> (6)</summary>

| Method | Path | Handler |
|---|---|---|
| GET | `/api/community/chat/public` | `getPublicChatRoomController` |
| GET | `/api/community/chat/public/details` | `getPublicRoomDetailsController` |
| GET | `/api/community/chat/public/members` | `getPublicRoomMembersController` |
| POST | `/api/community/chat/public/join` | `joinPublicChatRoomController` |
| POST | `/api/community/chat/public/leave` | `leavePublicChatRoomController` |
| PATCH | `/api/community/chat/:roomId/read` | `markRoomAsReadController` |

</details>

<details>
<summary><strong>chatbot/chatbot.routes.js</strong> (1)</summary>

| Method | Path | Handler |
|---|---|---|
| POST | `/api/chatbot/message/stream` | `streamChatMessage` |

</details>

<details>
<summary><strong>chatbot/chatbotConversation.routes.js</strong> (5)</summary>

| Method | Path | Handler |
|---|---|---|
| POST | `/api/chatbot/conversations` | `createChatbotConversationController` |
| GET | `/api/chatbot/conversations` | `listChatbotConversationsController` |
| GET | `/api/chatbot/conversations/:conversationId` | `getChatbotConversationController` |
| PATCH | `/api/chatbot/conversations/:conversationId` | `updateChatbotConversationController` |
| DELETE | `/api/chatbot/conversations/:conversationId` | `deleteChatbotConversationController` |

</details>

<details>
<summary><strong>chatbot/chatbotMessage.routes.js</strong> (4)</summary>

| Method | Path | Handler |
|---|---|---|
| POST | `/api/chatbot/messages` | `sendChatbotMessageController` |
| GET | `/api/chatbot/messages/conversation/:conversationId` | `getConversationMessagesController` |
| GET | `/api/chatbot/messages/:messageId` | `getChatbotMessageController` |
| DELETE | `/api/chatbot/messages/:messageId` | `deleteChatbotMessageController` |

</details>

<details>
<summary><strong>chatbot/chatbotSettings.routes.js</strong> (2)</summary>

| Method | Path | Handler |
|---|---|---|
| GET | `/api/chatbot/settings` | `getChatbotSettingsController` |
| PATCH | `/api/chatbot/settings` | `updateChatbotSettingsController` |

</details>

<details>
<summary><strong>commentLike.routes.js</strong> (2)</summary>

| Method | Path | Handler |
|---|---|---|
| POST | `/api/community/comments/:commentId/like` | `likeCommentController` |
| DELETE | `/api/community/comments/:commentId/like` | `unlikeCommentController` |

</details>

<details>
<summary><strong>communityPost.routes.js</strong> (8)</summary>

| Method | Path | Handler |
|---|---|---|
| POST | `/api/community/posts` | `createCommunityPostController` |
| GET | `/api/community/posts/feed` | `getCommunityFeedController` |
| GET | `/api/community/posts/user/:userId` | `getUserPostsController` |
| GET | `/api/community/posts/:postId` | `getCommunityPostController` |
| PATCH | `/api/community/posts/:postId` | `updateCommunityPostController` |
| DELETE | `/api/community/posts/:postId` | `deleteCommunityPostController` |
| POST | `/api/community/posts/:postId/like` | `likePostController` |
| DELETE | `/api/community/posts/:postId/like` | `unlikePostController` |

</details>

<details>
<summary><strong>communityProfile.routes.js</strong> (2)</summary>

| Method | Path | Handler |
|---|---|---|
| GET | `/api/community/me` | `getMyCommunityProfile` |
| POST | `/api/community/identity` | `selectIdentity` |

</details>

<details>
<summary><strong>dashboard/dashboard.routes.js</strong> (1)</summary>

| Method | Path | Handler |
|---|---|---|
| GET | `/api/dashboard/stats` | `getDashboardStatsController` |

</details>

<details>
<summary><strong>dass.routes.js</strong> (12)</summary>

| Method | Path | Handler |
|---|---|---|
| GET | `/api/dass/consent` | `getDassConsentStatus` |
| POST | `/api/dass/consent` | `giveDassConsent` |
| DELETE | `/api/dass/consent` | `revokeDassConsent` |
| GET | `/api/dass/questions` | `getDassQuestions` |
| POST | `/api/dass/assessments` | `startDassAssessment` |
| PUT | `/api/dass/assessments/:assessmentId/responses` | `saveDassResponse` |
| POST | `/api/dass/assessments/:assessmentId/submit` | `submitDassAssessment` |
| PATCH | `/api/dass/assessments/:assessmentId/abandon` | `abandonDassAssessment` |
| GET | `/api/dass/history` | `getDassHistory` |
| GET | `/api/dass/history/:assessmentId` | `getDassHistoryById` |
| GET | `/api/dass/reports/:assessmentId` | `getDassReportDetails` |
| GET | `/api/dass/reports/:assessmentId/pdf` | `downloadDassPdf` |

</details>

<details>
<summary><strong>directConversation.routes.js</strong> (8)</summary>

| Method | Path | Handler |
|---|---|---|
| POST | `/api/community/direct-conversations` | `createDirectConversationController` |
| GET | `/api/community/direct-conversations` | `listDirectConversationsController` |
| PATCH | `/api/community/direct-conversations/:conversationId/read` | `markDirectConversationReadController` |
| PATCH | `/api/community/direct-conversations/:conversationId/identity` | `refreshDirectConversationIdentityController` |
| PATCH | `/api/community/direct-conversations/:conversationId/mute` | `setDirectConversationMuteController` |
| PATCH | `/api/community/direct-conversations/:conversationId/leave` | `leaveDirectConversationController` |
| PATCH | `/api/community/direct-conversations/:conversationId/rejoin` | `rejoinDirectConversationController` |
| GET | `/api/community/direct-conversations/:conversationId` | `getDirectConversationController` |

</details>

<details>
<summary><strong>directMessage.routes.js</strong> (7)</summary>

| Method | Path | Handler |
|---|---|---|
| POST | `/api/community/direct-messages/conversations/:conversationId/messages` | `sendDirectMessageController` |
| GET | `/api/community/direct-messages/conversations/:conversationId/messages` | `getDirectMessageHistoryController` |
| PATCH | `/api/community/direct-messages/conversations/:conversationId/messages/read` | `markDirectMessagesReadController` |
| GET | `/api/community/direct-messages/conversations/:conversationId/messages/unread-count` | `getUnreadDirectMessageCountController` |
| GET | `/api/community/direct-messages/conversations/:conversationId/messages/:messageId` | `getDirectMessageController` |
| PATCH | `/api/community/direct-messages/conversations/:conversationId/messages/:messageId` | `editDirectMessageController` |
| DELETE | `/api/community/direct-messages/conversations/:conversationId/messages/:messageId` | `deleteDirectMessageController` |

</details>

<details>
<summary><strong>journal/journalAttachment.routes.js</strong> (15)</summary>

| Method | Path | Handler |
|---|---|---|
| GET | `/api/journal/attachments/storage` | `getAttachmentStorageController` |
| GET | `/api/journal/attachments/entries/:entryId/storage` | `getEntryAttachmentStorageController` |
| GET | `/api/journal/attachments/entries/:entryId` | `getEntryAttachmentsController` |
| POST | `/api/journal/attachments/entries/:entryId` | `addAttachmentController` |
| POST | `/api/journal/attachments/entries/:entryId/multiple` | `addAttachmentsController` |
| PATCH | `/api/journal/attachments/entries/:entryId/reorder` | `reorderAttachmentsController` |
| GET | `/api/journal/attachments` | `getAttachmentsController` |
| GET | `/api/journal/attachments/:attachmentId` | `getAttachmentController` |
| PATCH | `/api/journal/attachments/:attachmentId` | `editAttachmentController` |
| DELETE | `/api/journal/attachments/:attachmentId` | `deleteAttachmentController` |
| PATCH | `/api/journal/attachments/:attachmentId/cover` | `setAttachmentCoverController` |
| DELETE | `/api/journal/attachments/:attachmentId/cover` | `removeAttachmentCoverController` |
| PATCH | `/api/journal/attachments/:attachmentId/processing` | `updateAttachmentProcessingController` |
| PATCH | `/api/journal/attachments/:attachmentId/restore` | `restoreAttachmentController` |
| DELETE | `/api/journal/attachments/:attachmentId/permanent` | `permanentlyRemoveAttachmentController` |

</details>

<details>
<summary><strong>journal/journalEntry.routes.js</strong> (16)</summary>

| Method | Path | Handler |
|---|---|---|
| POST | `/api/journal/entries` | `createJournalEntryController` |
| GET | `/api/journal/entries` | `getJournalEntriesController` |
| GET | `/api/journal/entries/drafts` | `getDraftJournalEntriesController` |
| GET | `/api/journal/entries/favourites` | `getFavouriteJournalEntriesController` |
| GET | `/api/journal/entries/archived` | `getArchivedJournalEntriesController` |
| GET | `/api/journal/entries/deleted` | `getDeletedJournalEntriesController` |
| GET | `/api/journal/entries/calendar` | `getJournalCalendarController` |
| GET | `/api/journal/entries/:entryId` | `getJournalEntryController` |
| PATCH | `/api/journal/entries/:entryId` | `updateJournalEntryController` |
| PATCH | `/api/journal/entries/:entryId/auto-save` | `autoSaveJournalEntryController` |
| PATCH | `/api/journal/entries/:entryId/complete` | `completeJournalEntryController` |
| PATCH | `/api/journal/entries/:entryId/favourite` | `toggleJournalEntryFavouriteController` |
| PATCH | `/api/journal/entries/:entryId/archive` | `archiveJournalEntryController` |
| PATCH | `/api/journal/entries/:entryId/restore` | `restoreJournalEntryController` |
| DELETE | `/api/journal/entries/:entryId` | `softDeleteJournalEntryController` |
| DELETE | `/api/journal/entries/:entryId/permanent` | `permanentlyDeleteJournalEntryController` |

</details>

<details>
<summary><strong>journal/journalMetadata.routes.js</strong> (10)</summary>

| Method | Path | Handler |
|---|---|---|
| GET | `/api/journal/metadata` | `getJournalMetadataController` |
| GET | `/api/journal/metadata/emotions` | `getJournalEmotionsController` |
| GET | `/api/journal/metadata/tags` | `getJournalTagsController` |
| POST | `/api/journal/metadata/tags` | `createJournalTagController` |
| PATCH | `/api/journal/metadata/tags/:tagId` | `updateJournalTagController` |
| DELETE | `/api/journal/metadata/tags/:tagId` | `deleteJournalTagController` |
| GET | `/api/journal/metadata/activities` | `getJournalActivitiesController` |
| POST | `/api/journal/metadata/activities` | `createJournalActivityController` |
| PATCH | `/api/journal/metadata/activities/:activityId` | `updateJournalActivityController` |
| DELETE | `/api/journal/metadata/activities/:activityId` | `deleteJournalActivityController` |

</details>

<details>
<summary><strong>journal/journalPdfExport.routes.js</strong> (3)</summary>

| Method | Path | Handler |
|---|---|---|
| GET | `/api/journal/export/entries/:entryId/pdf` | `exportSingleJournalEntryPdfController` |
| POST | `/api/journal/export/pdf` | `exportMultipleJournalEntriesPdfController` |
| GET | `/api/journal/export/pdf` | `exportCompleteJournalPdfController` |

</details>

<details>
<summary><strong>journal/journalPrompt.routes.js</strong> (17)</summary>

| Method | Path | Handler |
|---|---|---|
| GET | `/api/journal/prompts/categories` | `getPromptCategoriesController` |
| GET | `/api/journal/prompts/statistics` | `getPromptStatisticsController` |
| GET | `/api/journal/prompts/history` | `getPromptHistoryController` |
| DELETE | `/api/journal/prompts/history/:promptHistoryId` | `removePromptHistoryController` |
| PATCH | `/api/journal/prompts/history/:promptHistoryId/use` | `markPromptUsedController` |
| GET | `/api/journal/prompts/daily` | `getDailyPromptController` |
| GET | `/api/journal/prompts/random` | `getRandomPromptController` |
| GET | `/api/journal/prompts/system` | `getSystemPromptsController` |
| GET | `/api/journal/prompts/custom` | `getCustomPromptsController` |
| GET | `/api/journal/prompts` | `getPromptsController` |
| POST | `/api/journal/prompts` | `createCustomPromptController` |
| POST | `/api/journal/prompts/:promptId/shown` | `recordPromptShownController` |
| PATCH | `/api/journal/prompts/:promptId/use-latest` | `markLatestPromptUsedController` |
| PATCH | `/api/journal/prompts/:promptId/status` | `updateCustomPromptStatusController` |
| GET | `/api/journal/prompts/:promptId` | `getPromptController` |
| PATCH | `/api/journal/prompts/:promptId` | `updateCustomPromptController` |
| DELETE | `/api/journal/prompts/:promptId` | `removeCustomPromptController` |

</details>

<details>
<summary><strong>journal/journalSearch.routes.js</strong> (1)</summary>

| Method | Path | Handler |
|---|---|---|
| GET | `/api/journal/search` | `searchJournalEntriesController` |

</details>

<details>
<summary><strong>journal/journalSecurity.routes.js</strong> (13, incl. 4 route duplicates in source)</summary>

| Method | Path | Handler |
|---|---|---|
| GET | `/api/journal/security/status` | `getJournalSecurityStatusController` |
| POST | `/api/journal/security/pin` | `createJournalPinController` |
| POST | `/api/journal/security/unlock` | `unlockJournalController` |
| PATCH | `/api/journal/security/pin` | `changeJournalPinController` |
| DELETE | `/api/journal/security/pin` | `disableJournalPinController` |
| POST | `/api/journal/security/pin/forgot` | `requestJournalPinResetController` |
| POST | `/api/journal/security/pin/reset/verify` | `verifyJournalPinResetOtpController` |
| POST | `/api/journal/security/pin/reset` | `completeJournalPinResetController` |
| POST | `/api/journal/security/lock` | `lockJournalController` |
| POST | `/api/journal/security/pin/forgot` *(dup)* | `requestJournalPinResetController` |
| POST | `/api/journal/security/pin/reset/verify` *(dup)* | `verifyJournalPinResetOtpController` |
| POST | `/api/journal/security/pin/reset` *(dup)* | `resetJournalPinController` |
| POST | `/api/journal/security/lock` *(dup)* | `lockJournalController` |

> ⚠️ The source snapshot lists two overlapping route/handler pairs for `pin/forgot`, `pin/reset/verify`, `pin/reset`, and `lock` — note the differing handler names (`completeJournalPinResetController` vs. `resetJournalPinController`) for `pin/reset`.

</details>

<details>
<summary><strong>journal/journalVoice.routes.js</strong> (26)</summary>

| Method | Path | Handler |
|---|---|---|
| GET | `/api/journal/voice/configuration` | `getTranscriptionConfiguration` |
| GET | `/api/journal/voice/availability` | `getTranscriptionAvailability` |
| GET | `/api/journal/voice` | `getUserVoiceTranscripts` |
| GET | `/api/journal/voice/search` | `searchVoiceTranscripts` |
| POST | `/api/journal/voice/entry/:entryId` | `createVoiceTranscript` |
| POST | `/api/journal/voice/entry/:entryId/pending` | `createPendingVoiceTranscript` |
| POST | `/api/journal/voice/entry/:entryId/transcribe` | `createAndTranscribeVoiceJournal` |
| GET | `/api/journal/voice/entry/:entryId` | `getEntryVoiceTranscripts` |
| GET | `/api/journal/voice/attachment/:attachmentId` | `getVoiceTranscriptByAttachment` |
| DELETE | `/api/journal/voice/attachment/:attachmentId` | `deleteVoiceTranscriptByAttachment` |
| PATCH | `/api/journal/voice/attachment/:attachmentId/restore` | `restoreVoiceTranscriptByAttachment` |
| GET | `/api/journal/voice/:voiceTranscriptId` | `getVoiceTranscript` |
| GET | `/api/journal/voice/:voiceTranscriptId/details` | `getVoiceTranscriptDetails` |
| GET | `/api/journal/voice/:voiceTranscriptId/summary` | `getVoiceTranscriptSummary` |
| GET | `/api/journal/voice/:voiceTranscriptId/status` | `getVoiceTranscriptStatus` |
| POST | `/api/journal/voice/:voiceTranscriptId/process` | `processVoiceTranscription` |
| POST | `/api/journal/voice/:voiceTranscriptId/retry` | `retryVoiceTranscription` |
| PATCH | `/api/journal/voice/:voiceTranscriptId/transcript` | `updateVoiceTranscriptText` |
| PATCH | `/api/journal/voice/:voiceTranscriptId/restore-original` | `restoreOriginalVoiceTranscript` |
| PATCH | `/api/journal/voice/:voiceTranscriptId/metadata` | `updateVoiceTranscriptMetadata` |
| DELETE | `/api/journal/voice/:voiceTranscriptId` | `deleteVoiceTranscript` |
| DELETE | `/api/journal/voice/:voiceTranscriptId/audio` | `deleteVoiceJournalAudio` |
| PATCH | `/api/journal/voice/:voiceTranscriptId/restore` | `restoreVoiceTranscript` |
| PATCH | `/api/journal/voice/:voiceTranscriptId/restore-audio` | `restoreVoiceJournalAudio` |
| DELETE | `/api/journal/voice/:voiceTranscriptId/permanent` | `permanentlyDeleteVoiceTranscript` |
| DELETE | `/api/journal/voice/:voiceTranscriptId/audio/permanent` | `permanentlyDeleteVoiceJournalAudio` |

</details>

<details>
<summary><strong>notification/notification.routes.js</strong> (13)</summary>

| Method | Path | Handler |
|---|---|---|
| GET | `/api/notifications/public` | `getPublicNotificationsController` |
| GET | `/api/notifications` | `getUserNotificationsController` |
| GET | `/api/notifications/unread-count` | `getUnreadNotificationCountController` |
| PATCH | `/api/notifications/read-all` | `markAllNotificationsAsReadController` |
| POST | `/api/notifications/manage` | `createNotificationController` |
| PATCH | `/api/notifications/manage/:notificationId` | `updateNotificationController` |
| PATCH | `/api/notifications/manage/:notificationId/deactivate` | `deactivateNotificationController` |
| GET | `/api/notifications/:notificationId` | `getUserNotificationByIdController` |
| PATCH | `/api/notifications/:notificationId/read` | `markNotificationAsReadController` |
| PATCH | `/api/notifications/:notificationId/dismiss` | `dismissNotificationController` |
| PATCH | `/api/notifications/:notificationId/restore` | `restoreNotificationController` |
| DELETE | `/api/notifications/all` | `deleteAllUserNotificationsController` |
| DELETE | `/api/notifications/:notificationId` | `deleteUserNotificationController` |

> ⚠️ `/api/notifications/manage` and its update/deactivate routes use `authenticate` but **not** admin-role middleware — review authorization before treating them as admin-only.

</details>

<details>
<summary><strong>password.routes.js</strong> (4)</summary>

| Method | Path | Handler |
|---|---|---|
| POST | `/api/password/forgot` | `forgotPassword` |
| POST | `/api/password/reset-otp` | `resetWithOTP` |
| POST | `/api/password/reset-link` | `resetWithLink` |
| PATCH | `/api/password/change` | `changePassword` |

</details>

<details>
<summary><strong>postComment.routes.js</strong> (5)</summary>

| Method | Path | Handler |
|---|---|---|
| POST | `/api/community/posts/:postId/comments` | `createPostCommentController` |
| GET | `/api/community/posts/:postId/comments` | `getPostCommentsController` |
| GET | `/api/community/comments/:commentId/replies` | `getCommentRepliesController` |
| PATCH | `/api/community/comments/:commentId` | `updatePostCommentController` |
| DELETE | `/api/community/comments/:commentId` | `deletePostCommentController` |

</details>

<details>
<summary><strong>privateRoom.routes.js</strong> (20)</summary>

| Method | Path | Handler |
|---|---|---|
| POST | `/api/community/private-rooms` | `createPrivateRoomController` |
| GET | `/api/community/private-rooms` | `listPrivateRoomsController` |
| POST | `/api/community/private-rooms/join/code` | `joinPrivateRoomByCodeController` |
| POST | `/api/community/private-rooms/join/invite` | `joinPrivateRoomByInviteController` |
| POST | `/api/community/private-rooms/:roomId/messages` | `sendPrivateRoomMessageController` |
| GET | `/api/community/private-rooms/:roomId/messages` | `getPrivateRoomMessagesController` |
| GET | `/api/community/private-rooms/:roomId/messages/unread-count` | `getPrivateRoomUnreadCountController` |
| PATCH | `/api/community/private-rooms/:roomId/messages/read` | `markPrivateRoomReadController` |
| PATCH | `/api/community/private-rooms/:roomId/messages/:messageId` | `editPrivateRoomMessageController` |
| DELETE | `/api/community/private-rooms/:roomId/messages/:messageId` | `deletePrivateRoomMessageController` |
| GET | `/api/community/private-rooms/:roomId/members` | `getPrivateRoomMembersController` |
| DELETE | `/api/community/private-rooms/:roomId/members/:memberUserId` | `removePrivateRoomMemberController` |
| PATCH | `/api/community/private-rooms/:roomId/members/:memberUserId/mute` | `setPrivateRoomMemberMuteController` |
| PATCH | `/api/community/private-rooms/:roomId/lock` | `setPrivateRoomLockController` |
| POST | `/api/community/private-rooms/:roomId/regenerate-invite` | `regeneratePrivateRoomInviteController` |
| PATCH | `/api/community/private-rooms/:roomId/transfer-owner` | `transferPrivateRoomOwnerController` |
| PATCH | `/api/community/private-rooms/:roomId/leave` | `leavePrivateRoomController` |
| PATCH | `/api/community/private-rooms/:roomId/close` | `closePrivateRoomController` |
| GET | `/api/community/private-rooms/:roomId` | `getPrivateRoomController` |
| PATCH | `/api/community/private-rooms/:roomId` | `updatePrivateRoomController` |

</details>

<details>
<summary><strong>profile.routes.js</strong> (3)</summary>

| Method | Path | Handler |
|---|---|---|
| PATCH | `/api/profile` | `updateProfileController` |
| PATCH | `/api/profile/picture` | `uploadProfilePicture` |
| DELETE | `/api/profile/picture` | `removeProfilePicture` |

</details>

<details>
<summary><strong>public/public.routes.js</strong> (1)</summary>

| Method | Path | Handler |
|---|---|---|
| GET | `/api/public/stats` | `getLandingStatsController` |

</details>

<details>
<summary><strong>report.routes.js</strong> (15)</summary>

| Method | Path | Handler |
|---|---|---|
| POST | `/api/community/reports` | `createReportController` |
| GET | `/api/community/reports/my` | `listMyReportsController` |
| GET | `/api/community/reports/my/:reportId` | `getMyReportController` |
| GET | `/api/community/reports/moderation` | `listReportsForModerationController` |
| GET | `/api/community/reports/moderation/users/:reportedUserId` | `listReportsAgainstUserController` |
| GET | `/api/community/reports/moderation/users/:reportedUserId/statistics` | `getReportedUserStatisticsController` |
| GET | `/api/community/reports/moderation/targets/:targetType/:targetId` | `listReportsForTargetController` |
| GET | `/api/community/reports/moderation/targets/:targetType/:targetId/count` | `getTargetReportCountController` |
| PATCH | `/api/community/reports/moderation/:reportId/review` | `beginReportReviewController` |
| PATCH | `/api/community/reports/moderation/:reportId/resolve` | `resolveReportController` |
| PATCH | `/api/community/reports/moderation/:reportId/reject` | `rejectReportController` |
| PATCH | `/api/community/reports/moderation/:reportId/notes` | `updateReportNotesController` |
| PATCH | `/api/community/reports/moderation/:reportId/status` | `updateReportStatusController` |
| DELETE | `/api/community/reports/moderation/:reportId` | `permanentlyDeleteReportController` |
| GET | `/api/community/reports/moderation/:reportId` | `getReportForModerationController` |

</details>

<details>
<summary><strong>testimonial.routes.js</strong> (6)</summary>

| Method | Path | Handler |
|---|---|---|
| POST | `/api/testimonials` | `createTestimonial` |
| GET | `/api/testimonials/public` | `getPublicTestimonials` |
| GET | `/api/testimonials/admin` | `getAdminTestimonials` |
| PATCH | `/api/testimonials/admin/:id/approve` | `approveTestimonial` |
| PATCH | `/api/testimonials/admin/:id/reject` | `rejectTestimonial` |
| DELETE | `/api/testimonials/admin/:id` | `adminDeleteTestimonial` |

</details>

<details>
<summary><strong>trackers/energyTracker.routes.js</strong> (7)</summary>

| Method | Path | Handler |
|---|---|---|
| POST | `/api/trackers/energy` | `createEnergyController` |
| GET | `/api/trackers/energy` | `getEnergyEntriesController` |
| GET | `/api/trackers/energy/:energyEntryId` | `getEnergyEntryByIdController` |
| PATCH | `/api/trackers/energy/:energyEntryId` | `updateEnergyController` |
| DELETE | `/api/trackers/energy/:energyEntryId` | `softDeleteEnergyController` |
| PATCH | `/api/trackers/energy/:energyEntryId/restore` | `restoreEnergyController` |
| DELETE | `/api/trackers/energy/:energyEntryId/permanent` | `permanentlyDeleteEnergyController` |

</details>

<details>
<summary><strong>trackers/habitLog.routes.js</strong> (9)</summary>

| Method | Path | Handler |
|---|---|---|
| POST | `/api/trackers/habits/:habitId/logs` | `createHabitLogController` |
| GET | `/api/trackers/habits/:habitId/logs` | `getHabitLogsController` |
| PATCH | `/api/trackers/habits/:habitId/logs/complete` | `completeHabitController` |
| PATCH | `/api/trackers/habits/:habitId/logs/skip` | `skipHabitController` |
| GET | `/api/trackers/habits/:habitId/logs/:habitLogId` | `getHabitLogByIdController` |
| PATCH | `/api/trackers/habits/:habitId/logs/:habitLogId` | `updateHabitLogController` |
| DELETE | `/api/trackers/habits/:habitId/logs/:habitLogId` | `softDeleteHabitLogController` |
| PATCH | `/api/trackers/habits/:habitId/logs/:habitLogId/restore` | `restoreHabitLogController` |
| DELETE | `/api/trackers/habits/:habitId/logs/:habitLogId/permanent` | `permanentlyDeleteHabitLogController` |

</details>

<details>
<summary><strong>trackers/habitTracker.routes.js</strong> (10)</summary>

| Method | Path | Handler |
|---|---|---|
| POST | `/api/trackers/habits` | `createHabitController` |
| GET | `/api/trackers/habits` | `getHabitsController` |
| GET | `/api/trackers/habits/for-date` | `getHabitsForDateController` |
| GET | `/api/trackers/habits/:habitId` | `getHabitByIdController` |
| PATCH | `/api/trackers/habits/:habitId` | `updateHabitController` |
| PATCH | `/api/trackers/habits/:habitId/pause` | `pauseHabitController` |
| PATCH | `/api/trackers/habits/:habitId/resume` | `resumeHabitController` |
| DELETE | `/api/trackers/habits/:habitId` | `softDeleteHabitController` |
| PATCH | `/api/trackers/habits/:habitId/restore` | `restoreHabitController` |
| DELETE | `/api/trackers/habits/:habitId/permanent` | `permanentlyDeleteHabitController` |

</details>

<details>
<summary><strong>trackers/moodTracker.routes.js</strong> (7)</summary>

| Method | Path | Handler |
|---|---|---|
| POST | `/api/trackers/mood` | `createMoodController` |
| GET | `/api/trackers/mood` | `getMoodEntriesController` |
| GET | `/api/trackers/mood/:moodEntryId` | `getMoodEntryByIdController` |
| PATCH | `/api/trackers/mood/:moodEntryId` | `updateMoodController` |
| DELETE | `/api/trackers/mood/:moodEntryId` | `softDeleteMoodController` |
| PATCH | `/api/trackers/mood/:moodEntryId/restore` | `restoreMoodController` |
| DELETE | `/api/trackers/mood/:moodEntryId/permanent` | `permanentlyDeleteMoodController` |

</details>

<details>
<summary><strong>trackers/sleepTracker.routes.js</strong> (8)</summary>

| Method | Path | Handler |
|---|---|---|
| POST | `/api/trackers/sleep` | `createSleepController` |
| GET | `/api/trackers/sleep` | `getSleepEntriesController` |
| GET | `/api/trackers/sleep/date/:sleepDate` | `getSleepEntryByDateController` |
| GET | `/api/trackers/sleep/:sleepEntryId` | `getSleepEntryByIdController` |
| PATCH | `/api/trackers/sleep/:sleepEntryId` | `updateSleepController` |
| DELETE | `/api/trackers/sleep/:sleepEntryId` | `softDeleteSleepController` |
| PATCH | `/api/trackers/sleep/:sleepEntryId/restore` | `restoreSleepController` |
| DELETE | `/api/trackers/sleep/:sleepEntryId/permanent` | `permanentlyDeleteSleepController` |

</details>

<details>
<summary><strong>trackers/trackerMetadata.routes.js</strong> (4)</summary>

| Method | Path | Handler |
|---|---|---|
| GET | `/api/trackers/metadata` | `getTrackerMetadataController` |
| GET | `/api/trackers/metadata/emotions` | `getTrackerEmotionsController` |
| GET | `/api/trackers/metadata/activities` | `getTrackerActivitiesController` |
| GET | `/api/trackers/metadata/sleep-factors` | `getSleepFactorsController` |

</details>

<details>
<summary><strong>trackers/trackerReminder.routes.js</strong> (7)</summary>

| Method | Path | Handler |
|---|---|---|
| POST | `/api/trackers/reminders` | `createTrackerReminderController` |
| GET | `/api/trackers/reminders` | `getTrackerRemindersController` |
| GET | `/api/trackers/reminders/:trackerReminderId` | `getTrackerReminderByIdController` |
| PATCH | `/api/trackers/reminders/:trackerReminderId` | `updateTrackerReminderController` |
| DELETE | `/api/trackers/reminders/:trackerReminderId` | `softDeleteTrackerReminderController` |
| PATCH | `/api/trackers/reminders/:trackerReminderId/restore` | `restoreTrackerReminderController` |
| DELETE | `/api/trackers/reminders/:trackerReminderId/permanent` | `permanentlyDeleteTrackerReminderController` |

</details>

<details>
<summary><strong>trackers/trackerSettings.routes.js</strong> (2)</summary>

| Method | Path | Handler |
|---|---|---|
| GET | `/api/trackers/settings` | `getTrackerSettingsController` |
| PATCH | `/api/trackers/settings` | `updateTrackerSettingsController` |

</details>

<details>
<summary><strong>trackers/waterTracker.routes.js</strong> (13)</summary>

| Method | Path | Handler |
|---|---|---|
| POST | `/api/trackers/water/logs` | `createWaterController` |
| GET | `/api/trackers/water/logs` | `getWaterLogsController` |
| GET | `/api/trackers/water/logs/total` | `getWaterTotalController` |
| GET | `/api/trackers/water/logs/:waterLogId` | `getWaterLogByIdController` |
| PATCH | `/api/trackers/water/logs/:waterLogId` | `updateWaterController` |
| DELETE | `/api/trackers/water/logs/:waterLogId` | `softDeleteWaterController` |
| PATCH | `/api/trackers/water/logs/:waterLogId/restore` | `restoreWaterController` |
| DELETE | `/api/trackers/water/logs/:waterLogId/permanent` | `permanentlyDeleteWaterController` |
| POST | `/api/trackers/water/containers` | `createWaterContainerController` |
| GET | `/api/trackers/water/containers` | `getWaterContainersController` |
| GET | `/api/trackers/water/containers/:waterContainerId` | `getWaterContainerByIdController` |
| PATCH | `/api/trackers/water/containers/:waterContainerId` | `updateWaterContainerController` |
| DELETE | `/api/trackers/water/containers/:waterContainerId` | `softDeleteWaterContainerController` |

</details>

---

## 5. Socket.IO Interface

Connect to the same HTTP server with Socket.IO, passing a JWT access token as `auth.accessToken` (aliases `auth.access_token` / `auth.token` also work), or via an `Authorization: Bearer ...` handshake header.

- The server authenticates the connection against current account state
- Emits `socket:ready`
- Joins a personal notification room: `user:<user_id>`
- Supports WebSocket and polling; connection recovery lasts up to **2 minutes**
- `socket:error` carries `success: false`, `message`, `code`, `status_code`

```js
import { io } from "socket.io-client";

const socket = io("http://localhost:5000", { auth: { accessToken } });

socket.on("socket:ready", ({ user }) => console.log(user));
```

Implemented event families live in `src/sockets/publicChat.socket.js`, `privateRoom.socket.js`, and `directMessage.socket.js`:

| Area | Client Events | Server Events |
|---|---|---|
| **Public chat** | `public-chat:join`, `public-chat:leave`, `public-chat:message:send`, `public-chat:message:edit`, `public-chat:message:delete`, `public-chat:typing:start`, `public-chat:typing:stop`, `public-chat:read` | `public-chat:joined`, `public-chat:left`, `public-chat:message:new`, `public-chat:message:edited`, `public-chat:message:deleted`, `public-chat:typing:update`, `public-chat:read:updated`, online/user membership events |
| **Private rooms** | `private-room:join`, `private-room:join:code`, `private-room:join:invite`, `private-room:leave`, `private-room:message:send`, `private-room:message:edit`, `private-room:message:delete`, typing/read events | joined/left, message new/edited/deleted, typing/read updates, `private-room:error` |
| **Direct messages** | `direct:join`, `direct:leave`, `direct:typing`, `direct:stop-typing`, `direct:message`, `direct:message:edited`, `direct:message:deleted`, `direct:message:seen` | `direct:joined`, plus broadcasts of `direct:typing`, `direct:stop-typing`, `direct:message`, `direct:message:edited`, `direct:message:deleted`, `direct:message:seen` |

> ⚠️ These names come from actual handler registrations — inspect each socket handler for the exact payload and acknowledgment callback. Notably, the direct-message handler uses **legacy event names** and treats `direct:message` as a broadcast of a message already saved through REST. Newer names declared in `socketEvents.js` (e.g. `direct:message:send`) are **not registered** in this snapshot. A constant existing in code doesn't mean the event is wired up.

---

## 6. Implementation Notes and Verification Limits

- 📌 This documents the **uploaded snapshot only** — not a live production probe. No real credentials or database were used, and deployment behavior is unverified.
- 📌 `/api/notifications/manage` and its update/deactivate routes use `authenticate` but **do not** use admin-role middleware — review authorization before treating them as admin-only.
- 📌 Journal PIN enforcement is attached **route by route**; search, PDF export, and voice routes do not all include `requireJournalUnlock` in this snapshot. Check this against the intended privacy policy.
- 📌 The Google OAuth callback declares `failureRedirect: "/auth/google/failure"` while the router mounts the failure endpoint at `/api/auth/google/failure` — verify this redirect path in deployment.
- 📌 The inventory includes handlers whose responses or permissions can differ even within the same router. For an externally published, machine-readable OpenAPI spec, enumerate each endpoint's validator, query schema, response variants, and role checks individually, then verify against integration tests.

---

<sub>Generated from the 25 September 2026 backend snapshot. Verify against `backend/src/` before relying on this as a public contract.</sub>
