<div align="center">

🌿 Unwind

A privacy-first mental wellness and self-care platform

Assessment, reflection, wellness tracking, supportive AI, and community — brought together in one calm digital space.

<br/>








<br/>

🚀 Live Application  ·  ⚙️ Backend  ·  🏢 Project Unwind

</div>

<br/>

Unwind helps people understand their emotional well-being, reflect privately, build healthier routines, and connect with supportive communities—without presenting itself as a diagnostic or clinical-care platform.

📚 Contents

<details>
<summary>Explore the project</summary>

<br/>







About

Highlights

Screenshots

Features

Technology

Architecture

Database

Security

Testing

Structure

Setup

Configuration

Deployment

Documentation

Roadmap

Team

Disclaimer

License

</details>

🌱 About Unwind

Mental-wellness tools are often fragmented: one application for assessments, another for journaling, another for habit tracking, and another for peer support. Unwind brings these experiences together while treating privacy, safety, and emotional comfort as product requirements rather than afterthoughts.

The platform is designed around four ideas:

Understand: structured DASS-21 self-assessment and progress history;

Reflect: a private journal protected by a separate PIN layer;

Build: mood, energy, sleep, hydration, habit, and wellness tracking;

Connect: community posts, rooms, direct messages, and moderated support.

The visual system uses deep forest green, sage, mint, cream, and warm neutral tones. Its central dashboard uses a “wellness solar system” metaphor: Unwind’s features revolve around the user’s mental health.

Unwind supports well-being. It does not diagnose, treat, or replace qualified professional care.

✨ Project highlights

Highlight

Evidence

Production application

Deployed with Vercel, Render, and Neon

Full-stack scope

React frontend, Express backend, PostgreSQL, Socket.IO

Database depth

79 tables, 914 columns, 127 foreign keys, 366 indexes

Authentication

JWT access tokens, rotating refresh sessions, OTP and Google OAuth

Privacy controls

Journal PIN sessions, ownership checks, masked analytics, audit trails

Real-time system

Public/private rooms, direct messages, presence, typing and read state

Quality process

GitHub Actions, automated tests, lint/build checks, security scans

User validation

60 testers: 15 technical and 45 non-technical

Product response

Approximately 90–95% of reported ratings were 4–5/5

Engineering governance

SRS, architecture, system design, database and decision documentation

🖼️ Screenshots

<div align="center">

Landing Page


Wellness Dashboard


DASS-21 Assessment


Private Journal


Community


Admin & Analytics


</div>

🧩 Features

<details open>
<summary><strong>🔐 Authentication and account security</strong></summary>

<br/>

Email registration and OTP verification

Secure login and logout

Short-lived JWT access tokens

Rotating refresh-token sessions

HTTP-only refresh cookies

Remember Me support

Forgot/reset and change-password flows

Logout from one or all devices

Google OAuth

Profile-image upload, replacement, and removal

Authentication and OTP rate limits

Profile, onboarding, preferences, and account settings

</details>

<details>
<summary><strong>🧠 DASS-21 self-assessment</strong></summary>

<br/>

Complete 21-question assessment

Separate depression, anxiety, and stress scoring

Severity and risk-level interpretation

Consent-aware assessment lifecycle

Result history and progress statistics

Supportive recommendations

Downloadable multi-page PDF report

Explicit non-diagnostic messaging

DASS-21 is used for structured self-reflection. Results are not a medical diagnosis.

</details>

<details>
<summary><strong>📔 Private journal</strong></summary>

<br/>

Separate hashed journal PIN

Temporary journal unlock sessions

Change, disable, and OTP-based PIN recovery

Draft and completed entries

Favourite entries and hidden previews

Archive, restore, soft deletion, and permanent deletion

Tags, emotions, and activities

System and custom prompts

Attachments and storage-usage visibility

Reminders and settings

Journal exports

Voice-note and transcript support where enabled

Controlled journal safety-event handling

</details>

<details>
<summary><strong>🌤️ Wellness tracking</strong></summary>

<br/>

Mood and emotion tracking

Energy entries

Sleep records and contributing factors

Hydration containers and water logs

Habits and completion history

Activities and reminders

Personal tracker settings

Progress history and dashboard summaries

</details>

<details>
<summary><strong>🤖 Safety-aware AI support</strong></summary>

<br/>

User-owned conversations and messages

Configurable chat settings and history preferences

Daily usage tracking

Separate ordinary, distress, and high-risk handling paths

Controlled safety events

Supportive, non-diagnostic responses

Explicit crisis and professional-help boundaries

Provider failure and loading states

</details>

<details>
<summary><strong>🤝 Community and content</strong></summary>

<br/>

Community profiles and identity visibility controls

Text, image, and video posts

Likes, shares, comments, and comment likes

Blocking and reporting

Warnings and restrictions

Cached feed data with controlled invalidation

Loading, empty, success, and error states

</details>

<details>
<summary><strong>💬 Rooms and direct messaging</strong></summary>

<br/>

Public discussion rooms

Invite-based private rooms

One-to-one direct conversations

Persistent Socket.IO messaging

Replies and message editing

Typing indicators and online presence

Unread counts and read receipts

Chat-history preferences

Server-side room-membership checks

Reconnection and delivery handling

</details>

<details>
<summary><strong>🔔 Notifications</strong></summary>

<br/>

Recipient-specific notifications

Read and unread state

Filters and contextual actions

Mark-all and delete operations

Skeleton, empty, error, retry, and action-loading states

</details>

<details>
<summary><strong>🛡️ Administration and moderation</strong></summary>

<br/>

Role-protected administration

Separate “Use as Admin” step-up flow

Revocable HTTP-only admin-access sessions

Administrative dashboard and analytics

User directory and user details

Reports and report review

Warnings, restrictions, and moderation actions

Moderation proposals, votes, and decision centre

Testimonial approval workflow

Administrator-access management

Audit logs for sensitive actions

</details>

<details>
<summary><strong>🎨 Experience and accessibility</strong></summary>

<br/>

Responsive desktop, tablet, and mobile layouts

Light and dark themes

Reduced-motion support

Global loader and local skeletons

Explicit empty, success, and error states

Custom controls and branded 404 experience

Motion-enhanced wellness dashboard

Calm, non-clinical visual language

</details>

🛠️ Technology stack

Layer

Technology

Frontend

React, Vite, JavaScript, React Router, Axios, CSS

UI and motion

Lucide React, Framer Motion, custom responsive components

Backend

Node.js 22, Express.js, ES modules

Backend structure

Routes → Validators → Controllers → Services → PostgreSQL

Database access

Raw parameterized PostgreSQL queries through pool.query

Database

PostgreSQL hosted on Neon

Realtime

Socket.IO

Authentication

JWT access/refresh tokens, HTTP-only cookies, OTP, Google OAuth

Email

Brevo

Media

Cloudinary

Analytics

PostHog with conservative capture settings

Frontend hosting

Vercel

Backend hosting

Render

CI/CD

GitHub Actions

Quality and security

Node test runner, ESLint, Dependabot, Gitleaks, Nuclei, Observatory

🏗️ Architecture

flowchart TD
    User["User or administrator"] --> Client["React + Vite client"]
    Client -->|"HTTPS REST"| API["Node.js + Express API"]
    Client <-->|"Socket.IO"| Realtime["Realtime server"]
    API --> Services["Domain services"]
    Realtime --> Services
    Services --> DB["Neon PostgreSQL"]
    Services --> Email["Brevo"]
    Services --> Media["Cloudinary"]
    Client --> Analytics["PostHog"]
    Services --> Analytics

The browser never connects directly to PostgreSQL. The backend validates input, derives trusted identity, enforces ownership and membership, executes parameterized SQL, and coordinates external services.

Backend request flow

flowchart LR
    Request["Request"] --> Middleware["Authentication and shared middleware"]
    Middleware --> Route["Route"]
    Route --> Validator["Validator"]
    Validator --> Controller["Controller"]
    Controller --> Service["Service"]
    Service --> Query["Parameterized pool.query"]
    Query --> DB["PostgreSQL"]

See ARCHITECTURE.md and SYSTEMDESIGN.md for the complete design.

🗄️ Database at a glance

Unwind uses a relational PostgreSQL schema designed around ownership, auditability, and modular feature domains.

Metric

Count

Tables

79

Columns

914

Primary-key constraints

79

Foreign-key constraints

127

Unique constraints

38

Indexes

366

Major domains include:

authentication, sessions, users, profiles, and settings;

DASS-21 assessments, responses, results, and reports;

journals, prompts, tags, attachments, exports, voice, and security;

mood, energy, sleep, hydration, habits, and reminders;

AI conversations, usage, settings, and safety events;

community content, rooms, direct messages, and reports;

notifications, moderation, restrictions, administration, and audit logs.

See DATABASE.md for the full data dictionary, relationships, constraints, classifications, and indexes.

🔐 Security and privacy

Unwind processes emotionally sensitive information. Security and privacy are therefore treated as system requirements.

Implemented safeguards

short-lived access tokens;

rotating, revocable refresh sessions;

HTTP-only authentication cookies;

password and journal-PIN hashing;

email verification and controlled recovery;

server-side role, ownership, and membership checks;

rate limits on sensitive endpoints;

parameterized PostgreSQL queries;

separate journal unlock sessions;

separate administrator step-up sessions;

warnings, restrictions, moderation, and audit trails;

conservative PostHog configuration;

dependency and secret scanning;

documented non-diagnostic boundaries.

Security work that remains open

per-administrator step-up authentication;

field-level encryption decision for highest-risk data;

complete retention and deletion verification;

tested database recovery and rollback;

full REST and Socket.IO authorization audit;

formal accessibility and security release gates.

Security claims are limited to verified controls. Private rooms and direct messages are not described as end-to-end encrypted.

Report vulnerabilities privately through SECURITY.md. Do not publish exploit details, credentials, or user information in a public issue.

✅ Testing and quality

Unwind combines automated checks, structured human testing, security tooling, and production validation.

Current evidence

18 recorded backend tests;

2 recorded client tests;

backend syntax and test checks;

frontend lint, test, and production-build checks;

CI on pushes and pull requests targeting main;

manual CI dispatch and concurrency cancellation;

successful Vite production build;

Gitleaks scan across 78 commits with no leaks reported;

Dependabot vulnerability monitoring;

Nuclei and security-header inspection;

responsive, theme, and critical-flow manual testing.

<div align="center">

🧪 Testers

🧑‍💻 Technical

🙋 Non-technical

⭐ Reported ratings of 4–5/5

60

15

45

~90–95%

</div>

These figures describe product-testing feedback. They do not represent clinical effectiveness or medical validation.

Planned quality expansion

PostgreSQL integration tests;

complete API integration tests;

Socket.IO authorization and reconnect tests;

critical end-to-end user journeys;

upload and provider-failure tests;

accessibility testing;

recovery and rollback exercises.

Read TESTING-REPORT.md for the user-testing evidence.

📁 Project structure

Project-Unwind/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── validators/
│   │   ├── socket/
│   │   └── server.js
│   ├── test/
│   ├── package.json
│   └── .env.example
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   └── main.jsx
│   ├── package.json
│   └── .env.example
├── docs/
│   └── screenshots/
├── .github/
│   └── workflows/
├── ARCHITECTURE.md
├── DATABASE.md
├── DECISIONS.md
├── LICENSE.md
├── PRIVACY.md
├── README.md
├── ROADMAP.md
├── SECURITY.md
├── SOFTWARE_REQUIREMENT_SPECIFICATION.md
├── SYSTEMDESIGN.md
├── TERMS.md
└── TESTING-REPORT.md

The repository is the authority for exact folder names as the project evolves.

🚀 Getting started

Prerequisites

Node.js 22.x

npm

Git

PostgreSQL or a Neon development database

development credentials for enabled external services

1. Clone the repository

git clone https://github.com/Project-Unwind/Project-Unwind.git
cd Project-Unwind

2. Install backend dependencies

cd backend
npm ci

3. Install frontend dependencies

cd ../client
npm ci

4. Configure development environments

Create local environment files from the repository examples if they are present:

cp backend/.env.example backend/.env
cp client/.env.example client/.env

Use development-only credentials. Never copy production secrets into local documentation, screenshots, issues, client code, or commits.

5. Prepare PostgreSQL

Create a development database and apply the schema or versioned migrations supplied by the repository. Do not run automated tests against production.

6. Start the backend

cd backend
npm run dev

7. Start the frontend

In another terminal:

cd client
npm run dev

Open the local URL printed by Vite, commonly http://localhost:5173.

⚙️ Configuration

The .env.example files and application configuration are authoritative. Typical categories include:

Backend

runtime and server port;

PostgreSQL connection;

allowed client origin;

access and refresh-token secrets;

cookie and session configuration;

Brevo email credentials and verified sender;

Cloudinary credentials;

OAuth configuration;

approved analytics and AI-provider configuration.

Frontend

API base URL;

enabled public OAuth configuration;

approved PostHog project configuration;

build-time feature settings where supported.

Never expose server secrets through a VITE_ variable. Vite variables are included in the browser bundle.

📜 Common scripts

Run commands from the applicable backend or client directory. Each package.json is authoritative.

Backend

npm run dev
npm start
npm test
npm run test:watch
npm run test:coverage
npm run test:ci

Frontend

npm run dev
npm run build
npm run preview
npm run lint
npm test

If a command is not present in the current package.json, use the scripts actually defined by the repository rather than adding assumptions to deployment instructions.

☁️ Deployment

Component

Platform

Address

Web client

Vercel

project-unwind-mu.vercel.app

API and realtime server

Render

project-unwind.onrender.com

Database

Neon

Managed PostgreSQL

Transactional email

Brevo

Managed email delivery

Media

Cloudinary

Managed media storage and delivery

Delivery flow

Develop a focused change.

Run applicable tests, lint, and build checks.

Open a pull request for review.

Let GitHub Actions run required checks.

Merge an approved, passing change.

Deploy the frontend and backend.

Run health and critical-flow smoke tests.

Monitor production errors and rollback or forward-fix when required.

📖 Documentation

Document

Purpose

ARCHITECTURE.md

System context, containers, boundaries, deployment and major flows

DATABASE.md

Complete PostgreSQL catalogue, relationships, constraints and indexes

DECISIONS.md

Chronological architectural and product decisions

LICENSE.md

Usage, modification and distribution terms

PRIVACY.md

Data collection, processing, rights, retention and providers

ROADMAP.md

Completed milestones, stabilization and future work

SECURITY.md

Security policy and responsible disclosure

SOFTWARE_REQUIREMENT_SPECIFICATION.md

Functional, non-functional and changing requirements

SYSTEMDESIGN.md

Implementation-level components, state and request flows

TERMS.md

User terms and product boundaries

TESTING-REPORT.md

Technical and non-technical user-testing evidence

Planned additions include comprehensive API, deployment, contributing, engineering-testing, incident-response, recovery, and release documentation.

🗺️ Roadmap

Completed

Secure account and session management

Email OTP verification and recovery

Google OAuth

DASS-21 assessment, history, insights, and reports

PIN-protected private journal

Wellness trackers and dashboard

Community posts and moderation

Public/private rooms and direct messages

Notifications

Administrative workflows and audit logs

Production deployment and public launch

Initial CI, automated testing, and security scans

Architecture, system design, database, decisions, roadmap, and SRS documentation

Current priorities

Complete API and deployment documentation

Replace shared admin verification

Approve retention and permanent-deletion rules

Decide application-level encryption scope

Verify Neon recovery through a restore exercise

Audit all REST and Socket.IO authorization paths

Define measurable performance budgets

Reduce frontend bundle size through route splitting

Establish the accessibility release gate

Expand integration, realtime, and end-to-end tests

See ROADMAP.md for owners, dates, phases, and change history.

🔄 How Unwind handles changing requirements

Unwind was developed incrementally. Requirements changed as the team learned from testers, production behaviour, security reviews, and implementation constraints.

Examples include:

public chat expanding into rooms, direct messages, presence, read state, reporting, and moderation;

the journal expanding from basic entries into PIN sessions, recovery, prompts, organization, attachments, exports, and safety handling;

Google OAuth being introduced after the initial authentication baseline;

a generic dashboard being redesigned into the wellness solar system after tester feedback;

loaders, skeletons, error states, and caching becoming explicit product requirements after real network delays;

administration gaining a separate step-up access boundary;

CI, security scans, and formal engineering documentation being added as the product approached launch.

Material changes follow this cycle:

flowchart LR
    Evidence["Feedback, defect or risk"] --> Impact["Impact analysis"]
    Impact --> Decision["Accept, defer or reject"]
    Decision --> Build["Incremental implementation"]
    Build --> Verify["Tests and review"]
    Verify --> Docs["Update SRS, roadmap, decisions and changelog"]

The current requirement baseline is documented in SOFTWARE_REQUIREMENT_SPECIFICATION.md.

🤝 Contributing

The repository is currently maintained by the Project Unwind team. Before contributing:

create a focused branch;

avoid unrelated changes;

follow the existing project structure;

add or update tests;

run lint, tests, and production build checks;

document API, schema, security, or requirement changes;

open a clear pull request.

Recommended branch and commit examples:

git checkout -b feat/notification-preferences
git commit -m "feat: add notification preferences"

Security vulnerabilities must follow the private process in SECURITY.md, not a public issue.

⚠️ Important disclaimer

Unwind is a wellness and self-reflection platform. It is not a medical device, does not provide a diagnosis, and is not a substitute for qualified mental-health professionals, emergency services, or crisis-support providers.

If you or another person may be in immediate danger, contact local emergency services. For a mental-health crisis, contact an appropriate qualified professional or crisis service in your region.

👥 Team and acknowledgements

Unwind is built by the Project Unwind team with input from technical testers, non-technical users, and wellness-content guidance.

Atharva Padwal

Project leadership, backend engineering, PostgreSQL, authentication, security, DevOps, integrations, testing, and documentation.




Parth Nikam

Frontend architecture, interaction design, responsive UI, visual system, theme behaviour, and client integration.




Thank you

The 60 technical and non-technical testers who shared feedback

The wellness-content and NGO advisor

Contributors who improved usability, security, accessibility, and clarity

Open-source maintainers whose work supports Unwind

📄 License

This project is distributed under the terms in LICENSE.md. Review the license before using, modifying, or distributing the source code.

<div align="center">

🌿 Built with empathy, privacy, and purpose.

If Unwind helps or inspires you, consider starring the repository ⭐ and sharing thoughtful feedback.

</div>
