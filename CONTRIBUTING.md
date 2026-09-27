<div align="center">

# 🤝 Contributing to Unwind

### Thank you for helping build a calmer, more private mental wellness platform

</div>

<br/>

Every contribution — code, documentation, design, bug reports, or thoughtful feedback — helps make Unwind more useful and more trustworthy. This guide explains how to contribute effectively.

<br/>

## 📚 Table of Contents

- [Code of Conduct](#-code-of-conduct)
- [Ways to Contribute](#-ways-to-contribute)
- [Before You Start](#-before-you-start)
- [Development Setup](#-development-setup)
- [Branching Strategy](#-branching-strategy)
- [Commit Message Convention](#-commit-message-convention)
- [Coding Standards](#-coding-standards)
- [Testing Requirements](#-testing-requirements)
- [Pull Request Process](#-pull-request-process)
- [Design & UX Contributions](#-design--ux-contributions)
- [Sensitive Content Guidelines](#-sensitive-content-guidelines)
- [Recognition](#-recognition)

<br/>

## 📜 Code of Conduct

Participation in this project requires following our [Code of Conduct](./CODE_OF_CONDUCT.md). Because Unwind deals with mental-health content, we ask contributors to engage with extra care, empathy, and respect — both toward each other and toward how features may affect vulnerable users.

<br/>

## 🌱 Ways to Contribute

| Type | Examples |
|---|---|
| 🐛 **Bug fixes** | Fixing reported issues, edge cases, or regressions |
| ✨ **Features** | Implementing roadmap items or approved proposals |
| 📝 **Documentation** | Improving README, guides, code comments, API docs |
| 🎨 **Design** | UI polish, accessibility fixes, illustration, design system work |
| 🧪 **Testing** | Adding unit, integration, or end-to-end test coverage |
| 🌍 **Localization** | Translating UI strings and content (where supported) |
| 🔒 **Security** | See [SECURITY.md](./SECURITY.md) — do **not** open public issues for vulnerabilities |

<br/>

## 🔍 Before You Start

- Search existing [issues](https://github.com/Project-Unwind/Project-Unwind/issues) and [pull requests](https://github.com/Project-Unwind/Project-Unwind/pulls) to avoid duplicate work.
- For a **new feature or significant change**, open an issue first to discuss the approach before writing code.
- For a **small fix** (typo, minor bug, small refactor), feel free to open a PR directly.
- Check issues labeled `good first issue` if you're new to the codebase.

<br/>

## ⚙️ Development Setup

Follow the [Getting Started](./README.md#-getting-started) section of the README to set up the frontend and backend locally.

```bash
git clone https://github.com/Project-Unwind/Project-Unwind.git
cd Project-Unwind
```

Make sure both the backend (`/backend`) and frontend (`/client`) run locally and that you can log in with a test account before making changes.

<br/>

## 🌿 Branching Strategy

| Branch prefix | Purpose |
|---|---|
| `feature/` | New functionality |
| `fix/` | Bug fixes |
| `docs/` | Documentation-only changes |
| `refactor/` | Non-behavioral code improvements |
| `test/` | Test additions or fixes |
| `chore/` | Tooling, dependencies, CI/CD |

```bash
git checkout -b feature/journal-export
```

Branch from `main` and keep branches focused on a single concern.

<br/>

## ✍️ Commit Message Convention

Unwind follows a simplified [Conventional Commits](https://www.conventionalcommits.org/) style:

```
<type>: <short, imperative description>
```

**Examples:**

```
feat: add DASS-21 PDF export
fix: resolve journal PIN lockout after 5 attempts
docs: update environment variable table
refactor: simplify notification read-state logic
test: add coverage for room invite flow
chore: bump vite to latest patch version
```

| Type | Use for |
|---|---|
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation only |
| `refactor` | Code change with no behavior change |
| `test` | Adding or fixing tests |
| `chore` | Tooling, dependencies, config |
| `perf` | Performance improvement |
| `style` | Formatting, whitespace (no logic change) |

<br/>

## 🧑‍💻 Coding Standards

- Follow the existing folder structure described in the [README](./README.md#-project-structure).
- Run linting before committing:
  ```bash
  npm run lint
  ```
- Prefer clear, descriptive names over abbreviations.
- Keep components and functions focused — extract logic into hooks/services where it improves readability.
- Never commit secrets, `.env` files, or real user data (see [SECURITY.md](./SECURITY.md)).
- Avoid introducing new dependencies for functionality that can be reasonably implemented directly.
- Add comments for non-obvious logic, especially around scoring, security, or privacy-sensitive code paths.

<br/>

## 🧪 Testing Requirements

- Add or update tests for any new logic, especially around authentication, scoring, and data access.
- Run the full test suite before opening a PR:
  ```bash
  npm test
  ```
- Verify the production build succeeds:
  ```bash
  npm run build
  ```
- Manually test critical flows you touched (login, journal, assessment, messaging) in both light and dark themes.

<br/>

## 🔁 Pull Request Process

1. Ensure your branch is up to date with `main`.
2. Confirm lint, tests, and build all pass locally.
3. Open a pull request with:
   - A clear title following the commit convention
   - A description of **what** changed and **why**
   - Screenshots or a short clip for UI changes
   - Linked issue number, if applicable (`Closes #123`)
4. Fill out the PR checklist template.
5. Respond to review feedback — small, iterative commits are welcome.
6. A maintainer will merge once the PR is approved and CI passes.

> PRs that touch authentication, journaling privacy, or admin/moderation logic will receive additional review scrutiny given their sensitivity.

<br/>

## 🎨 Design & UX Contributions

If you're contributing design work, please review [UI_UX_DESIGN.md](./UI_UX_DESIGN.md) for the design system, tone, color palette, and accessibility standards before submitting mockups or UI changes.

<br/>

## 💚 Sensitive Content Guidelines

Because Unwind is a mental-wellness product, contributors should:

- Avoid adding sample content that trivializes or stereotypes mental-health experiences.
- Never use real personal data, real journal entries, or real assessment results in tests, screenshots, or seed data — use clearly fictional placeholders.
- Flag any feature change that could affect how the app responds to crisis-related content, and involve a maintainer before merging.

<br/>

## 🧭 Maintainers

Questions about the roadmap, review priorities, or larger design decisions can be directed to the project maintainers:

| Name | Role | GitHub |
|---|---|---|
| Atharva Padwal | Project Lead | [@AtharvaPadwal2](https://github.com/AtharvaPadwal2) |
| Parth Nikam | Project Lead | [@Parth170606](https://github.com/Parth170606) |

Organization: [Project-Unwind](https://github.com/Project-Unwind)

<br/>

## 🏅 Recognition

Contributors are credited in release notes and, where appropriate, in the project's acknowledgements. We're grateful for every fix, suggestion, and improvement — no contribution is too small.

See everyone who has contributed so far on the [GitHub contributors graph](https://github.com/Project-Unwind/Project-Unwind/graphs/contributors).

<br/>

---

<div align="center">

### 🌿 Thank you for helping build Unwind

Questions? Open a [discussion](https://github.com/Project-Unwind) or a draft PR — we're happy to help.

</div>
