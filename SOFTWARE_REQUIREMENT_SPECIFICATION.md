Unwind Software Requirements Specification

Document control

Field

Value

Project

Unwind

Document type

Software Requirements Specification

Version

1.0

Product owners

Atharva Padwal and Parth Nikam

Requirements owner

Atharva Padwal

Frontend requirements owner

Parth Nikam

Baseline date

18 September 2026

Status

Active and change-controlled

Classification

Internal technical documentation

Revision history

Version

Date

Authors

Change

0.1

July 2026

Atharva Padwal and Parth Nikam

Initial product, authentication, assessment, journal and community requirements

0.5

August 2026

Unwind team

Expanded wellness, AI, realtime, moderation, administration and integration requirements

0.8

30 August–5 September 2026

Atharva Padwal and Parth Nikam

Incorporated tester-driven dashboard, loading, theme, caching and UX changes

0.9

6 September 2026

Unwind team

Production-launch baseline

1.0

18 September 2026

Atharva Padwal and Parth Nikam

Consolidated full requirements, change handling, traceability and acceptance criteria

1. Introduction

1.1 Purpose

This SRS defines the functional, data, interface, security, privacy, safety, performance, accessibility, reliability and operational requirements of Unwind.

The document is a controlled baseline, not a frozen description. Unwind was built incrementally, and several requirements changed after implementation evidence, tester feedback, production behaviour, security findings and usability review. This SRS records both the current requirement and the process used to accept, implement, test and document changes.

1.2 Product scope

Unwind is a privacy-first mental-wellness and self-care platform that provides:

secure accounts and user profiles;

structured onboarding and preferences;

DASS-21 self-assessment and progress history;

PIN-protected private journaling;

mood, energy, sleep, water and habit tracking;

wellness tools and reminders;

safety-aware AI-assisted support;

community posts, public/private rooms and direct messaging;

notifications;

reporting, moderation and administrative governance;

analytics and operational support.

Unwind supports well-being and self-reflection. It does not diagnose mental-health conditions, provide medical treatment, or replace professional care.

1.3 Intended audience

product owners;

frontend and backend developers;

testers and security reviewers;

project evaluators and academic reviewers;

content and wellness advisors;

future maintainers.

1.4 Related documents

README.md

ROADMAP.md

DECISIONS.md

ARCHITECTURE.md

SYSTEMDESIGN.md

DATABASE.md

SECURITY.md

PRIVACY.md

TERMS.md

API, testing and deployment documentation

2. Definitions

Term

Meaning

DASS-21

21-question Depression Anxiety Stress Scales self-assessment

Access token

Short-lived credential used for protected API access

Refresh token

Longer-lived credential used to obtain a new access token

Journal unlock session

Temporary server-recognized state permitting journal access after PIN verification

Step-up access

Additional verification required for sensitive administrative operations

Public room

Community chat space available under defined participation rules

Private room

Invite or membership-controlled community chat space

Direct conversation

One-to-one or approved direct messaging context

Identity mode

User choice controlling visible community identity while retaining internal accountability

Safety event

Controlled record of content classified as requiring additional safety handling

Soft deletion

Record hidden from normal use but retained temporarily under policy

Permanent deletion

Removal according to the approved lifecycle and provider coordination

Confirmed requirement

Supported by implementation, tests, documentation or production evidence

Planned requirement

Approved but not yet fully implemented or verified

3. Stakeholders and responsibilities

Stakeholder

Responsibility

Atharva Padwal

Product leadership, backend, database, security, integrations, deployment and documentation

Parth Nikam

Frontend architecture, interaction design, responsive UI, theme behaviour and client integration

AI/DASS contributor

Assessment and AI feature input where assigned by the team

NGO/content advisor

Wellness language and content guidance

Technical testers

Security, performance, compatibility and engineering feedback

Non-technical testers

Clarity, comfort, usefulness and usability feedback

End users

Use wellness and community features under the Terms and Privacy Policy

Administrators/moderators

Apply authorized safety actions and preserve auditability

4. Product overview

4.1 System context

flowchart TD
    User["User or administrator"] --> Client["React/Vite web client"]
    Client --> API["Node.js/Express API"]
    Client <--> RT["Socket.IO"]
    API --> DB["Neon PostgreSQL"]
    API --> Email["Brevo"]
    API --> Media["Cloudinary"]
    Client --> Analytics["PostHog"]
    API --> Analytics

4.2 User classes

User class

Description

Main access

Visitor

Unauthenticated person

Public pages, registration, login and approved testimonials

Registered unverified user

Account awaiting verification

Verification and restricted recovery flows

Authenticated user

Verified Unwind member

Private wellness, journal, assessment and community features

Restricted user

User subject to a warning, mute, block or restriction

Only actions allowed by the active restriction

Moderator

Authorized safety reviewer

Reports and permitted moderation actions

Administrator

Privileged user with valid step-up access

Administrative workflows and audit-aware actions

4.3 Operating environment

modern desktop and mobile web browsers;

frontend hosted on Vercel;

backend and realtime server hosted on Render;

PostgreSQL hosted on Neon;

HTTPS network communication;

Node.js 22 runtime;

responsive UI for desktop, tablet and mobile layouts.

4.4 Constraints

managed-service quotas and cold starts may affect performance;

the browser must never connect directly to PostgreSQL;

the product must preserve its non-diagnostic boundary;

sensitive information must not be sent to analytics or logs;

future scope is gated by security, privacy, testing and operational evidence;

requirements may evolve through the controlled process in Section 20.

5. Requirement conventions

5.1 Priority

Priority

Meaning

Must

Required for the intended product or a critical safety/security boundary

Should

Important for product quality; may be delivered incrementally

Could

Valuable enhancement that must not bypass higher-priority work

5.2 Status

Status

Meaning

Implemented

Feature exists according to current evidence

Implemented—verify

Feature exists but needs broader evidence or hardening

Planned

Approved future requirement

Open decision

Direction or acceptance threshold not yet approved

6. Public experience requirements

ID

Requirement

Priority

Status

Owner

Acceptance criterion

PUB-001

The system shall provide a public landing page explaining Unwind’s purpose.

Must

Implemented

Parth Nikam

A visitor can understand the product without signing in.

PUB-002

Public copy shall state that Unwind supports well-being and is not a diagnostic or emergency service.

Must

Implemented

Atharva Padwal

The limitation is visible in relevant public and feature copy.

PUB-003

The landing page shall include navigation, hero, statistics, features, experience, process, testimonials, CTA and footer sections.

Should

Implemented

Parth Nikam

Sections render responsively and navigation reaches their destinations.

PUB-004

Approved testimonials shall be available without authentication.

Should

Implemented

Atharva Padwal

Only approved testimonial records appear publicly.

PUB-005

The introductory animation shall appear only on the intended landing route.

Should

Implemented—verify

Parth Nikam

Authenticated and internal routes are not interrupted by the intro.

PUB-006

Motion-heavy public experiences shall provide skip, static or reduced-motion behaviour.

Must

Implemented—verify

Parth Nikam

prefers-reduced-motion users can access the page without forced animation.

PUB-007

Public routes shall include a branded not-found experience.

Should

Implemented

Parth Nikam

Unknown routes show a functional 404 page with recovery navigation.

7. Account and authentication requirements

ID

Requirement

Priority

Status

Owner

Acceptance criterion

AUTH-001

A visitor shall be able to register using required account information.

Must

Implemented

Atharva Padwal

A valid unique account is created and invalid input is rejected.

AUTH-002

The system shall verify the user’s email using an expiring OTP or approved verification mechanism.

Must

Implemented

Atharva Padwal

Correct unexpired verification succeeds once; invalid or expired attempts fail safely.

AUTH-003

Authentication and OTP endpoints shall be rate-limited.

Must

Implemented

Atharva Padwal

Requests exceeding configured limits receive a controlled response.

AUTH-004

A verified user shall be able to log in with supported credentials.

Must

Implemented

Atharva Padwal

Valid credentials create an authenticated session; invalid credentials do not reveal account details.

AUTH-005

Password login shall handle OAuth-only accounts without an uncontrolled server error.

Must

Implemented—verify

Atharva Padwal

Missing local password hash produces a controlled user-facing response.

AUTH-006

The system shall issue a short-lived JWT access token after successful authentication.

Must

Implemented

Atharva Padwal

Protected endpoints accept valid tokens and reject invalid or expired tokens.

AUTH-007

The system shall use a longer-lived refresh token in an HTTP-only cookie.

Must

Implemented

Atharva Padwal

Browser JavaScript cannot read the cookie and refresh works with credentialed requests.

AUTH-008

Refresh tokens shall rotate and belong to revocable user sessions.

Must

Implemented

Atharva Padwal

Successful refresh invalidates or supersedes the previous token according to policy.

AUTH-009

A user shall be able to log out of the current session.

Must

Implemented

Atharva Padwal

Refresh state is revoked and the cookie is cleared.

AUTH-010

A user shall be able to log out of all devices.

Must

Implemented

Atharva Padwal

All eligible refresh sessions become unusable.

AUTH-011

A user shall be able to request password recovery.

Must

Implemented

Atharva Padwal

Recovery creates a controlled expiring flow without account enumeration.

AUTH-012

A user shall be able to reset and change a password.

Must

Implemented

Atharva Padwal

New valid credentials work and affected sessions follow the approved revocation policy.

AUTH-013

The system shall support Google OAuth.

Should

Implemented

Atharva Padwal

A valid Google identity maps safely to an Unwind account.

AUTH-014

Google-created accounts shall support the Google profile image, optional custom upload, change and removal.

Should

Implemented

Atharva Padwal and Parth Nikam

Profile-image changes persist and use the correct media source.

AUTH-015

A “Remember Me” choice shall affect session behaviour only as documented.

Should

Implemented—verify

Atharva Padwal

Session duration and cookie settings match the selected behaviour.

AUTH-016

Passkeys or stronger 2FA may be added after recovery and threat-model approval.

Could

Planned

Atharva Padwal

Design is approved and tested before release.

8. User profile, onboarding and settings requirements

ID

Requirement

Priority

Status

Owner

Acceptance criterion

USER-001

An authenticated user shall view and update permitted profile information.

Must

Implemented

Atharva Padwal and Parth Nikam

Updates persist and another user cannot modify them.

USER-002

The system shall support initial setup and profile-completion state.

Should

Implemented

Atharva Padwal

Incomplete users receive the intended onboarding flow.

USER-003

Users shall manage preferences and personal settings.

Should

Implemented

Atharva Padwal and Parth Nikam

Settings persist and reappear across authenticated sessions.

USER-004

Profile endpoints shall enforce authenticated ownership.

Must

Implemented—verify

Atharva Padwal

Changing a resource identifier cannot expose or modify another user’s profile.

USER-005

Users shall be able to initiate the approved account-deletion lifecycle.

Must

Implemented—verify

Atharva Padwal

Behaviour matches Privacy Policy and retention decisions.

USER-006

Device and login-history management should be added after session metadata is verified.

Could

Planned

Atharva Padwal

Users can identify and revoke individual sessions without exposing sensitive metadata.

9. Dashboard requirements

ID

Requirement

Priority

Status

Owner

Acceptance criterion

DASH-001

The dashboard shall provide unified access to Unwind’s major wellness features.

Must

Implemented

Parth Nikam

A user can navigate to each enabled module.

DASH-002

The dashboard shall visually express that Unwind’s features revolve around the user’s mental health.

Should

Implemented

Parth Nikam

The centre-and-orbit metaphor remains understandable on supported layouts.

DASH-003

Dashboard navigation shall remain usable without relying solely on animation.

Must

Implemented—verify

Parth Nikam

Keyboard and reduced-motion users can access all destinations.

DASH-004

The dashboard shall display relevant recent activity, progress, notifications or summaries.

Should

Implemented

Atharva Padwal and Parth Nikam

Only authenticated user data is shown.

DASH-005

Dashboard streaks shall use the approved source event rather than arbitrary feature activity.

Should

Implemented—verify

Atharva Padwal

Streak calculation matches the documented rule.

DASH-006

Dashboard loading, empty and error states shall be explicit.

Must

Implemented

Parth Nikam

Slow or failed requests never leave an unexplained blank view.

10. DASS-21 requirements

ID

Requirement

Priority

Status

Owner

Acceptance criterion

DASS-001

The system shall present the complete 21-question assessment.

Must

Implemented

Atharva Padwal and Parth Nikam

Every required question is shown exactly once in a valid assessment.

DASS-002

The system shall record required consent before assessment processing.

Must

Implemented

Atharva Padwal

Assessment state is linked to valid consent where required.

DASS-003

Responses shall be validated for completeness and permitted values.

Must

Implemented

Atharva Padwal

Missing, duplicate or out-of-range responses are rejected.

DASS-004

The system shall calculate depression, anxiety and stress scale scores deterministically.

Must

Implemented

Atharva Padwal

Known inputs produce expected tested scores.

DASS-005

The system shall provide severity or risk interpretation without diagnosis.

Must

Implemented

Atharva Padwal

Results contain the approved limitation and do not claim a diagnosis.

DASS-006

Users shall view assessment history and statistics.

Should

Implemented

Atharva Padwal and Parth Nikam

A user sees only their own assessments in chronological form.

DASS-007

The system shall provide approved recommendations based on results.

Should

Implemented

Atharva Padwal

Recommendations follow documented safety and non-clinical boundaries.

DASS-008

A user shall be able to generate or view a DASS report.

Should

Implemented

Atharva Padwal

The report contains correct scores, dates, limits and user ownership.

DASS-009

Assessment data shall receive highly restricted handling.

Must

Implemented—verify

Atharva Padwal

Authorization, analytics exclusion, logging and deletion behaviour are verified.

DASS-010

Field-level encryption shall be evaluated for assessment responses and results.

Must

Open decision

Atharva Padwal

A documented decision identifies fields, keys, rotation and migration impact.

11. Journal requirements

ID

Requirement

Priority

Status

Owner

Acceptance criterion

JRN-001

A user shall create a separate journal PIN.

Must

Implemented

Atharva Padwal

A valid PIN is accepted and never stored in plaintext.

JRN-002

PINs shall be treated as strings and preserve leading zeroes.

Must

Implemented

Atharva Padwal

A PIN such as 0123 remains distinct and verifies correctly.

JRN-003

A user shall unlock the journal through an expiring unlock session.

Must

Implemented

Atharva Padwal

Access ends on expiry, closure or other approved lock event.

JRN-004

A user shall change or disable the PIN after required verification.

Must

Implemented

Atharva Padwal

Changes require valid authenticated and journal-security context.

JRN-005

A user shall recover a forgotten PIN through controlled OTP verification.

Must

Implemented

Atharva Padwal

Expiry, rate and single-use controls are enforced.

JRN-006

Users shall create, edit and view journal entries.

Must

Implemented

Atharva Padwal and Parth Nikam

CRUD operations remain owner-bound.

JRN-007

Entries shall support draft and completed states.

Should

Implemented

Atharva Padwal

State transitions persist correctly.

JRN-008

Users shall favourite and unfavourite entries.

Should

Implemented

Atharva Padwal

The state is reflected consistently in list and detail views.

JRN-009

Users shall hide entry previews.

Should

Implemented

Atharva Padwal and Parth Nikam

Sensitive text is concealed in list contexts when enabled.

JRN-010

Users shall archive and restore entries.

Should

Implemented

Atharva Padwal

Archived entries leave the active list and remain owner-accessible.

JRN-011

Users shall soft-delete, restore and permanently delete entries according to policy.

Must

Implemented—verify

Atharva Padwal

Behaviour matches documented retention and provider cleanup.

JRN-012

Entries shall support tags, emotions and activities.

Should

Implemented

Atharva Padwal

Relationships persist without unauthorized cross-user references.

JRN-013

The system shall provide system prompts and permitted custom prompts.

Should

Implemented

Atharva Padwal

Prompt history and ownership behave as designed.

JRN-014

Entries shall support approved attachments and storage-usage reporting.

Should

Implemented—verify

Atharva Padwal

Type, size, ownership and deletion are enforced.

JRN-015

Journal reminders and settings shall be user configurable.

Should

Implemented

Atharva Padwal and Parth Nikam

Changes persist and affect only the owner.

JRN-016

Journal export shall require authentication, journal authorization and controlled output.

Should

Implemented—verify

Atharva Padwal

Export contains only selected owner data and no secret fields.

JRN-017

Voice notes and transcripts, when enabled, shall receive the same privacy controls as entry text.

Must

Implemented—verify

Atharva Padwal

Access, logs, retention and deletion are owner-bound.

JRN-018

Journal safety events shall be handled separately from ordinary entry content.

Must

Implemented—verify

Atharva Padwal

Safety handling follows approved policy without exposing journal content unnecessarily.

JRN-019

The journal PIN shall not be described as database encryption.

Must

Implemented

Atharva Padwal

Documentation and UI use accurate claims.

JRN-020

Field-level encryption and key rotation shall be decided for journal content.

Must

Open decision

Atharva Padwal

Decision, migration, recovery and operational impact are documented.

12. Wellness tracking requirements

ID

Requirement

Priority

Status

Owner

Acceptance criterion

WEL-001

Users shall create and view mood entries.

Must

Implemented

Atharva Padwal and Parth Nikam

Entries persist with correct ownership and dates.

WEL-002

Mood entries shall support approved emotions and activities.

Should

Implemented

Atharva Padwal

Relationships remain valid and owner-bound.

WEL-003

Users shall create and view energy entries.

Should

Implemented

Atharva Padwal

Valid values persist and appear in history.

WEL-004

Users shall record sleep information and contributing factors.

Should

Implemented

Atharva Padwal

Duration and factors validate correctly without duplicate conflicts.

WEL-005

Users shall configure water containers and create water logs.

Should

Implemented

Atharva Padwal and Parth Nikam

Totals and container references remain correct.

WEL-006

Users shall create habits and record habit completion.

Should

Implemented

Atharva Padwal

History and active state remain consistent.

WEL-007

Users shall manage tracker settings and reminders.

Should

Implemented

Atharva Padwal and Parth Nikam

Reminders respect user configuration.

WEL-008

Tracker data shall support history and useful summaries.

Should

Implemented

Atharva Padwal

Aggregation distinguishes missing data from recorded zero.

WEL-009

Tracker time boundaries shall follow a documented timezone strategy.

Must

Implemented—verify

Atharva Padwal

Daily records remain consistent for the user’s intended day.

WEL-010

Tracker lists shall use pagination or bounded queries where required.

Should

Implemented—verify

Atharva Padwal

Growing history does not create unbounded responses.

13. AI-support requirements

ID

Requirement

Priority

Status

Owner

Acceptance criterion

AI-001

Authenticated users shall create and continue AI-support conversations.

Should

Implemented

Atharva Padwal and Parth Nikam

Conversations are owner-bound and recoverable according to settings.

AI-002

The system shall validate messages and apply usage controls.

Must

Implemented

Atharva Padwal

Invalid, oversized or over-limit input receives a controlled response.

AI-003

Text shall be classified into ordinary, distress and high-risk handling paths.

Must

Implemented—verify

Atharva Padwal

Tested examples reach the expected path.

AI-004

High-risk content shall receive approved crisis guidance rather than unrestricted generated advice.

Must

Implemented—verify

Atharva Padwal

Provider failure cannot remove the approved safety response.

AI-005

AI output shall not diagnose or claim clinical authority.

Must

Implemented

Atharva Padwal

Prompts, validation and UI preserve this boundary.

AI-006

Users shall manage supported chatbot settings and history preferences.

Should

Implemented

Atharva Padwal and Parth Nikam

Settings affect only the owning user.

AI-007

The system shall track daily usage according to approved limits.

Should

Implemented

Atharva Padwal

Usage cannot be bypassed through ordinary repeated requests.

AI-008

External-provider data shall be minimized.

Must

Implemented—verify

Atharva Padwal

Only required context is sent; secrets and unrelated private records are excluded.

AI-009

AI requests shall use timeouts and controlled fallback or error states.

Must

Implemented—verify

Atharva Padwal

Users are not left in an endless loader and high-risk fallback remains available.

AI-010

The production provider and fallback chain shall be documented from verified configuration.

Must

Planned

Atharva Padwal

Documentation matches deployed configuration and data contracts.

14. Community requirements

ID

Requirement

Priority

Status

Owner

Acceptance criterion

COM-001

Users shall create a community profile.

Must

Implemented

Atharva Padwal and Parth Nikam

Profile state is unique and owner-controlled.

COM-002

Users shall choose an approved visible identity mode.

Must

Implemented

Atharva Padwal and Parth Nikam

Visible identity changes without removing stable internal accountability.

COM-003

Users shall create text posts and approved image/video posts.

Must

Implemented

Atharva Padwal

Content, media and ownership validate before publication.

COM-004

Users shall view a paginated or bounded community feed.

Must

Implemented

Atharva Padwal and Parth Nikam

Feed loads consistently without unbounded response growth.

COM-005

Users shall like and unlike posts without duplicate reactions.

Should

Implemented

Atharva Padwal

Repeated requests do not create duplicate likes.

COM-006

Users shall comment on posts and like comments.

Should

Implemented

Atharva Padwal

Parent resources and ownership are validated.

COM-007

Users shall share supported community content.

Should

Implemented

Atharva Padwal

Share behaviour preserves visibility and moderation state.

COM-008

Users shall report posts, comments, messages or users where supported.

Must

Implemented

Atharva Padwal

A report enters the moderation workflow without unauthorized evidence exposure.

COM-009

Users shall block other users.

Must

Implemented

Atharva Padwal

Block state affects relevant discovery and communication paths.

COM-010

The system shall enforce warnings and restrictions consistently.

Must

Implemented—verify

Atharva Padwal

Restricted actions fail over HTTP and Socket.IO.

COM-011

Community caching shall not bypass authorization or show stale forbidden content.

Must

Implemented—verify

Atharva Padwal and Parth Nikam

Cache invalidates on edit, deletion, moderation and restriction changes.

COM-012

Community operations shall provide loading, empty, success and error feedback.

Must

Implemented

Parth Nikam

Every major async state is visible and recoverable.

15. Rooms, direct messaging and realtime requirements

ID

Requirement

Priority

Status

Owner

Acceptance criterion

CHAT-001

Users shall discover and join permitted public rooms.

Must

Implemented

Atharva Padwal

Unauthorized or restricted users cannot join.

CHAT-002

Authorized users shall create or join invite-controlled private rooms.

Must

Implemented

Atharva Padwal

Membership is validated server-side.

CHAT-003

Users shall participate in permitted direct conversations.

Must

Implemented

Atharva Padwal

Only conversation members can list or send messages.

CHAT-004

Socket.IO connections shall authenticate users.

Must

Implemented—verify

Atharva Padwal

Missing, invalid or revoked authentication cannot create an authorized connection.

CHAT-005

Every room join and sensitive socket event shall verify membership and restriction state.

Must

Implemented—verify

Atharva Padwal

Client-supplied room IDs alone never grant access.

CHAT-006

Messages shall be persisted before canonical delivery acknowledgement.

Must

Implemented—verify

Atharva Padwal

Acknowledged messages have a stable stored identity.

CHAT-007

Users shall reply to and edit permitted messages.

Should

Implemented

Atharva Padwal

Sender ownership and target membership are enforced.

CHAT-008

The system shall support typing indicators and online presence.

Should

Implemented

Atharva Padwal

Ephemeral events remain membership-scoped.

CHAT-009

The system shall maintain unread state and read receipts.

Should

Implemented

Atharva Padwal

Counts reconcile after reconnect and multi-device use.

CHAT-010

The client shall reconnect safely after temporary disconnection.

Must

Implemented—verify

Atharva Padwal and Parth Nikam

Reconnect does not duplicate messages or restore unauthorized rooms.

CHAT-011

Message delivery shall include duplicate prevention or documented idempotency behaviour.

Must

Planned

Atharva Padwal

Retried sends produce one canonical message.

CHAT-012

Private rooms and direct messages shall not be described as end-to-end encrypted unless verified.

Must

Implemented

Atharva Padwal

User-facing claims remain technically accurate.

16. Notification requirements

ID

Requirement

Priority

Status

Owner

Acceptance criterion

NOT-001

The system shall create recipient-specific notification records from authorized events.

Must

Implemented

Atharva Padwal

Only intended recipients receive records.

NOT-002

Users shall list and filter their notifications.

Should

Implemented

Atharva Padwal and Parth Nikam

Another user’s notification cannot be retrieved.

NOT-003

Users shall mark one or all notifications as read where supported.

Should

Implemented

Atharva Padwal

Read state persists and counters update.

NOT-004

Users shall delete supported notification records.

Should

Implemented

Atharva Padwal

Delete remains owner-bound.

NOT-005

Notification actions shall navigate only to valid authorized routes.

Must

Implemented—verify

Parth Nikam

No action points to a missing or unauthorized route.

NOT-006

Notification views shall show skeleton, empty, error, retry and action-loading states.

Must

Implemented

Parth Nikam

Failed or slow requests remain understandable.

NOT-007

Notification creation shall avoid duplicate fan-out.

Should

Implemented—verify

Atharva Padwal

Reprocessed source events do not generate uncontrolled duplicates.

17. Moderation and administration requirements

ID

Requirement

Priority

Status

Owner

Acceptance criterion

ADM-001

Administrative APIs shall require an authorized role.

Must

Implemented

Atharva Padwal

Ordinary users receive a controlled denial.

ADM-002

Sensitive administrative APIs shall require additional step-up access.

Must

Implemented

Atharva Padwal

An admin role without valid step-up access cannot perform protected actions.

ADM-003

Admin access shall use a separate revocable HTTP-only token or stronger approved mechanism.

Must

Implemented

Atharva Padwal

Expired or revoked access cannot authorize admin actions.

ADM-004

Shared admin verification shall be replaced with per-administrator authentication.

Must

Planned

Atharva Padwal

Every privileged session is individually attributable and revocable.

ADM-005

Administrators shall view dashboard and analytics information permitted by policy.

Should

Implemented

Atharva Padwal and Parth Nikam

Data is accurate, authorized and privacy-controlled.

ADM-006

Administrators shall view users and permitted user details.

Must

Implemented

Atharva Padwal

Sensitive fields are minimized and access is audited where required.

ADM-007

Moderators shall review community reports.

Must

Implemented

Atharva Padwal

Status, evidence and decisions persist.

ADM-008

Authorized reviewers shall issue warnings and restrictions.

Must

Implemented

Atharva Padwal

Actions identify actor, target, reason, status and time.

ADM-009

The system shall support moderation proposals, votes and decisions where configured.

Should

Implemented

Atharva Padwal

Only authorized participants can propose or vote.

ADM-010

Administrators shall review and approve or reject testimonials.

Should

Implemented

Atharva Padwal

Only approved records appear publicly.

ADM-011

Sensitive admin actions shall generate audit records.

Must

Implemented

Atharva Padwal

Audit records contain actor, action, target, outcome and time.

ADM-012

Audit records shall avoid unnecessary copies of private content.

Must

Implemented—verify

Atharva Padwal

Logs support accountability without duplicating journals or messages.

18. External interface requirements

18.1 User interface

ID

Requirement

Priority

Status

UI-001

The UI shall be responsive across supported desktop, tablet and mobile sizes.

Must

Implemented—verify

UI-002

The UI shall support light and dark themes consistently.

Must

Implemented—verify

UI-003

The visual system shall use Unwind’s forest-green, sage, mint, cream and warm-neutral direction.

Should

Implemented

UI-004

Controls shall have visible hover, focus, disabled, loading and error states.

Must

Implemented—verify

UI-005

Destructive actions shall require clear intent and confirmation where appropriate.

Must

Implemented—verify

UI-006

Forms shall associate labels, validation and errors with inputs accessibly.

Must

Implemented—verify

UI-007

Users shall not rely only on colour or motion to understand status.

Must

Planned verification

UI-008

Reduced-motion preferences shall be respected.

Must

Implemented—verify

18.2 API interface

APIs shall use HTTPS in production;

requests and responses shall use documented JSON contracts except approved file/report responses;

protected endpoints shall authenticate and authorize every request;

validation errors shall use a consistent safe structure;

sensitive fields shall be omitted from responses;

pagination, filters and sorting shall be bounded and validated;

API versioning or compatibility policy shall be documented before breaking changes.

18.3 Database interface

the backend shall use PostgreSQL through parameterized pool.query calls;

the client shall never receive database credentials;

schema changes shall be version-controlled;

transactions shall protect multi-table invariants;

foreign keys, unique constraints and indexes shall support integrity and measured access paths.

18.4 Third-party interfaces

Provider

Requirement

Neon

Store application data through encrypted backend connections

Brevo

Deliver only approved transactional email with minimized template data

Cloudinary

Store approved media with database-linked ownership and deletion coordination

PostHog

Receive allowlisted analytics only; exclude sensitive content

Google OAuth

Validate identity server-side and map safely to an Unwind account

AI provider

Receive minimized permitted context and follow timeouts, safety and fallback requirements

19. Non-functional requirements

19.1 Security

ID

Requirement

Priority

Status/target

NFR-SEC-001

All production traffic shall use HTTPS.

Must

Implemented

NFR-SEC-002

Passwords and journal PINs shall use approved adaptive hashing.

Must

Implemented

NFR-SEC-003

SQL shall be parameterized.

Must

Implemented—full audit required

NFR-SEC-004

Authorization shall be enforced server-side.

Must

Implemented—full endpoint audit required

NFR-SEC-005

Secrets shall remain outside Git and client bundles.

Must

Implemented; continuous control

NFR-SEC-006

Sensitive operations shall be rate-limited.

Must

Implemented for recorded endpoints

NFR-SEC-007

Logs shall redact credentials and highly sensitive content.

Must

Verification required

NFR-SEC-008

Dependencies shall be monitored and patched.

Must

Dependabot active

NFR-SEC-009

Security headers shall meet an approved production baseline.

Must

Planned improvement

NFR-SEC-010

Field-level encryption shall be decided for the highest-risk fields.

Must

Open decision

19.2 Privacy

ID

Requirement

Priority

Status/target

NFR-PRI-001

The system shall collect only data required for documented functions.

Must

Continuous

NFR-PRI-002

Journal, assessment, private message and safety content shall be excluded from analytics.

Must

Implemented—verify

NFR-PRI-003

Retention periods shall be documented by data category.

Must

Open

NFR-PRI-004

Permanent deletion shall cover PostgreSQL and applicable providers.

Must

Open verification

NFR-PRI-005

Privacy claims shall not exceed implemented controls.

Must

Continuous

NFR-PRI-006

Users shall receive clear information about processors and data use.

Must

Privacy Policy completed

19.3 Performance

ID

Requirement

Priority

Status/target

NFR-PERF-001

Critical flows shall have approved p50 and p95 latency targets.

Must

Open decision

NFR-PERF-002

Lists and histories shall avoid unbounded data retrieval.

Must

Implemented—verify

NFR-PERF-003

Frontend bundles shall follow an approved size budget.

Should

Planned

NFR-PERF-004

Large routes and features should use code splitting.

Should

Planned

NFR-PERF-005

Caching shall define ownership, scope and invalidation.

Must

Partial

NFR-PERF-006

Realtime delivery shall measure persistence, acknowledgement and recipient latency.

Should

Planned

19.4 Reliability and recovery

ID

Requirement

Priority

Status/target

NFR-REL-001

Core authorization failures shall fail closed.

Must

Implemented

NFR-REL-002

Provider calls shall use timeouts and safe failures.

Must

Implemented—verify

NFR-REL-003

Retried writes shall avoid duplicate harmful outcomes.

Must

Partial/open

NFR-REL-004

Releases shall have smoke tests and rollback guidance.

Must

Planned documentation

NFR-REL-005

Database restore capability shall be verified through an exercise.

Must

Planned

NFR-REL-006

RPO and RTO shall be approved.

Must

Open decision

NFR-REL-007

Analytics failure shall not block core functions.

Must

Required architecture

19.5 Accessibility

ID

Requirement

Priority

Status/target

NFR-A11Y-001

All critical workflows shall be keyboard operable.

Must

Verification incomplete

NFR-A11Y-002

Focus shall remain visible and logically ordered.

Must

Verification incomplete

NFR-A11Y-003

Text and controls shall meet the approved contrast target.

Must

Target pending

NFR-A11Y-004

Dynamic status shall be exposed accessibly where needed.

Must

Verification incomplete

NFR-A11Y-005

Reduced-motion preferences shall be supported.

Must

Implemented—verify

NFR-A11Y-006

The team shall approve a WCAG conformance level and release gate.

Must

Open decision

19.6 Compatibility and usability

critical flows shall be tested on supported desktop and mobile browsers;

layouts shall remain usable at common viewport sizes;

user-facing errors shall explain recovery without exposing internals;

loading and empty states shall not be confused with failure;

controls and language shall remain calm, non-clinical and understandable;

safety or privacy messaging shall be direct rather than decorative.

19.7 Maintainability

frontend and backend responsibilities shall remain modular;

shared UI controls shall avoid inconsistent duplicate behaviour;

consequential pull requests shall update documentation;

schema changes shall use migrations;

CI shall run required checks on main and pull requests;

removed or superseded requirements shall remain auditable;

public contracts shall be versioned or changed compatibly.

19.8 Observability

health endpoints shall indicate service availability without exposing secrets;

operational logs shall support correlation and redaction;

critical authentication, database, provider and realtime failures shall be measurable;

alerts and severity thresholds shall be documented;

safety-event visibility shall be restricted;

monitoring and analytics shall remain separate from private wellness content.

20. Requirements evolution and change management

20.1 Principle

Unwind’s requirements are allowed to change. The project does not treat requirement evolution as failure. It treats undocumented, unreviewed or untested change as failure.

20.2 Change workflow

flowchart TD
    Trigger["Feedback, defect, risk, evidence or new need"] --> CR["Create change record"]
    CR --> Impact["Assess feature, UX, data, security, privacy and deployment impact"]
    Impact --> Decision{"Decision"}
    Decision -->|Accept| Baseline["Update requirement and owner"]
    Decision -->|Defer| Backlog["Record reason and revisit condition"]
    Decision -->|Reject| History["Keep rationale"]
    Baseline --> Implement["Implement incrementally"]
    Implement --> Verify["Test and review"]
    Verify --> Docs["Update SRS, roadmap, decisions and changelog"]

20.3 Required change-record fields

Field

Requirement

Change ID

Stable identifier

Date

Request and decision dates

Source

User feedback, defect, security, performance, provider, policy or team

Previous requirement

Exact baseline being changed

Proposed requirement

New behaviour or constraint

Reason

Evidence and expected value

Impact

UI, API, database, security, privacy, testing, deployment and documentation

Owner

Atharva Padwal, Parth Nikam or an explicitly assigned role

Decision

Accepted, deferred, rejected or superseded

Verification

Tests, review and evidence required

20.4 Examples of handled evolution

Change

Why it changed

How Unwind handled it

Result

Community expanded beyond public chat

Users required multiple privacy and support levels

Delivered identity selection and REST foundation first, then rooms, DMs, Socket.IO, moderation and caching

Broad community system with explicit membership rules

Journal expanded beyond basic text entries

Privacy and reflection needs required more control

Added PIN sessions, states, tags, prompts, attachments, export, reminders and recovery incrementally

Rich journal with separate privacy boundary

Google OAuth added after initial deferral

Lower-friction signup became valuable

Integrated OAuth while preserving local-password and OAuth-only account states

Multiple supported authentication paths

Dashboard cards replaced

Tester feedback described the dashboard as generic

Redesigned around a mental-health “solar system” and retested themes and interaction states

More distinctive product identity

Loading states became a product requirement

Cold starts and network delays created blank or unstable views

Added global loader, skeletons, progress, empty, success and error states

Clearer perceived reliability

Community caching added

Chat and feed latency affected usability

Introduced caching and faster local feedback, retaining backend authorization

Improved perceived speed; measurement work remains

Admin role gained step-up access

Permanent privilege in an ordinary session increased risk

Added separate admin verification, token and revocation

Stronger boundary; per-admin authentication still planned

Documentation expanded after launch

Source code alone did not explain safety, architecture or evidence

Added decisions, database, architecture, system design, roadmap and SRS

Auditable engineering record

CI and security evidence expanded

Manual testing could not protect sensitive flows

Added automated tests, CI checks, Gitleaks, Dependabot and deployed scans

Repeatable quality gate with known coverage gaps

20.5 Versioning rules

minor clarification without behavioural change: update wording and changelog;

additive compatible requirement: increment minor document version;

breaking product, API, data, security or privacy change: require a decision record and major baseline review;

replaced requirement: mark Superseded, retain history and link the replacement;

uncertain evidence: use Implemented—verify, Open decision or Unknown; do not guess.

21. Data requirements

The production public schema currently includes 79 tables, 914 columns, 79 primary-key constraints, 127 foreign-key constraints, 38 unique constraints and 366 indexes.

Data domains

users, profiles, settings and sessions;

authentication tokens and email logs;

DASS questions, consent, assessments, responses, results and reports;

journal entries, security, tags, emotions, activities, prompts, attachments, exports, voice and reminders;

mood, energy, sleep, water, habits and tracker settings;

AI conversations, messages, settings, usage and safety events;

community profiles, posts, comments, reactions, media and reports;

rooms, membership, messages, direct conversations and direct messages;

notifications and per-user notification state;

warnings, restrictions, moderation actions, proposals, votes, admin sessions and audit logs;

testimonials.

Data rules

every sensitive row shall have an owner or an explicit authorization model;

relational references shall use verified foreign keys where appropriate;

unique constraints shall protect invariants such as duplicate membership or reaction;

retention and deletion shall be approved per category;

external media deletion shall coordinate with database state;

production data shall not appear in tests, documentation or public examples;

database TLS does not replace application-level encryption;

backups are not considered proven until restoration is tested.

22. Business and safety rules

ID

Rule

BR-001

Unwind shall not diagnose or replace professional care.

BR-002

Users shall access only records they own or are explicitly authorized to access.

BR-003

Visible anonymity shall not remove internal moderation accountability.

BR-004

High-risk guidance shall follow approved safety content rather than unrestricted generation.

BR-005

Administrative authority shall require role verification and step-up access.

BR-006

Moderation actions shall be attributable and auditable.

BR-007

Deleted, archived, restricted and approved states shall remain distinct.

BR-008

Sensitive content shall not enter analytics or ordinary logs.

BR-009

Features shall not make encryption, privacy or clinical claims beyond verified controls.

BR-010

New major scope shall not bypass stabilization and release gates.

23. Verification and acceptance

23.1 Verification methods

Method

Use

Unit test

Scoring, tokens, hashing, normalization and deterministic rules

Service test

Ownership, authorization, workflows and error handling

Database integration test

Queries, constraints, migrations and transactions

API integration test

Middleware-to-database behaviour

Realtime integration test

Connection, membership, delivery and reconnect

Client test

Routes, context, states and protected interactions

End-to-end test

Critical user journeys

Security test

IDOR, CSRF, XSS, upload, token and role abuse

Accessibility test

Keyboard, focus, semantics, contrast and motion

Manual review

Copy, safety, visual design and edge cases

Production evidence

Health, latency, error, recovery and deployment behaviour

23.2 Current evidence

18 backend tests and 2 client tests recorded;

authentication, role, admin, journal PIN, ownership-bound SQL, DASS scoring and AI-risk checks represented;

GitHub Actions checks syntax, tests, lint and build;

production Vite build succeeded;

78 commits scanned with Gitleaks and no leaks reported;

60 tester responses, including 15 technical and 45 non-technical participants;

roughly 90–95% of reported ratings were 4–5/5;

production deployment on Vercel, Render and Neon.

23.3 Remaining acceptance gaps

complete database integration testing;

complete API and Socket.IO authorization audit;

critical end-to-end journeys;

upload-security tests;

formal accessibility baseline;

multi-browser and device matrix;

approved performance targets;

tested rollback and database restore;

field-encryption decision;

retention and deletion verification;

per-administrator step-up authentication;

formal monitoring and incident response.

24. Requirements traceability summary

Requirement domain

Design source

Data source

Primary verification source

Authentication

ARCHITECTURE.md, SYSTEMDESIGN.md

users, auth_tokens, user_sessions

Auth and token tests

Profiles and settings

System design

Profile and settings tables

API and ownership tests

DASS-21

System design and decisions

DASS and assessment tables

Scoring and ownership tests

Journal

System design and decisions

Journal tables

PIN, ownership and lifecycle tests

Wellness trackers

System design

Tracker tables

API, aggregate and boundary tests

AI support

Architecture and system design

Chatbot and safety tables

Classification, fallback and privacy tests

Community

Architecture and system design

Community, room and message tables

API, Socket.IO and moderation tests

Notifications

System design

Notification tables

Ownership and fan-out tests

Administration

Architecture and decisions

Admin, warning, restriction and audit tables

Role, step-up and audit tests

Deployment

Architecture and roadmap

Environment configuration

CI, smoke, monitoring and rollback evidence

Detailed endpoint-level traceability shall be added with API.md and complete testing documentation.

25. Open requirements

ID

Open requirement

Owner

Target

Status

OPEN-001

Approve application-level encryption scope and key lifecycle

Atharva Padwal

30 Sep 2026

Open

OPEN-002

Approve retention and deletion periods

Atharva Padwal

30 Sep 2026

Open

OPEN-003

Replace shared admin verification

Atharva Padwal

30 Sep 2026

Planned

OPEN-004

Approve crisis content and review responsibility

Atharva Padwal

30 Sep 2026

Open

OPEN-005

Verify all Socket.IO event authorization

Atharva Padwal

10 Oct 2026

Planned

OPEN-006

Define write idempotency and message delivery guarantees

Atharva Padwal

12 Oct 2026

Open

OPEN-007

Define p50 and p95 performance targets

Atharva Padwal

12 Oct 2026

Open

OPEN-008

Approve bundle budget and route-splitting gate

Parth Nikam

18 Oct 2026

Planned

OPEN-009

Approve WCAG target and accessibility gate

Parth Nikam

20 Oct 2026

Open

OPEN-010

Complete restore and rollback exercises

Atharva Padwal

25 Oct 2026

Planned

OPEN-011

Establish integration, realtime and end-to-end coverage

Atharva Padwal and Parth Nikam

31 Oct 2026

Planned

OPEN-012

Document production AI provider and fallback contract

Atharva Padwal

31 Oct 2026

Open

26. SRS maintenance

The requirements owner reviews this SRS:

on every material feature change;

when a security, privacy or safety boundary changes;

when an API or schema change affects behaviour;

after significant tester feedback;

after production incidents;

before each major release;

at least once per milestone during active development.

No requirement should be marked implemented solely because a screen or endpoint exists. Implementation status requires appropriate evidence for behaviour, authorization, failure states and acceptance criteria.

27. Changelog

Date

Change type

Requirement areas

Owner

Description

July 2026

Added

Product, authentication, assessment, journal and community

Atharva Padwal and Parth Nikam

Established the first Unwind requirements.

August 2026

Expanded

Wellness, realtime, AI, administration and integrations

Unwind team

Added capabilities incrementally as module designs matured.

30 Aug–5 Sep 2026

Reclassified and expanded

Dashboard, loading, themes, performance and accessibility

Atharva Padwal and Parth Nikam

Converted tester feedback into explicit product requirements.

6 September 2026

Baselined

Production launch

Atharva Padwal and Parth Nikam

Recorded the public-launch requirement baseline.

12 September 2026

Expanded

Governance and technical evidence

Atharva Padwal

Linked decision, database, architecture and system-design documentation.

18 September 2026

Consolidated

All requirements

Atharva Padwal and Parth Nikam

Created the complete change-controlled SRS with acceptance criteria and traceability.

Future changes must add a row. If a requirement is reclassified, deprecated or superseded, record its ID, previous state, replacement and reason.

Appendix A. Exclusions

The current approved product does not include:

clinical diagnosis or treatment;

emergency-response guarantees;

medical-device claims;

guaranteed legal compliance in every jurisdiction;

end-to-end encryption unless separately implemented and verified;

unrestricted generative crisis counselling;

commercial-scale service-level commitments;

unapproved access to user wellness data by administrators.

Appendix B. Known limitations

This SRS consolidates confirmed product history and implementation evidence available through 18 September 2026. Exact endpoint paths and payloads require the API inventory. Some controls are implemented but need complete cross-module verification. Open items remain requirements rather than claims of completion.
