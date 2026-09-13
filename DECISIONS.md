# Unwind Decision Log

This file records the consequential decisions that shaped Unwind, the reasons they were made, the alternatives considered, and their consequences. It is the project's shared memory: when a contributor asks, “Why is Unwind built this way?”, the answer should be here.

> **Scope:** Product, architecture, security, privacy, data, UX, deployment, testing, operations, and governance decisions are included. Routine bug fixes, dependency bumps, and purely cosmetic changes are excluded unless they alter project direction.

## How to read this log

| Field        | Meaning                                                                                                   |
| ------------ | --------------------------------------------------------------------------------------------------------- |
| ID           | Stable identifier; never reuse or renumber it                                                             |
| Date         | Decision date, or `Approx.` when reconstructed                                                            |
| Status       | `Accepted`, `Superseded`, `Deprecated`, `Proposed`, or `Needs review`                                     |
| Confidence   | `Confirmed` when explicitly recorded; `Inferred` when reconstructed from implementation or later evidence |
| Owners       | People or role accountable for the decision                                                               |
| Decision     | What was chosen                                                                                           |
| Why          | The actual problem, constraint, or trade-off behind the choice                                            |
| Alternatives | Serious options considered and why they were not chosen                                                   |
| Consequences | Benefits, costs, risks, and follow-up work created by the decision                                        |

## Decision summary

| ID      | Date                 | Area            | Decision                                                                | Status   | Confidence |
| ------- | -------------------- | --------------- | ----------------------------------------------------------------------- | -------- | ---------- |
| UWD-001 | Approx. Jul 2026     | Product         | Build a privacy-first wellness platform                                 | Accepted | Confirmed  |
| UWD-002 | Approx. Jul 2026     | Safety          | Support wellness; do not diagnose                                       | Accepted | Confirmed  |
| UWD-003 | Approx. Jul 2026     | Product         | Unite assessments, journal, trackers, community, and tools              | Accepted | Confirmed  |
| UWD-004 | Approx. Jul 2026     | Delivery        | Use a small cross-functional team with NGO content input                | Accepted | Confirmed  |
| UWD-005 | 15 Jul 2026          | Architecture    | Use React, Node/Express, and PostgreSQL                                 | Accepted | Confirmed  |
| UWD-006 | 15 Jul 2026          | Auth            | Use short access tokens and rotating HTTP-only refresh cookies          | Accepted | Confirmed  |
| UWD-007 | 15 Jul 2026          | Identity        | Require email verification and support password recovery                | Accepted | Confirmed  |
| UWD-008 | 15 Jul 2026          | Scope           | Defer advanced identity features from authentication v1                 | Accepted | Confirmed  |
| UWD-009 | 23 Jul 2026          | Frontend        | Use React + Vite, Router, Axios, Context, and plain CSS                 | Accepted | Confirmed  |
| UWD-010 | Approx. Jul 2026     | Data            | Store persistent wellness data in PostgreSQL                            | Accepted | Confirmed  |
| UWD-011 | Approx. Jul 2026     | Assessment      | Use DASS-21 with history and recommendations                            | Accepted | Confirmed  |
| UWD-012 | Approx. Jul–Aug 2026 | Journal         | Protect journals with a separate hashed PIN and unlock session          | Accepted | Confirmed  |
| UWD-013 | Approx. Jul–Aug 2026 | Journal         | Make journaling feature-rich but user-controlled                        | Accepted | Confirmed  |
| UWD-014 | Approx. Aug 2026     | Community       | Support public rooms, private rooms, and direct messages                | Accepted | Confirmed  |
| UWD-015 | Approx. Aug 2026     | Privacy         | Let community users control identity visibility                         | Accepted | Confirmed  |
| UWD-016 | Approx. Aug 2026     | Realtime        | Use Socket.IO for community interactions                                | Accepted | Confirmed  |
| UWD-017 | Approx. Aug 2026     | Safety          | Add reporting, moderation, warnings, restrictions, and audit logs       | Accepted | Confirmed  |
| UWD-018 | Approx. Aug 2026     | Admin           | Separate admin role from step-up admin access                           | Accepted | Confirmed  |
| UWD-019 | Approx. Aug 2026     | AI safety       | Separate crisis/high-risk, distress, and ordinary text                  | Accepted | Confirmed  |
| UWD-020 | Approx. Aug 2026     | Notifications   | Use per-user notification records                                       | Accepted | Confirmed  |
| UWD-021 | 24 Aug 2026          | Governance      | Adopt wellness terms, moderation authority, and Mumbai jurisdiction     | Accepted | Confirmed  |
| UWD-022 | Approx. Aug 2026     | Hosting         | Deploy frontend to Vercel, backend to Render, DB to Neon                | Accepted | Confirmed  |
| UWD-023 | Approx. Aug 2026     | Integration     | Proxy `/api` through Vercel and preserve SPA fallback                   | Accepted | Confirmed  |
| UWD-024 | Approx. Aug 2026     | Email/media     | Use Brevo for email and Cloudinary for uploaded media                   | Accepted | Confirmed  |
| UWD-025 | Approx. Aug 2026     | Analytics       | Use privacy-conscious PostHog configuration                             | Accepted | Confirmed  |
| UWD-026 | Approx. Aug 2026     | Brand           | Use a calm, premium, non-clinical visual language                       | Accepted | Confirmed  |
| UWD-027 | Approx. Aug 2026     | Brand           | Use the tangled-to-calm logo and intro metaphor                         | Accepted | Confirmed  |
| UWD-028 | 30 Aug 2026          | UI architecture | Centralize customized date/time controls without changing API contracts | Accepted | Confirmed  |
| UWD-029 | Approx. Aug–Sep 2026 | Dashboard       | Put mental health at the center of a feature “solar system”             | Accepted | Confirmed  |
| UWD-030 | Approx. Aug–Sep 2026 | UX              | Add global loading, empty, success, and error states                    | Accepted | Confirmed  |
| UWD-031 | Approx. Aug–Sep 2026 | Performance     | Cache community data and optimize perceived speed                       | Accepted | Confirmed  |
| UWD-032 | By 2 Sep 2026        | Quality         | Add automated tests and GitHub Actions quality gates                    | Accepted | Confirmed  |
| UWD-033 | By 3 Sep 2026        | Security        | Use Dependabot, Gitleaks, Nuclei, and Observatory as layered checks     | Accepted | Confirmed  |
| UWD-034 | Approx. Sep 2026     | Release         | Stabilize and document before adding another major feature              | Accepted | Inferred   |
| UWD-035 | 6 Sep 2026           | Launch          | Keep the app live before the official social launch                     | Accepted | Confirmed  |
| UWD-036 | Approx. Aug–Sep 2026 | Validation      | Test with technical and non-technical users                             | Accepted | Confirmed  |
| UWD-037 | Approx. Sep 2026     | Documentation   | Maintain a complete engineering and governance document set             | Accepted | Confirmed  |
| UWD-038 | 12 Sep 2026          | Governance      | Maintain this chronological decision log                                | Accepted | Confirmed  |

---

## Chronological decisions

### UWD-001 — Build Unwind as a privacy-first mental-wellness platform

* **Date:** Approx. July 2026
* **Status:** Accepted
* **Confidence:** Confirmed
* **Owners:** Unwind founding team
* **Decision:** Position Unwind as a privacy-first mental-wellness and self-care platform.
* **Why:** Existing wellness tools were perceived as fragmented and often required users to trade privacy for access. Mental-wellness data is unusually sensitive, so privacy needed to be a core product property rather than a late security add-on.
* **Alternatives:** A generic productivity app was too broad; a clinical platform would create a different evidence, regulatory, and professional-care burden; a community-only app would not address private self-care.
* **Consequences:** Every feature handling assessments, journals, profiles, conversations, or analytics must be evaluated against this promise. Privacy claims must remain narrower than the technical evidence can prove.
* **Evidence:** Product definition and launch messaging repeatedly used “privacy-first mental wellness and self-care.”

### UWD-002 — Support wellness without diagnosing users

* **Date:** Approx. July 2026
* **Status:** Accepted
* **Confidence:** Confirmed
* **Owners:** Product and content team
* **Decision:** Unwind provides screening, reflection, habits, peer support, and guidance; it does not diagnose, treat, or replace professional care.
* **Why:** DASS-21 scores and AI-assisted guidance can be helpful without being medical diagnoses. The boundary reduces harmful overclaiming and keeps the user experience supportive rather than clinical.
* **Alternatives:** Diagnostic language was rejected because the app lacks clinical oversight and medical validation. Removing assessments entirely was rejected because structured self-reflection remains valuable.
* **Consequences:** Disclaimers must appear wherever assessment results or sensitive guidance could be misread. Copy, recommendations, reports, and marketing must preserve this boundary.
* **Evidence:** README, Terms, launch copy, and evaluation documents explicitly state the non-diagnostic boundary.

### UWD-003 — Bring the wellness journey into one connected space

* **Date:** Approx. July 2026
* **Status:** Accepted
* **Confidence:** Confirmed
* **Owners:** Atharva Padwal (Product lead)
* **Decision:** Combine DASS-21, private journaling, mood/energy and wellness tracking, a wellness toolkit, community, and progress insights in one product.
* **Why:** The core problem was fragmentation across multiple apps. A connected platform can give the user continuity between assessment, reflection, daily action, and support.
* **Alternatives:** Separate micro-apps would be simpler but recreate fragmentation. A journal-only MVP would offer less differentiation.
* **Consequences:** The dashboard must unify the experience, and feature breadth increases testing, accessibility, privacy, and performance obligations.

### UWD-004 — Use a small cross-functional team and NGO content input

* **Date:** Approx. July 2026
* **Status:** Accepted
* **Confidence:** Confirmed
* **Owners:** Atharva Padwal and Unwind team
* **Decision:** Split work across backend/product, frontend, and AI/DASS responsibilities, with an NGO consultant informing wellness content.
* **Why:** The feature set spans engineering, interaction design, assessment logic, and sensitive content. External domain input improves tone and safety while retaining a student-led delivery model.
* **Alternatives:** A single-developer model would slow delivery; treating wellness content as purely technical would weaken credibility.
* **Consequences:** Technical ownership and content approval should be explicit in future pull requests and releases.

### UWD-005 — Use React, Node/Express, and PostgreSQL

* **Date:** 15 July 2026
* **Status:** Accepted
* **Confidence:** Confirmed
* **Owners:** Atharva Padwal (Technical lead)
* **Decision:** Build the client with React, the API with Node.js/Express using ES modules, and the persistent data layer with PostgreSQL.
* **Why:** The stack matched team skills, supported fast full-stack development, enabled a relational ownership model for sensitive data, and fit available deployment services.
* **Alternatives:** A monolithic server-rendered framework was not selected; MongoDB was not chosen because relational data, ownership, reports, moderation, and history benefit from SQL constraints and joins.
* **Consequences:** The codebase is split into client and backend applications. Schema migrations, indexes, connection security, and consistent API contracts are continuing responsibilities.

### UWD-006 — Use short-lived access tokens and rotating HTTP-only refresh cookies

* **Date:** 15 July 2026
* **Status:** Accepted
* **Confidence:** Confirmed
* **Owners:** Atharva Padwal (Security lead)
* **Decision:** Use approximately 15-minute JWT access tokens and approximately 30-day refresh tokens delivered through HTTP-only cookies, with rotation and session revocation.
* **Why:** Keeping refresh tokens out of JavaScript reduces exposure to token theft through XSS while short access-token lifetime limits damage from leakage. Rotation and logout-all-devices provide session control.
* **Alternatives:** Long-lived tokens in localStorage were rejected due to exposure and revocation weaknesses. Server-only sessions were viable but not selected for the API architecture.
* **Consequences:** The client must use `withCredentials`, CORS and cookie attributes must be correct in production, and refresh reuse/revocation paths require security tests.

### UWD-007 — Require verification and provide recoverable account access

* **Date:** 15 July 2026
* **Status:** Accepted
* **Confidence:** Confirmed
* **Owners:** Atharva Padwal (Backend and authentication lead)
* **Decision:** Include email OTP/link verification, forgot/reset password, change password, rate limits, email logging, and session revocation in authentication v1; use Brevo for transactional email.
* **Why:** Verified identities reduce abuse and enable safe recovery. Rate limits are essential because OTP and password endpoints are attack targets.
* **Alternatives:** Launching with username/password alone was rejected as incomplete. Manual recovery was not scalable or private.
* **Consequences:** Email delivery is a production dependency; OTP expiration, retry, enumeration resistance, and rate-limit behavior need monitoring.

### UWD-008 — Defer advanced identity features from authentication v1

* **Date:** 15 July 2026
* **Status:** Accepted
* **Confidence:** Confirmed
* **Owners:** Atharva Padwal (Product and authentication lead)
* **Decision:** Defer 2FA, passkeys, email/username change, deactivation, login history, and device-management UI. Social login was initially deferred and later Google OAuth was added.
* **Why:** The first release needed a complete, secure baseline without allowing identity scope to block the core wellness product.
* **Alternatives:** Shipping all identity features initially would extend the critical path.
* **Consequences:** Deferred items remain roadmap candidates. Google OAuth is an example of a later decision that partially superseded the original deferral.

### UWD-009 — Use a lightweight React frontend architecture

* **Date:** 23 July 2026
* **Status:** Accepted
* **Confidence:** Confirmed
* **Owners:** Parth Nikam (Frontend lead)
* **Decision:** Use React + Vite, React Router, Axios, React Context for authentication, and plain CSS with a separate stylesheet for each page or component.
* **Why:** This kept the system understandable to the team, supported fast iteration, and avoided unnecessary framework or state-management overhead.
* **Alternatives:** Next.js and a global CSS framework were not selected for the initial app; storing access tokens persistently was rejected.
* **Consequences:** Route-level splitting and CSS consistency require deliberate discipline as the application grows; the later large-bundle warning shows the cost of a growing Vite SPA.

### UWD-010 — Persist wellness data in PostgreSQL

* **Date:** Approx. July 2026
* **Status:** Accepted
* **Confidence:** Confirmed
* **Owners:** Atharva Padwal (Backend and data lead)
* **Decision:** Store assessments, journal records, trackers, community data, notifications, moderation records, and user settings in PostgreSQL rather than relying on browser-only storage.
* **Why:** Users need multi-session history, ownership enforcement, statistics, admin safety workflows, and recoverable application state.
* **Alternatives:** `localStorage` was considered during early DASS planning but would not support durable cross-device history or server-side access control.
* **Consequences:** API authorization must bind every sensitive row to its owner. Data retention, deletion, backups, and field-level encryption remain governance work.

### UWD-011 — Use DASS-21 as a screening and progress feature

* **Date:** Approx. July 2026
* **Status:** Accepted
* **Confidence:** Confirmed
* **Owners:** Atharva Padwal (Product lead)
* **Decision:** Implement the 21-question DASS assessment with three scales, severity/risk interpretation, history, statistics, recommendations, and a PDF report.
* **Why:** DASS-21 provides a recognized structured self-assessment and makes progress visible over time while remaining compatible with Unwind’s non-diagnostic positioning.
* **Alternatives:** An unstructured “AI diagnosis” was rejected as unsafe. A one-time score without history would provide less ongoing value.
* **Consequences:** Scoring must be deterministic and tested. Reports and recommendations must include clear limitations and escalation guidance where appropriate.

### UWD-012 — Protect journals with a separate PIN and unlock session

* **Date:** Approx. July–August 2026
* **Status:** Accepted
* **Confidence:** Confirmed
* **Owners:** Atharva Padwal (Security and backend lead)
* **Decision:** Add create, unlock, change, disable, and OTP-based forgot-PIN flows; hash PINs, preserve leading zeroes, and require re-entry after the journal unlock session closes.
* **Why:** Journals are among the most sensitive records in Unwind. A second barrier protects against casual access from an already signed-in device.
* **Alternatives:** Relying only on account login was too weak for the privacy promise. Plaintext or reversibly stored PINs were rejected.
* **Consequences:** PINs must be treated as strings, never logged, and tested independently from passwords. A PIN gate is not a substitute for database encryption; field-level encryption remains unresolved.

### UWD-013 — Give users granular control over journal content

* **Date:** Approx. July–August 2026
* **Status:** Accepted
* **Confidence:** Confirmed
* **Owners:** Atharva Padwal (Journal feature lead)
* **Decision:** Support drafts and completed entries, favourites, hidden previews, archive/restore, soft and permanent deletion, tags, activities, emotions, prompts, attachments, and storage usage.
* **Why:** Journaling needs to feel private, flexible, and forgiving. Drafts reduce pressure, hidden previews improve discretion, and archive/soft-delete reduce accidental loss.
* **Alternatives:** A minimal text-only journal was simpler but did not meet the envisioned self-reflection experience.
* **Consequences:** More states create synchronization and testing complexity. “Deleted” must be defined precisely in privacy and retention documentation.

### UWD-014 — Support multiple levels of community interaction

* **Date:** Approx. August 2026
* **Status:** Accepted
* **Confidence:** Confirmed
* **Owners:** Atharva Padwal (Community feature lead)
* **Decision:** Build posts with media and reactions, public rooms, invite-based private rooms, and one-to-one direct messages, including replies, edits, typing state, presence, unread counts, and read receipts.
* **Why:** People need different levels of openness: public discovery, smaller trusted spaces, and direct support.
* **Alternatives:** A single public feed was easier but offered insufficient privacy and relationship depth.
* **Consequences:** Membership checks, media handling, moderation coverage, notification fan-out, and real-time performance become critical. Private rooms must not be described as end-to-end encrypted unless implemented and verified.

### UWD-015 — Let community users control identity visibility

* **Date:** Approx. August 2026
* **Status:** Accepted
* **Confidence:** Confirmed
* **Owners:** Atharva Padwal (Product and community safety lead)
* **Decision:** Add an identity toggle so users can participate with more or less identity exposure.
* **Why:** Mental-health conversations involve stigma and vulnerability. Pseudonymous participation can lower the barrier to seeking peer support.
* **Alternatives:** Real-name-only participation could improve accountability but reduce psychological safety; fully anonymous use could increase abuse.
* **Consequences:** Moderators still need stable internal identifiers and auditability. Product copy must explain anonymity boundaries accurately.

### UWD-016 — Use Socket.IO for real-time community features

* **Date:** Approx. August 2026
* **Status:** Accepted
* **Confidence:** Confirmed
* **Owners:** Atharva Padwal (Realtime backend lead)
* **Decision:** Use Socket.IO for chat delivery, typing indicators, presence, and related live events.
* **Why:** It provided a familiar event model, reconnection support, and good compatibility with the Node backend.
* **Alternatives:** Polling would be simpler operationally but slower and wasteful; a managed realtime provider would add cost and dependency.
* **Consequences:** Membership must be authorized on connection and events, and Render/network behavior requires reconnect, timeout, and delivery testing.

### UWD-017 — Build moderation as a first-class safety system

* **Date:** Approx. August 2026
* **Status:** Accepted
* **Confidence:** Confirmed
* **Owners:** Atharva Padwal (Moderation and security lead)
* **Decision:** Add reports, report review, warnings, restrictions, moderation actions, a decision center, and immutable-style admin audit records.
* **Why:** A wellness community cannot rely on user goodwill alone. Safety incidents require traceable, proportionate responses and accountable administrators.
* **Alternatives:** Post deletion alone would be opaque and insufficient; automated moderation alone would produce context errors.
* **Consequences:** Moderation policy, evidence retention, appeals, least privilege, and response-time expectations need explicit governance.

### UWD-018 — Separate admin role from step-up admin access

* **Date:** Approx. August 2026
* **Status:** Accepted
* **Confidence:** Confirmed
* **Owners:** Atharva Padwal (Security and admin lead)
* **Decision:** A normal authenticated account may have an admin role, but sensitive admin pages require an additional “Use as Admin” verification and a separate HTTP-only `admin_access_token` that can be revoked.
* **Why:** Permanent admin authority in an ordinary session increases the impact of session compromise. Step-up access creates a deliberate boundary.
* **Alternatives:** A role claim alone was easier but offered less protection. A completely separate admin identity system was more complex.
* **Consequences:** The shared admin password recorded in the 2 September evaluation is a known weakness. Per-admin credentials, stronger step-up authentication, expiry, and accountability are required future improvements.

### UWD-019 — Triage AI-assisted text by safety level

* **Date:** Approx. August 2026
* **Status:** Accepted
* **Confidence:** Confirmed
* **Owners:** Atharva Padwal (Product safety lead)
* **Decision:** Separate crisis/high-risk language, distress, and ordinary text instead of treating every input as a generic chatbot request.
* **Why:** The system must react differently to possible immediate danger than to routine wellness conversation, while avoiding diagnosis.
* **Alternatives:** A single unrestricted generative response path was unsafe; keyword-only handling would be brittle.
* **Consequences:** Crisis handling needs conservative fallbacks, clear human-help guidance, failure states, and ongoing false-positive/false-negative evaluation.

### UWD-020 — Model notifications per user

* **Date:** Approx. August 2026
* **Status:** Accepted
* **Confidence:** Confirmed
* **Owners:** Atharva Padwal (Backend lead)
* **Decision:** Use notification definitions plus user-specific notification records, with filters, read state, and actions.
* **Why:** Delivery and read status vary by recipient even when the underlying event is shared.
* **Alternatives:** A single global notifications table without per-user state would make personalization and unread tracking difficult.
* **Consequences:** Fan-out, deduplication, retention, and authorization need careful handling.

### UWD-021 — Establish wellness terms and moderation authority

* **Date:** 24 August 2026
* **Status:** Accepted
* **Confidence:** Confirmed
* **Owners:** Atharva Padwal (Product and governance lead)
* **Decision:** Terms define Unwind as a wellness service, authorize reporting/moderation and suspension/deletion, disclose third-party processing, and select India/Mumbai jurisdiction.
* **Why:** The live service needed clear user expectations, boundaries, enforcement rights, and processing disclosures.
* **Alternatives:** Launching with generic copied terms would not reflect Unwind’s sensitive features or moderation model.
* **Consequences:** Terms, Privacy Policy, actual processing, and deletion behavior must remain consistent. Legal review is still advisable before commercial scale.

### UWD-022 — Use managed free/low-cost hosting services

* **Date:** Approx. August 2026
* **Status:** Accepted
* **Confidence:** Confirmed
* **Owners:** Atharva Padwal (Deployment lead)
* **Decision:** Host the React client on Vercel, the Express backend on Render, and PostgreSQL on Neon.
* **Why:** These services fit a student-project budget, reduce infrastructure maintenance, support rapid deployment, and match the selected stack.
* **Alternatives:** Self-hosting would increase operational burden; a single-platform deployment could simplify networking but was not the best fit available.
* **Consequences:** Cold starts, cross-service latency, free-tier limits, database connection behavior, service outages, and vendor configuration become operational risks.

### UWD-023 — Present one frontend origin while proxying the API

* **Date:** Approx. August 2026
* **Status:** Accepted
* **Confidence:** Confirmed
* **Owners:** Atharva Padwal (Deployment and backend lead)
* **Decision:** Configure Vercel rewrites from `/api` to Render and retain `/index.html` fallback for client-side routes.
* **Why:** A stable same-origin-style API path simplifies client configuration and SPA navigation.
* **Alternatives:** Hard-coding the Render origin in every request would couple the client to infrastructure and complicate environments.
* **Consequences:** Rewrite order, cookies, CORS, websocket routing, and fallback behavior must be regression-tested on deployment.

### UWD-024 — Use managed email and media services

* **Date:** Approx. August 2026
* **Status:** Accepted
* **Confidence:** Confirmed
* **Owners:** Atharva Padwal (Integrations lead)
* **Decision:** Use Brevo for transactional email and Cloudinary for uploaded media/profile assets.
* **Why:** Both capabilities are operationally expensive to build and host safely inside the application.
* **Alternatives:** Self-hosted SMTP and local file storage would increase reliability, scaling, and security work.
* **Consequences:** Third-party data processing must be disclosed. Credentials must remain outside Git, and media access/deletion rules must match user expectations.

### UWD-025 — Configure analytics conservatively

* **Date:** Approx. August 2026
* **Status:** Accepted
* **Confidence:** Confirmed
* **Owners:** Atharva Padwal (Privacy and analytics lead)
* **Decision:** Use PostHog with autocapture disabled, identified-only behavior, and masked session recording.
* **Why:** Product and admin insights are useful, but indiscriminate capture conflicts with a privacy-first wellness product.
* **Alternatives:** Full autocapture would provide more data but create unnecessary collection risk; no analytics would make adoption and UX problems harder to measure.
* **Consequences:** Event names and allowed properties should be explicitly governed. Sensitive journal, assessment, chat, identity, and form content must never enter analytics.

### UWD-026 — Use a calm, premium, non-clinical brand system

* **Date:** Approx. August 2026
* **Status:** Accepted
* **Confidence:** Confirmed
* **Owners:** Parth Nikam (Frontend and visual design lead)
* **Decision:** Use deep forest green, sage, mint, cream, and warm off-white with a modern, calm, premium tone that is neither clinical, corporate, nor childish.
* **Why:** The interface must feel emotionally safe and credible without resembling a hospital portal.
* **Alternatives:** Bright gamification risked trivializing distress; sterile medical styling risked anxiety and implied clinical authority.
* **Consequences:** Dark mode, contrast, motion, illustrations, and every new component must be checked against the same system.

### UWD-027 — Express “tangled to calm” through the logo and introduction

* **Date:** Approx. August 2026
* **Status:** Accepted
* **Confidence:** Confirmed
* **Owners:** Parth Nikam (Frontend and visual design lead)
* **Decision:** Use a subtle “U” logo whose visual story moves from tangled to organized to calm, reinforced by an introductory strand-to-logo animation.
* **Why:** The metaphor communicates the meaning of “Unwind” without clinical imagery and gives the product a memorable identity.
* **Alternatives:** A generic leaf/brain logo would be familiar but less distinctive.
* **Consequences:** The animation must not delay entry, fail on power-saving devices, or ignore `prefers-reduced-motion`; a skip/static fallback is required.

### UWD-028 — Centralize custom controls while preserving data contracts

* **Date:** 30 August 2026
* **Status:** Accepted
* **Confidence:** Confirmed
* **Owners:** Parth Nikam (Frontend lead)
* **Decision:** Create reusable Unwind date/time controls in a common component area while preserving native `YYYY-MM-DDTHH:mm` event values expected by existing tracker/backend logic.
* **Why:** Native controls looked inconsistent with the brand, but changing the value contract would create unnecessary regression risk.
* **Alternatives:** Styling each page separately would duplicate logic; changing backend formats solely for appearance was rejected.
* **Consequences:** Shared controls become a small design-system dependency and need keyboard, mobile, dark-mode, and locale testing.

### UWD-029 — Center the dashboard on a wellness “solar system”

* **Date:** Approx. 30 August–5 September 2026
* **Status:** Accepted
* **Confidence:** Confirmed
* **Owners:** Parth Nikam (Dashboard UI lead)
* **Decision:** Replace a generic card grid with a visual system where “Mental Health” is the center and Unwind’s features orbit it as planets.
* **Why:** Testers found the original dashboard generic. The metaphor communicates that features revolve around the user’s mental health and creates a portfolio-distinct experience.
* **Alternatives:** Conventional dashboard cards were clearer but less memorable; a purely decorative background would not communicate product hierarchy.
* **Consequences:** Responsiveness, discoverability, keyboard navigation, reduced motion, dark mode, and performance must be protected. The metaphor must never obscure basic navigation.

### UWD-030 — Treat loading and failure states as product features

* **Date:** Approx. August–September 2026
* **Status:** Accepted
* **Confidence:** Confirmed
* **Owners:** Parth Nikam (Frontend experience lead)
* **Decision:** Add a global app loader plus local skeleton, spinner, progress, empty, success, and error states, all compatible with light/dark themes and reduced-motion preferences.
* **Why:** Network delays and backend cold starts made blank or unstable interfaces feel slower and less trustworthy.
* **Alternatives:** A single global spinner was insufficient for local actions; optimistic UI everywhere could misrepresent failed sensitive operations.
* **Consequences:** State behavior must be consistent and accessible, and loaders cannot replace actual performance measurement.

### UWD-031 — Improve both actual and perceived community speed

* **Date:** Approx. August–September 2026
* **Status:** Accepted
* **Confidence:** Confirmed
* **Owners:** Atharva Padwal (Community performance lead)
* **Decision:** Cache community data and improve immediate UI feedback while continuing to investigate end-to-end message latency.
* **Why:** Chat sends had taken roughly 2–3 seconds, with additional delay before appearing to another user. Community feels broken when conversation is not immediate.
* **Alternatives:** Visual loaders alone would hide but not solve latency; aggressive optimistic updates without reconciliation could create false delivery state.
* **Consequences:** Cache invalidation, acknowledgment, duplicate prevention, ordering, and p50/p95 latency measurement are necessary.

### UWD-032 — Make automated checks a merge and release gate

* **Date:** By 2 September 2026
* **Status:** Accepted
* **Confidence:** Confirmed
* **Owners:** Atharva Padwal (Quality and CI lead)
* **Decision:** Use Node’s test runner and GitHub Actions for backend tests/syntax checks and client checks, with Node 22, `npm ci`, pull-request and main-branch triggers, manual dispatch, timeouts, and concurrency cancellation.
* **Why:** Authentication, authorization, PIN handling, and moderation contain high-risk regressions that manual testing alone will miss.
* **Alternatives:** Manual-only verification was faster initially but not repeatable or auditable.
* **Consequences:** Tests become production safeguards and must grow beyond the initial roughly 20 checks. Disposable PostgreSQL integration tests, full critical-flow E2E tests, and meaningful coverage thresholds remain future work.

### UWD-033 — Use several security scanners with different purposes

* **Date:** By 3 September 2026
* **Status:** Accepted
* **Confidence:** Confirmed
* **Owners:** Atharva Padwal (Security lead)
* **Decision:** Use Dependabot for vulnerable dependencies, Gitleaks for secret history, Nuclei for deployed exposures, and Mozilla Observatory for browser/security-header posture.
* **Why:** No single tool covers dependency, secret, TLS, header, and application risks.
* **Alternatives:** Treating a clean dependency scan as proof of security was rejected implicitly by using multiple layers.
* **Consequences:** Findings require triage, patches, retesting, and documented exceptions. Clean Gitleaks results and passing CI do not prove absence of application vulnerabilities.

### UWD-034 — Stabilize and document before expanding scope

* **Date:** Approx. 2–6 September 2026
* **Status:** Accepted
* **Confidence:** Inferred
* **Owners:** Atharva Padwal (Release lead)
* **Decision:** Prioritize defect resolution, security evidence, accessibility, performance measurements, documentation, diagrams, and release governance instead of adding another major feature immediately before launch.
* **Why:** Evaluation evidence showed a feature-complete product whose remaining risk was proof and polish: auth/routing/profile defects, incomplete security evidence, large bundles, and operational gaps.
* **Alternatives:** Continuing feature growth could improve demo breadth but increase launch risk and technical debt.
* **Consequences:** The roadmap should gate major features on stability criteria. This entry is inferred from the evaluation and release sequence and should be confirmed by the team.

### UWD-035 — Separate technical go-live from the official launch

* **Date:** 6 September 2026
* **Status:** Accepted
* **Confidence:** Confirmed
* **Owners:** Atharva Padwal (Release lead)
* **Decision:** Keep Unwind deployed and exercised for several days before the official social-media announcement on 6 September 2026.
* **Why:** A soft-live period exposes deployment and production-only problems before traffic and public attention increase.
* **Alternatives:** Deploying for the first time at announcement time would maximize launch risk.
* **Consequences:** Production monitoring and rollback readiness are required even during the soft-live period. The missing-password-hash login error observed after launch illustrates why this separation matters.

### UWD-036 — Validate with both technical and non-technical users

* **Date:** Approx. August–September 2026
* **Status:** Accepted
* **Confidence:** Confirmed
* **Owners:** Atharva Padwal (Testing lead)
* **Decision:** Recruit technical testers to find engineering issues and non-technical users to assess clarity, comfort, usefulness, and usability; later reporting covered 60 responses (15 technical and 45 non-technical).
* **Why:** Developers detect different problems from intended users. A wellness product must be both technically credible and emotionally usable.
* **Alternatives:** Team-only testing would create severe familiarity bias.
* **Consequences:** Reports should separate cohorts, avoid inflated claims, preserve anonymity, use fictional demo data, and convert findings into owned issues with severity and status.

### UWD-037 — Maintain a full project-documentation set

* **Date:** Approx. September 2026
* **Status:** Accepted
* **Confidence:** Confirmed
* **Owners:** Atharva Padwal (Documentation lead)
* **Decision:** Maintain README, SECURITY, LICENSE, SRS, SDD, API, database/EER, testing report, deployment guide, contributing guide, changelog, privacy policy, terms, roadmap, release notes, and this decision log.
* **Why:** The project is intended for real users, academic evaluation, team continuity, and a strong portfolio. Source code alone cannot explain safety boundaries, architecture, validation, or operating procedures.
* **Alternatives:** A README-only approach would be easier but inadequate for maintainers and reviewers.
* **Consequences:** Documents must be versioned with code, assigned owners, reviewed at release, and prevented from drifting away from actual behavior.

### UWD-038 — Maintain a chronological, confidence-labelled decision log

* **Date:** 12 September 2026
* **Status:** Accepted
* **Confidence:** Confirmed
* **Owners:** Atharva Padwal (Decision-log maintainer)
* **Decision:** Maintain this `DECISIONS.md` as a chronological log of key and supporting decisions, explicitly marking reconstructed entries as inferred.
* **Why:** Unwind’s reasoning was distributed across conversations, code, reports, and launch work. Without a log, future contributors can accidentally reverse deliberate choices or repeat old debates.
* **Alternatives:** A category-only register makes chronology and supersession harder to follow; separate ADR files offer stronger isolation but add overhead at the project’s current size.
* **Consequences:** Every consequential pull request should add or update an entry. Old decisions remain in place and are marked `Superseded` rather than deleted.

---

## Open decisions and unresolved evidence

These are not recorded as completed decisions. Each should become a numbered entry once the team chooses a direction.

| Candidate | Question requiring a decision                                                                                                | Why it matters                                                         | Owner                                         | Target date |
| --------- | ---------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | --------------------------------------------- | ----------- |
| UWD-P01   | Which journal and assessment fields require application-level encryption, and how will keys rotate?                          | PIN gating and database TLS do not provide field-level confidentiality | Atharva Padwal (Security lead)                | 18 Sep 2026 |
| UWD-P02   | What are the exact retention and deletion periods for journals, media, messages, analytics, logs, and soft-deleted accounts? | Privacy copy and actual lifecycle must agree                           | Atharva Padwal (Privacy lead)                 | 20 Sep 2026 |
| UWD-P03   | What backup schedule and restore test objective will be adopted?                                                             | A backup is unproven until restoration is tested                       | Atharva Padwal (Deployment lead)              | 21 Sep 2026 |
| UWD-P04   | How will shared admin verification be replaced with per-admin step-up authentication?                                        | Shared secrets weaken attribution and revocation                       | Atharva Padwal (Security lead)                | 15 Sep 2026 |
| UWD-P05   | What crisis-response content, escalation path, and review owner are approved?                                                | High-risk guidance is safety-critical                                  | Atharva Padwal (Product safety lead)          | 14 Sep 2026 |
| UWD-P06   | What accessibility conformance target and release gate will Unwind use?                                                      | Motion-heavy and custom controls require explicit standards            | Parth Nikam (Frontend lead)                   | 22 Sep 2026 |
| UWD-P07   | What p50/p95 latency targets apply to login, signup, chat send/delivery, and dashboard load?                                 | “Feels fast” needs measurable acceptance criteria                      | Atharva Padwal (Performance lead)             | 24 Sep 2026 |
| UWD-P08   | What bundle-size budget and route-splitting strategy will be enforced?                                                       | The Vite build has warned about chunks over 500 kB                     | Parth Nikam (Frontend lead)                   | 25 Sep 2026 |
| UWD-P09   | What is the formal incident-response and rollback procedure?                                                                 | Public deployment creates operational responsibility                   | Atharva Padwal (Release lead)                 | 16 Sep 2026 |
| UWD-P10   | Which major feature, if any, is next after the stabilization gate?                                                           | Prevents roadmap growth from bypassing quality work                    | Atharva Padwal and Parth Nikam (Product team) | 30 Sep 2026 |

## Adding a new decision

1. Copy the template below when the choice is made, not weeks later.
2. Use the next stable ID. Never renumber earlier entries.
3. Record rejected alternatives honestly; do not rewrite history to make the chosen option look inevitable.
4. State negative consequences and follow-up work as clearly as benefits.
5. Link the pull request, issue, meeting note, test report, or chat date that proves the decision.
6. If a choice changes, keep the old entry, mark it `Superseded`, and link both entries.
7. Review open decisions before each release and the full file once per milestone.

```md
### UWD-XXX — Short decision title

- **Date:** YYYY-MM-DD
- **Status:** Proposed | Accepted | Superseded | Deprecated | Needs review
- **Confidence:** Confirmed | Inferred
- **Owners:** Name or role
- **Decision:** What was chosen, in one direct paragraph.
- **Why:** The problem, evidence, constraints, and trade-off.
- **Alternatives:** Options seriously considered and why they were rejected.
- **Consequences:** Benefits, costs, risks, and required follow-up.
- **Supersedes:** UWD-XXX, if applicable
- **Superseded by:** UWD-XXX, if applicable
- **Evidence:** PR/issue/report/chat date/link
```

## Pull-request rule

A pull request must update `DECISIONS.md` when it does any of the following:

* changes a privacy, security, safety, or clinical boundary;
* adds or removes a user-data category or third-party processor;
* changes authentication, authorization, retention, deletion, or moderation;
* introduces a framework, database, hosting service, or external API;
* changes a public contract, major data model, deployment topology, or quality gate;
* reverses an earlier product or UX direction;
* accepts a known risk for release.

Use this PR prompt:

> **Decision impact:** Does this pull request create, supersede, or contradict an entry in `DECISIONS.md`? If yes, include the decision ID and update the log. If no, explain why it is an implementation detail.

## Review cadence

* **On every consequential PR:** author updates the relevant entry.
* **Weekly during active development:** team reviews proposed and needs-review items.
* **Before every release:** release owner checks open risks, superseded decisions, evidence links, and documentation consistency.
* **After every incident:** record the corrective architectural or process decision; keep the incident details in the incident report.

## Evidence basis and limitations

This initial log was reconstructed on 12 September 2026 from prior Unwind conversations, the project README, recruiter/faculty evaluation material, the 2026 user-testing evaluation report, terms dated 24 August 2026, and remembered implementation state. Exact original chat permalinks were not available in the reconstruction. Dates marked `Approx.` and entries marked `Inferred` should be corrected when a commit, issue, or dated team record provides stronger evidence.

This file records decisions; it is not proof that every control works. Tests, threat models, scan results, policies, and production evidence belong in their respective documents and should be linked from future entries.

## Changelog

Record changes to the decision log itself here. Keep earlier rows; do not rewrite or remove them.

| Date        | Change type | Entries                          | Change                                                                         |
| ----------- | ----------- | -------------------------------- | ------------------------------------------------------------------------------ |
| 12 Sep 2026 | Added       | UWD-001–UWD-038, UWD-P01–UWD-P10 | Created the initial reconstructed decision log and open-decision register.     |
| 12 Sep 2026 | Added       | UWD-003, UWD-005–UWD-038         | Added an accountable owner to every decision entry that previously lacked one. |
| 12 Sep 2026 | Added       | UWD-P01–UWD-P10                  | Added `Owner` and `Target date` accountability fields to all open decisions.   |

Add a row whenever an entry is added, reclassified (for example, `Inferred` → `Confirmed`), deprecated, or superseded. For supersession, name both the old and replacement decision IDs.
