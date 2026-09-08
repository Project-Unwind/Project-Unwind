# Unwind — User Testing Report

**Sources:** `Testing_Phase_2.xlsx` (technical/developer-style testers, n=15) and `Laymen_user_testing_responses.xlsx` (general/non-technical users, n=45)
**Period covered:** Aug 27, 2026 – Sep 4, 2026
**Product:** Unwind — mental wellness / journaling web app ([project-unwind-mu.vercel.app](https://project-unwind-mu.vercel.app/))

---

## 1. Executive Summary

Unwind was tested by two distinct groups over roughly one week:

- **15 technical testers** (Phase 2 group) — students/developers evaluating UI/UX, navigation, performance, auth, and error handling with a critical eye.
- **45 laymen testers** — general users with no technical brief, evaluating usability, trust, and everyday feel.

Across both groups, the app scores **consistently well (mostly 4/5 or "Excellent/Good")** on appearance, ease of use, and per-feature functionality. No blocking or severe bugs were reported by any tester. Issues found were **minor, UX-level, and reproducible** rather than crash-level defects. The **AI Companion** feature draws the most mixed feedback (both the most-loved feature and the most-flagged "needs improvement" feature), and the **Dashboard's mood-selector** and **Journal draft-saving** each have a concrete reported defect.

**Overall verdict:** 10/15 technical testers said Unwind is "Definitely" a strong student project, 4/15 said "Mostly Yes," and 1/15 gave harshly negative feedback ("Vibe coded slop"). Among laymen, 20/45 said "Definitely" would use again, 17/45 "Probably" — a strong net-positive reception.

---

## 2. Phase 2 (Technical Tester) Results — n=15

### 2.1 Ratings summary (scale of 1–5 unless noted)

| Metric | Average | Range |
|---|---|---|
| Overall UI/UX quality | 4.27 | 1–5 |
| Navigation & routing | 4.33 | 3–5 |
| Responsive design | 4.47 | 3–5 |
| Application performance | 4.67 | 3–5 |
| Authentication/session experience | 4.67 | 3–5 |
| Error handling / input validation | 4.33 | 3–5 |
| Stability | 4.53 | 3–5 |
| Production-readiness | 4.07 | 2–5 |
| Overall technical quality (out of 7) | 6.2 | 4–7 |

*Note: one tester gave a "1" for Overall UI/UX quality alongside an otherwise-hostile response ("Vibe coded slop. Do better!") — this is a clear outlier vs. the rest of the group and should be weighed accordingly, though the underlying critique (generic, AI-generated-looking UI; theoretical security concerns) is worth reviewing.*

### 2.2 Feature-by-feature functionality ratings

| Feature | Excellent | Good | Fair | Poor | Didn't Test |
|---|---|---|---|---|---|
| Authentication | 11 | 2 | 2 | 0 | 0 |
| Dashboard | 7 | 5 | 2 | 1 | 0 |
| AI Companion | 9 | 4 | 1 | 0 | 1 |
| Journal | 10 | 3 | 2 | 0 | 0 |
| Community | 9 | 4 | 1 | 1 | 0 |
| Community Chat | 8 | 5 | 2 | 0 | 0 |

Authentication is the strongest-rated feature; Dashboard has the only two sub-par ("Fair"/"Poor") clusters worth investigating alongside Community.

### 2.3 Reported issues

- **Issue frequency:** 10/15 reported "No issues," 5/15 reported "Minor issues." Zero testers reported major/blocking issues.
- **Issue location:** Login/Register (3), Dashboard (2), My Profile (1), remainder "No Issues."
- **Issue types mentioned:** Privacy/Security concern (1), UI/Layout + Navigation + Form Validation (1 combined), Navigation/Authentication (1 combined), UI/Layout (1), Responsive Design (1), Error Handling (1).

**Specific defects reported (verbatim paraphrase):**

1. **[Dashboard] Mood selector unresponsive** — clicking a mood on the dashboard does not register/select it (Android/Chrome, mobile).
2. **[Profile / Date of Birth picker] No fast year/month jump** — the date-of-birth picker opens on the current month and must be paged backward one month at a time to reach older dates (e.g., birth year 2007); a direct year/month selector is requested (Windows/Chrome, laptop).
3. **[Login] Hover/error-message visibility** — hover effect on the login checkbox is confusing, and login error messages are described as easy to miss (Windows/Chrome, laptop).
4. **[Client-side rendering / SEO]** — one tester flagged that the site serves an empty root `<div>` with all rendering happening client-side, meaning slow/blocked JS leaves users on a blank screen, and that this also breaks SEO indexing and social link previews (Slack/Twitter/WhatsApp). Suggested fix: fallback content and clear loading/error states.
5. **[Security]** One tester (the "1/5 UI" outlier) raised generic concerns about XSS/injection resistance and described the UI as visibly AI-generated/generic in appearance, without pointing to a specific reproducible exploit.

### 2.4 Privacy/security perception

11/15 said no privacy/security concern noticed; 4/15 said "Maybe/Unsure" (no one flagged a definite concern).

### 2.5 What testers said was implemented well

- Frontend–backend/API integration and end-to-end flow; modular components; Vercel deployment ease.
- OTP/authentication flow described as fast and smooth ("no delay, no lag").
- Streak system for consistency tracking.
- Email verification and PDF export/download features called out as standing out versus typical student/pre-production projects.
- Admin panel called out as a standout feature.

### 2.6 Top improvement requests

- Add loading/fallback states for client-side rendering (SEO + perceived reliability).
- Faster date-of-birth entry (direct year/month picker).
- Clearer login error messaging; fix confusing hover state.
- Longer-term/monetization idea: introduce optional subscription tiers as the platform scales.
- Add more variation to mood-lifting options (e.g., theme songs/sounds tied to mood).
- One tester wants more visual distinctiveness in UI (currently reads as generic/AI-templated to a design-critical eye).

### 2.7 Device/browser coverage

- Devices: Mobile (7), Laptop (7), Desktop (1)
- OS: Windows (8), Android (5), iOS (1)
- Browsers: Chrome (12), Edge (1), Opera GX (1), Brave (1)

*Coverage gap: iOS and non-Chrome browsers are thin — only 1 iOS data point, and only 3 non-Chrome browser sessions. Safari/iOS-specific issues are effectively untested here.*

---

## 3. Laymen Tester Results — n=45

### 3.1 Ratings summary (scale of 1–5 unless noted)

| Metric | Average | Range | n |
|---|---|---|---|
| Overall appearance | 4.42 | 1–5 | 45 |
| Ease of use | 4.36 | 1–5 | 45 |
| Ease of finding features | 4.31 | 1–5 | 45 |
| Professionalism | 4.29 | 1–5 | 45 |
| Comfort using it | 4.29 | 1–5 | 45 |
| Trustworthiness | 4.30 | 1–5 | 44 |
| Overall rating (out of 7) | 5.82 | 1–7 | 45 |

*One respondent gave all-1s and an "Overall: 1" score while simultaneously writing "Everything was perfect" in the free-text field — this response is internally contradictory (likely a misclick/misunderstanding of the scale) and should probably be excluded or flagged when computing clean averages.*

### 3.2 Feature-by-feature ratings

| Feature | Excellent | Good | Fair | Poor | Didn't Use |
|---|---|---|---|---|---|
| Dashboard | 22 | 16 | 6 | 0 | 1 |
| AI Companion | 21 | 12 | 6 | 2 | 4 |
| Journal | 20 | 19 | 3 | 0 | 3 |
| Community | 18 | 15 | 3 | 1 | 8 |
| Chats | 18 | 13 | 6 | 0 | 8 |

Journal has the tightest, most consistently positive distribution (no "Poor," few "Fair"). AI Companion has the widest spread, including the only two "Poor" alongside the most "Excellent" — a genuinely polarizing feature. Community and Chats have the highest "Didn't use" counts, suggesting either lower discoverability or lower initial appeal for social features.

### 3.3 Access & problems

- **Access success:** 40/45 "Yes," 2 "Yes, Partially," 2 "Partially," 1 "Yes, No" — effectively everyone could get in and explore.
- **Problems encountered:** 39/45 "No Problems," 6/45 "Minor Problem." No major/blocking problems reported.
- **Confusion:** 38/45 "No," 4 "A little," 3 "No, A little" — confusion is rare and mild when present.

**Specific problems reported (verbatim paraphrase):**

1. **Performance/lag** — one user reported the site being "too laggy," waiting 2–3 minutes to access a feature; separately requested an index/nav shortcut and fewer animations to reduce lag.
2. **AI Companion content formatting** — content described as presented in a "miss-managed format," making it unclear what to focus on.
3. **Journal draft loss** — a user typed a title/content, saved as draft, but the draft did not appear in the drafts list; a red error message appeared.
4. **Unskippable intro video** — a user called the intro/link-preview experience "pretty useless" when opening via a shared link; another explicitly disliked the unskippable video shown every time the site opens.
5. **Auto-refresh** — one user noted the app "refreshes after some time" unexpectedly.
6. **Feature discoverability** — "finding features is [slightly] difficult" for at least one user; another suggested adding an index/nav aid.

### 3.4 Feature needing most improvement (of those who answered, n=20)

| Feature | Mentions |
|---|---|
| AI Companion | 8 |
| Dashboard | 5 |
| Community | 4 |
| Journal | 3 |

AI Companion is the single most-requested area for improvement — consistent with it also having the widest rating spread above.

### 3.5 "Would you use again?"

| Response | Count |
|---|---|
| Definitely | 20 |
| Probably | 17 |
| Maybe | 5 |
| Probably Not | 2 |
| (blank) | 1 |

~82% land in "Definitely" or "Probably" — strong retention signal for a pre-release/student project.

### 3.6 What users liked most (representative themes)

- Sense of personal connection / "a space where you can express yourself" rather than feeling clinical.
- Ease of use and pleasing color palette/aesthetics.
- Journal and "wellness toolkit" called out as differentiated vs. typical wellness apps.
- Dashboard design praised as "beautifully designed."
- Feeling of privacy/comfort ("I got my space").

### 3.7 Requested changes (representative themes)

- Reduce/remove the unskippable intro video.
- Add multi-language support/accessibility.
- Allow trying some features without requiring login first ("use it before you trust it").
- Improve AI Companion formatting/clarity.
- One user raised an **ethical concern**: the AI Companion could undermine "human-to-human connection" and empathy expected in mental-health contexts — worth a product/ethics review, not just a UX fix.

### 3.8 Device/browser coverage

- Devices: Mobile (37), Laptop (6), Desktop (1), unspecified (1) — testing is heavily mobile-weighted.
- Browsers: Chrome (39), Brave (2), Microsoft Edge (1), "App" (1), "Instagram" in-app browser (1), unspecified (1).

*Coverage gap: almost all testing happened on Chrome/mobile. Desktop, Safari, and Firefox are essentially unvalidated by this group.*

---

## 4. Cross-Cutting Themes (Both Groups)

1. **No crash-level or data-loss-at-scale bugs** were reported by either group — the app is functionally stable for normal use paths.
2. **AI Companion is the most polarizing feature** in both datasets: praised as a standout by many, but also the top pick for "needs most improvement" and the subject of a genuine ethical objection from a layman tester.
3. **Onboarding/first-load friction** shows up twice from different angles: technical testers flagged the blank client-side-rendered shell (SEO/perceived reliability risk), while laymen flagged the unskippable intro video (immediate UX friction). Both point to the *first few seconds* of the experience as the highest-leverage place to improve.
4. **Dashboard mood/interaction bugs**: technical testers found the mood selector literally non-functional in one case; this should be treated as a confirmed, reproducible bug, not just a rating dip.
5. **Journal reliability**: one technical "Fair" rating and one explicit layman bug report (draft not saving) both point at the Journal draft-save path as worth a dedicated regression test.
6. **Testing coverage skews toward Chrome + Android/Windows + mobile.** Before release, dedicated passes on Safari/iOS and desktop/Firefox are recommended, since current data can't speak to those environments.
7. **Sentiment is strongly positive overall** — both groups' median ratings sit in "Good–Excellent" territory, and "would recommend/use again" numbers are high, with the negative outliers being few, identifiable, and largely UX/opinion-based rather than functional failures.

---

## 5. Recommended Priorities Before Release

**High priority (confirmed functional bugs):**
- Fix Dashboard mood-selector click/registration bug.
- Investigate and fix Journal draft-save/retrieval failure.
- Add a fast year/month jump to the date-of-birth picker.

**Medium priority (first-impression / trust):**
- Add a skip option (or remove) the intro video.
- Add loading/fallback states for the client-side-rendered shell; consider basic SSR/meta tags for SEO and link previews.
- Improve login error-message visibility and hover-state clarity.
- Allow limited feature preview without requiring login.

**Medium priority (AI Companion):**
- Improve AI Companion response formatting/readability (raised independently by a layman tester).
- Product review of AI Companion's role/positioning given the empathy/ethics concern raised — consider clearer framing (e.g., "supplemental tool, not a therapist") if not already present.

**Lower priority / polish:**
- Address perceived performance lag and animation-heavy feel for lower-end devices.
- Increase visual distinctiveness of UI to reduce the "generic/AI-templated" impression noted by one design-critical tester.
- Consider multi-language support as a longer-term accessibility improvement.

**Testing gaps to close before release:**
- Run a dedicated Safari/iOS pass (only 1 iOS data point across both surveys).
- Run a dedicated desktop + non-Chrome browser pass (Firefox untested; Edge/Brave/Opera only 1 each).

---

*Report generated from raw survey exports; all counts and averages computed directly from the two source spreadsheets. Free-text quotes have been paraphrased/summarized.*
