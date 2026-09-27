<div align="center">

# 🎨 UI/UX Design System

### The visual language and design principles behind Unwind

[![Design Philosophy](https://img.shields.io/badge/Philosophy-Calm%20First-2F6F5E?style=for-the-badge)](#-design-philosophy)
[![Accessibility](https://img.shields.io/badge/Accessibility-Prioritized-5B8C6F?style=for-the-badge)](#-accessibility-principles)
[![Themes](https://img.shields.io/badge/Themes-Light%20%2F%20Dark-4169E1?style=for-the-badge)](#-color-system)

</div>

<br/>

This document defines Unwind's design principles, visual language, components, and interaction patterns to keep the product consistent, calm, and inclusive as it grows.

<br/>

## 📚 Table of Contents

- [Design Philosophy](#-design-philosophy)
- [Design Principles](#-design-principles)
- [Color System](#-color-system)
- [Typography](#-typography)
- [Spacing & Layout](#-spacing--layout)
- [Iconography & Imagery](#-iconography--imagery)
- [Motion & Animation](#-motion--animation)
- [Core Components](#-core-components)
- [Tone of Voice](#-tone-of-voice)
- [Accessibility Principles](#-accessibility-principles)
- [Dark Mode Guidelines](#-dark-mode-guidelines)
- [Design Review Checklist](#-design-review-checklist)

<br/>

## 🌱 Design Philosophy

Unwind's interface should feel like **a quiet room, not a clinic and not a feed**. Every design decision is filtered through one question:

> *"Does this help someone feel calmer and more in control — or does it add noise, urgency, or pressure?"*

The visual language draws from nature — soft greens, muted neutrals, and gentle contrast — deliberately avoiding the high-urgency red/orange patterns common in social and productivity apps.

<br/>

## 🧭 Design Principles

| Principle | What it means in practice |
|---|---|
| **Calm over urgent** | Avoid aggressive notification badges, harsh red alerts, or manipulative engagement patterns |
| **Clarity over density** | Favor generous whitespace and simple layouts over cramming in information |
| **Consistency over novelty** | Reuse established patterns rather than introducing new interaction models per screen |
| **Privacy-visible** | Make privacy-protecting actions (PIN lock, visibility settings) visible and easy to find, not buried |
| **Non-clinical warmth** | Avoid sterile, hospital-like visuals; favor approachable, human warmth |
| **Inclusive by default** | Design for a wide range of emotional states, abilities, and comfort levels from the start |

<br/>

## 🎨 Color System

Unwind's palette is nature-inspired, built around forest green, sage, mint, cream, and warm off-white tones.

<div align="center">

| Token | Role | Example Use |
|---|---|---|
| `--color-forest` | Primary brand color | Primary buttons, key highlights |
| `--color-sage` | Secondary accent | Secondary actions, active states |
| `--color-mint` | Light accent | Backgrounds, subtle highlights |
| `--color-cream` | Base background (light theme) | Page backgrounds, cards |
| `--color-off-white` | Surface color | Cards, modals, input fields |
| `--color-text-primary` | Primary text | Headings, body copy |
| `--color-text-muted` | Secondary text | Captions, helper text |
| `--color-success` | Positive feedback | Confirmations, completed states |
| `--color-warning` | Caution | Non-critical alerts |
| `--color-danger` | Critical feedback | Errors, destructive actions (used sparingly) |

</div>

> Colors are defined as design tokens (CSS variables) rather than hard-coded values, so both light and dark themes stay consistent and easy to update.

**Usage guidance:**

- Reserve `--color-danger` for genuinely critical states — destructive actions, errors — never for routine UI emphasis.
- Use color as a supporting signal, never the *only* way to convey meaning (pair with icons/text for accessibility).

<br/>

## ✍️ Typography

| Use | Style guidance |
|---|---|
| **Headings** | Clear hierarchy (H1–H4), generous line height, moderate weight — avoid overly bold, shouting headlines |
| **Body text** | Comfortable reading size (minimum ~16px equivalent), relaxed line height for long-form content like journal entries |
| **UI labels** | Concise, sentence case (not ALL CAPS) to keep tone calm and human |
| **Numeric/data** | Slightly tabular alignment for scores, streaks, and stats for easy scanning |

Font choices should prioritize legibility across devices, with a defined fallback stack for reliability.

<br/>

## 📐 Spacing & Layout

- Use a consistent spacing scale (e.g., 4px/8px base unit) across margins, padding, and gaps.
- Favor a single-column, focused layout for emotionally sensitive tasks like journaling and assessments — avoid competing UI elements during these flows.
- Use card-based layouts for dashboards and community feeds to create clear visual grouping.
- Maintain generous touch targets (minimum ~44×44px) for mobile interactions.

<br/>

## 🖼️ Iconography & Imagery

- Icons should be simple, rounded, and consistent in stroke weight (avoid mixing icon styles).
- Favor abstract, nature-inspired illustration over literal clinical imagery (e.g., avoid stethoscopes, hospital beds, or overly medical visuals).
- Avoid imagery that could feel triggering or overly literal when depicting mental-health themes (e.g., avoid graphic depictions of distress).
- Use empty-state illustrations that feel gentle and encouraging, not sterile "no data" messages.

<br/>

## 🎬 Motion & Animation

- Motion should support understanding (e.g., a smooth transition between dashboard cards), not decorate for its own sake.
- All animations respect the user's `prefers-reduced-motion` setting.
- Avoid abrupt, jarring, or flashing transitions — favor smooth easing and moderate durations.
- Loading states use calm skeleton loaders rather than aggressive spinners where possible.

<br/>

## 🧩 Core Components

| Component | Key behavior |
|---|---|
| **Buttons** | Primary, secondary, and destructive variants; destructive actions require confirmation |
| **Cards** | Used for dashboard summaries, journal entries, and community posts |
| **Modals** | Reserved for focused tasks (PIN entry, confirmations) — avoid modal overuse |
| **Forms** | Clear labels, inline validation, and non-alarming error messaging |
| **Navigation** | Persistent, predictable navigation that doesn't bury core features (journal, assessment, community) |
| **Notification badges** | Subtle, non-intrusive counts — avoid red "urgency" badges for non-critical updates |
| **Empty states** | Warm, encouraging messaging paired with a clear next action |
| **Skeleton loaders** | Used during data fetches to reduce perceived wait time |

<br/>

## 🗣️ Tone of Voice

Unwind's writing — button labels, empty states, error messages, and prompts — should be:

| Do | Avoid |
|---|---|
| Warm, plain language | Clinical or overly technical phrasing |
| Encouraging without being dismissive | Toxic positivity ("just think happy thoughts!") |
| Clear about what happened and what to do next | Vague or alarming error messages |
| Respectful of the user's emotional state | Playful/joking tone in sensitive flows (assessments, journaling) |

**Example — error message:**
- ❌ "Error 500: Request failed."
- ✅ "Something went wrong on our end. Your entry wasn't lost — please try saving again."

<br/>

## ♿ Accessibility Principles

- All interactive elements are reachable and operable via keyboard.
- Color contrast meets accessible standards in both light and dark themes.
- Every meaningful icon or image includes an appropriate text alternative.
- Motion-sensitive users are respected via `prefers-reduced-motion`.
- Form fields have visible, associated labels — not placeholder-only labeling.
- Focus states are clearly visible for keyboard navigation.

> See the [Roadmap](./README.md#-roadmap) for planned formal WCAG audit work.

<br/>

## 🌙 Dark Mode Guidelines

- Dark theme is a deliberate design, not an inverted light theme — contrast and warmth are recalibrated, not just flipped.
- Avoid pure black backgrounds; use deep, soft neutrals to reduce harsh contrast.
- Accent colors are adjusted for sufficient contrast against dark surfaces.
- Test all critical flows (assessment, journal, community) in both themes before shipping.

<br/>

## ✅ Design Review Checklist

Before merging a UI change, confirm:

- [ ] Consistent with existing color tokens and typography scale
- [ ] Tested in both light and dark themes
- [ ] Keyboard-navigable and screen-reader friendly
- [ ] Respects `prefers-reduced-motion`
- [ ] Copy reviewed for tone (warm, clear, non-clinical)
- [ ] Responsive across mobile, tablet, and desktop breakpoints
- [ ] No new visual pattern introduced without checking for an existing equivalent

<br/>

---

<div align="center">

### 🌿 Design that feels like exhaling.

For contribution guidelines on design work, see [CONTRIBUTING.md](./CONTRIBUTING.md#-design--ux-contributions).

</div>
