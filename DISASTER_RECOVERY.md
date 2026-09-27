<div align="center">

# 🆘 Disaster Recovery Plan

### How Unwind prepares for, responds to, and recovers from major incidents

[![RPO](https://img.shields.io/badge/RPO-Defined-2F6F5E?style=for-the-badge)](#-recovery-objectives)
[![RTO](https://img.shields.io/badge/RTO-Defined-5B8C6F?style=for-the-badge)](#-recovery-objectives)
[![Backups](https://img.shields.io/badge/Backups-Automated-4169E1?style=for-the-badge)](#-backup-strategy)

</div>

<br/>

This document defines how Unwind protects against data loss, service outages, and security incidents, and the steps taken to restore normal operation when something goes seriously wrong.

<br/>

## 📚 Table of Contents

- [Purpose & Scope](#-purpose--scope)
- [Recovery Objectives](#-recovery-objectives)
- [Risk Scenarios](#-risk-scenarios)
- [Backup Strategy](#-backup-strategy)
- [Incident Severity Levels](#-incident-severity-levels)
- [Incident Response Roles](#-incident-response-roles)
- [Recovery Procedures](#-recovery-procedures)
- [Communication Plan](#-communication-plan)
- [Post-Incident Review](#-post-incident-review)
- [Testing the Plan](#-testing-the-plan)

<br/>

## 🎯 Purpose & Scope

This plan covers recovery from events that threaten the availability, integrity, or confidentiality of Unwind's systems and data, including:

- Database corruption or accidental data loss
- Extended hosting provider outages (Vercel, Render, Neon)
- Security incidents involving unauthorized access
- Loss of critical credentials or infrastructure access
- Catastrophic deployment failures

> This plan does not replace the [Security Policy](./SECURITY.md), which governs vulnerability reporting and disclosure.

<br/>

## 🎯 Recovery Objectives

<div align="center">

| Metric | Definition | Target |
|---|---|---|
| **RPO** (Recovery Point Objective) | Maximum acceptable data loss, measured in time | ≤ 24 hours |
| **RTO** (Recovery Time Objective) | Maximum acceptable time to restore service | ≤ 24–48 hours for critical services |

</div>

> As a student-maintained project without dedicated 24/7 on-call staff, these are best-effort targets rather than contractual guarantees.

<br/>

## ⚠️ Risk Scenarios

<table>
<tr>
<td valign="top">

**Data-related**
- Accidental deletion of production data
- Corrupted database migration
- Ransomware or malicious data tampering

</td>
<td valign="top">

**Infrastructure-related**
- Hosting provider outage (Vercel, Render, Neon)
- DNS or domain issues
- Third-party service outage (email, media storage, analytics)

</td>
</tr>
<tr>
<td valign="top">

**Security-related**
- Compromised credentials or API keys
- Unauthorized administrative access
- Exposed secrets in source control

</td>
<td valign="top">

**Human-related**
- Faulty deployment introducing critical bugs
- Loss of access to key accounts (hosting, domain, email)
- Key maintainer unavailability during an incident

</td>
</tr>
</table>

<br/>

## 💾 Backup Strategy

| Asset | Backup Method | Frequency | Retention |
|---|---|---|---|
| **PostgreSQL database (Neon)** | Automated provider backups and point-in-time recovery | Continuous / daily snapshot | Per Neon plan retention window |
| **Media assets (Cloudinary)** | Provider-managed redundant storage | Continuous | Ongoing |
| **Source code** | Git version control (GitHub) | Every commit | Indefinite |
| **Environment configuration** | Secure internal record (not committed to Git) | On change | Until rotated/deprecated |
| **Infrastructure configuration** | Documented in `DEPLOYMENT.md` and hosting dashboards | On change | Ongoing |

**Before high-risk operations** (major migrations, bulk data changes), a manual on-demand backup or Neon branch snapshot is taken in addition to standard automated backups.

<br/>

## 🚦 Incident Severity Levels

<div align="center">

| Level | Description | Example |
|---|---|---|
| 🔴 **SEV-1 — Critical** | Full outage or data breach affecting all users | Database unreachable, credentials leaked |
| 🟠 **SEV-2 — High** | Major feature unavailable or significant data-integrity risk | Journal or authentication broken |
| 🟡 **SEV-3 — Moderate** | Degraded experience, limited impact | Slow performance, minor feature outage |
| 🟢 **SEV-4 — Low** | Cosmetic or non-blocking issue | UI glitch with no functional impact |

</div>

<br/>

## 👥 Incident Response Roles

| Role | Responsibility |
|---|---|
| **Incident Lead** | Coordinates the response, makes final calls on mitigation steps |
| **Technical Responder(s)** | Diagnose the issue and implement the fix or recovery action |
| **Communications Owner** | Updates status pages, users, or stakeholders as needed |
| **Scribe** | Documents timeline, actions taken, and decisions for the post-incident review |

> On a small team, one person may hold multiple roles. Roles should still be explicitly assigned at the start of an incident.

<br/>

## 🛠️ Recovery Procedures

### 1. Database Failure or Corruption

1. Confirm the scope of data loss or corruption using Neon's dashboard and logs.
2. Restore from the most recent clean backup or point-in-time recovery snapshot.
3. Validate data integrity on a Neon branch before promoting it to production.
4. Redeploy the backend if connection strings or schema changed.
5. Run the post-deployment verification checklist from [DEPLOYMENT.md](./DEPLOYMENT.md).

### 2. Hosting Provider Outage

1. Confirm the outage via the provider's status page.
2. Communicate expected downtime to users if the outage is prolonged (see [Communication Plan](#-communication-plan)).
3. Monitor the provider's resolution and verify service recovery once restored.
4. If an outage is extended and critical, evaluate temporary failover options (e.g., redeploying to an alternate provider) as a last resort.

### 3. Security Incident / Compromised Credentials

1. Immediately rotate all potentially affected credentials (API keys, JWT secrets, database passwords).
2. Revoke active sessions/tokens if authentication systems may be compromised.
3. Review audit logs to determine scope of unauthorized access.
4. Follow the disclosure steps in [SECURITY.md](./SECURITY.md), including advisory publication if user data was affected.
5. Notify affected users in line with the [Communication Plan](#-communication-plan) and applicable legal requirements.

### 4. Faulty Deployment

1. Follow the [Rollback Procedure](./DEPLOYMENT.md#-rollback-procedure) in `DEPLOYMENT.md`.
2. Confirm rollback resolved the issue using post-deployment verification.
3. Investigate root cause before reattempting the change.

<br/>

## 📢 Communication Plan

| Audience | Channel | Timing |
|---|---|---|
| **Users** | In-app notice / status update | As soon as impact is confirmed for SEV-1/SEV-2 |
| **Maintainers/Contributors** | Internal communication channel | Immediately upon detection |
| **Security researchers** (if applicable) | Private advisory thread | Per [SECURITY.md](./SECURITY.md) disclosure process |

Communications should be honest, timely, and free of unnecessary technical jargon — particularly important for a mental-wellness product where trust is central to the user relationship.

<br/>

## 🔎 Post-Incident Review

Within a reasonable time after resolution, conduct a review covering:

- Timeline of detection, response, and resolution
- Root cause analysis
- What worked well and what didn't
- Concrete action items to prevent recurrence
- Whether recovery objectives (RPO/RTO) were met

Findings are documented and, where relevant, fed back into [MONITORING.md](./MONITORING.md) to improve detection for similar future incidents.

<br/>

## 🧪 Testing the Plan

- Backup restoration is periodically tested against a non-production Neon branch to confirm backups are actually usable.
- Rollback procedures are exercised during routine deployments, not only real incidents.
- This document is reviewed and updated whenever infrastructure, providers, or team structure changes materially.

<br/>

---

<div align="center">

### 🌿 Prepared calm is better than panicked recovery.

See also: [MONITORING.md](./MONITORING.md) for detection · [DEPLOYMENT.md](./DEPLOYMENT.md) for rollback · [SECURITY.md](./SECURITY.md) for breach disclosure.

</div>
