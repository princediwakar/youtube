# Product Requirements Document: The "ZenTube" Engine (v2 — 10x)

## 1. Executive Summary
ZenTube transforms passive video consumption into a **Guided Mastery Engine**. It doesn't just interrupt viewers with quizzes — it diagnoses what they know, adapts content and difficulty in real time, and compounds retention across sessions through spaced repetition. Where v1 optimized for "verified learning in a single video," v2 optimizes for **durable, cross-session mastery**, while fixing the core UX risk of v1: a rigid quiz gate that could feel punitive rather than helpful.

The product thesis stays the same — retrieval practice beats passive rewatching — but the execution now respects user agency, varies by content type, and gets smarter every session instead of resetting each time.

---

## 2. The Core Paradigm Shift (Strategy)

* **From Reactive to Proactive:** The app anticipates what a user needs to learn next, based on goals, calendar, and a persistent knowledge graph — not just the current video.
* **From Passive to Interactive:** Users actively retrieve information instead of re-reading/re-watching it. But retrieval is **coached, not punitive** — wrong answers lead to a short remediation loop, never a dead end.
* **From Watch Time to Mastery:** Metrics track comprehension and retention decay over time, not screen-on time.
* **From Rigid to Adaptive:** Not all content deserves interception. The engine classifies content and lets users opt into "Flow Mode" for casual watching — preserving trust in the system for when it matters.
* **From Single-Session to Compounding:** Mastery persists and decays realistically. The engine re-tests old concepts before introducing new ones, turning every session into spaced repetition, not a one-off quiz.

---

## 3. Core Features

### A. The Adaptive Interception Engine (Coached Quizzing, Not Hard Gating)
The player monitors playback and intervenes at conceptual boundaries — but the interaction model is fundamentally softer and smarter than a hard stop.

* **Semantic segmentation, not fixed timestamps.** Use existing YouTube chapter markers where available; otherwise segment the transcript by topic shift (embedding-based boundary detection) so quizzes fire at real conceptual transitions, not arbitrary times.
* **Graceful failure loop.** A wrong answer triggers a ~15-second auto-rewind to the relevant segment plus a one-line hint, then a re-ask (an easier variant if the user fails twice). No permanent block — friction, not a wall.
* **Confidence-based gating.** Before a quiz fires, the user can tag "I already know this." Correct → future quizzes on that concept are skipped. Incorrect despite confidence → this is the single highest-value data point for the mastery graph (overconfidence signal).
* **Question type varies by content.** MCQ for factual recall, LLM-graded free-text ("explain this in your own words," graded semantically, not exact-match) for conceptual material, fill-in-the-blank/predict-the-output for code walkthroughs.
* **Flow Mode toggle.** One tap disables interception entirely for a session. Preserves user agency and prevents the app from feeling authoritarian — critical for retention.

### B. Proactive Curation with an Escape Hatch
The homepage and endless video-search bar are eliminated. The app queues the single best next video based on goals, time of day, and performance.

* **But:** a persistent, low-friction "not this" affordance always exists. A wrong pick with zero recourse breaks trust in the whole system; a wrong pick with a one-tap correction is a minor annoyance.
* Curation logic explicitly favors **spaced-repetition due items** over new material when a concept is close to being forgotten (see 3C), interleaved across all of a user's active paths (see 3F).
* **Distinction that matters:** there is no persistent bar for searching *videos* — that's the browsing habit this product is designed to kill. There *is* a way to search/type to declare a *learning path* (3F), but that only ever returns a topic to commit to, never a scrollable feed of videos to pick from. Naming a goal is not the same interaction as browsing, and the product needs to keep that line sharp everywhere in the UI.

### C. Cross-Session Mastery Graph + Spaced Repetition (the compounding engine)
This is the feature that turns ZenTube from "a quiz app" into something that measurably outperforms normal learning.

* Every mastered concept is scheduled for review using a spaced-repetition algorithm (SM-2 or FSRS-style forgetting curve), not just tracked as a static score.
* Each session opens with a **30–60 second recall check** on the most at-risk concept from prior sessions before any new content is queued.
* The Zen Dashboard visualizes: **Quiz Accuracy**, **Concepts Mastered**, **Concepts Decaying** (due for review soon), and **Focus Time** — giving the proactive engine (3B) the signal it needs to fill real gaps instead of guessing.
* Overconfidence flags from 3A feed directly into review priority — concepts a user thought they knew but didn't get reviewed sooner and more often.

### D. The Live Sandbox — Active Code Retrieval (upgraded from passive playground)
For technical content, instead of just handing the user a working copy of the creator's code:

* The AI auto-generates a **deliberately broken or incomplete version** of the code (missing function, off-by-one bug, blanked-out key line) tied to the concept just taught.
* The user must fix or complete it before the video advances — applying the same retrieval-practice principle to code as to conceptual quizzes, rather than passive "here's a sandbox, poke around."
* Passing criteria: automated test run against expected output, not just "code compiles."

### E. Content Classification Layer *(new)*
Not everything on YouTube is a lecture, and the engine needs to know the difference before it intervenes.

* A lightweight classifier (title + transcript + channel metadata) tags incoming content as **instructional**, **entertainment/vlog**, or **ambiguous**.
* Interception and quizzing apply automatically only to instructional content; ambiguous content defaults to Flow Mode with a one-tap "actually, quiz me on this" override.
* This prevents the single biggest early churn risk: the engine firing quizzes on a video the user just wanted to relax with.

### F. Onboarding: Path Selection & Calibration *(revised)*
The proactive engine needs a cold-start signal instead of guessing blind on day one — and this is also the real answer to "why does the app default to coding content?" It doesn't default to anything; it asks, precisely, then gets out of the way.

**The Path Selection screen** is a full-screen moment shown on first launch, and again whenever a user deliberately chooses to start a new concurrent path. It offers two entry points side by side, because different people arrive with different amounts of clarity:

* **Name it directly:** a type-ahead field for someone who already knows what they want — "agentic workflows," "product management," "conversational Spanish." This is a *search-to-declare-a-goal* interaction, not a *search-to-browse-videos* interaction: typing here returns a single topic to commit to, never a results feed to scroll. It's the input curation needs (3B), not a door back into passive browsing.
* **Browse to discover:** for someone who doesn't have a name for what they want yet, a full-screen grid of auto-populated topic cards, grouped by broad domain (e.g., Business & Product, Software & AI, Creative Skills, Languages, Health & Fitness). This solves the blank-canvas problem — most people can recognize "Product Management" or "Agentic Workflows" as a card faster than they can type it into an empty box.

**Both paths converge on the same next step:** a short (~2-minute) adaptive diagnostic in the chosen domain, seeding the knowledge graph with an initial estimate of what the user already knows, so curation (3B) can skip material they've already mastered instead of starting everyone at zero.

**Topic taxonomy (what populates the grid):** a maintained set of curated seed categories, expanded and kept fresh by surfacing genuinely trending/popular instructional queries and clustering them into named topics. This taxonomy is a real system to design (not just a static list) — it's what keeps the grid from going stale or feeling arbitrary.

**Multi-path support:** a user isn't limited to one goal. Someone learning both product management and agentic workflows has two active paths, each with its own knowledge graph and spaced-repetition schedule. Curation (3B) interleaves spaced-repetition-due items across *all* active paths by urgency, not just one at a time — with a lightweight option to set a "focus path" for a given session if the user wants to go deep on one thing today.

**Re-entry, not a persistent bar:** Path Selection is triggered by an explicit, infrequent action — "Start a new path" — not a nav-bar element visible every session. After a path is chosen, the app returns to pure proactive queuing (3B) for that path. This keeps the discovery moment intentional and occasional, rather than turning into a browsing habit.

| | Video search (rejected) | Path Selection: type-ahead or grid (adopted) |
|---|---|---|
| Persists as a visible control? | Yes — always available, invites browsing | No — surfaced only at first run or "start a new path" |
| What it returns | A feed of videos to scroll and pick from | One committed topic, feeding straight into calibration |
| Undermines proactive curation? | Yes — reintroduces passive browsing as a habit | No — it's the missing input curation needs, not an escape hatch from it |

### G. Theme System & Progress-Gated Unlocks *(new, post-V1)*
Personalization increases attachment — someone who chose their visual identity feels more ownership than someone stuck with whatever shipped. But this needs scoping carefully so it doesn't bury the product's most distinctive moment or turn mastery into a gamified skin-collecting loop.

* **The underlying mechanism is constant across every theme.** Mastery rendered as a living, decaying visual signal (glowing when strong, visibly fading when a concept hasn't been reviewed in a while — see 3C) is core UI language, not a "Star Chart-only" flourish. Every theme reinterprets *how that looks* (stars dimming, embers cooling, ink fading on a page), but none of them are allowed to drop it — that's what keeps it from becoming decorative.
* **Themes unlock through genuine progress, not a settings menu.** Rather than a flat picker available from day one, new themes unlock at real milestones — e.g., 50 concepts mastered, or a 30-day streak of honest spaced-repetition reviews. This keeps theme choice feeling like the app celebrating real progress, consistent with the "coached, not punitive" tone in Section 4, rather than a cosmetic reward loop bolted on to drive engagement for its own sake.
* **Scope:** explicitly deferred past V1. V1 ships a single theme (Star Chart) and proves the core interception/quiz UX works before spending effort on reskinning it. Multiple themes are a strong Phase 2+ investment once the base experience is validated.

---

## 4. Failure-State UX Principles *(new)*
Since the product's core mechanic is repeatedly testing the user, the tone of failure feedback is a first-class design concern, not an afterthought left to default LLM copy.

* Feedback frames wrong answers as **signal for the system, not a judgment of the user** — e.g., "Let's revisit this" rather than "Incorrect."
* No streak-breaking shame mechanics (no red X animations, no punitive scorekeeping visible to the user in the moment).
* Progress framing emphasizes trend ("your retention on this topic is improving") over binary pass/fail.
* The goal: the product should feel like a good tutor, not an exam proctor.

---

## 5. Phase 1 Implementation Strategy
V1 focuses on proving the **Adaptive Interception Engine** end-to-end, including the parts that make it feel coached rather than punitive — since that UX risk is the one most likely to sink the product if left to Phase 2.

1. **Path Selection screen:** Before anything else loads, show a full-screen choice — a type-ahead field to name a goal directly, plus a hardcoded grid of ~6–8 topic cards spanning a few distinct domains (e.g., Product Management, Agentic Workflows, Coding, Cooking, History). This replaces the current behavior of silently defaulting to a JavaScript video, and proves the *interaction pattern* (name it or browse it) even though the full dynamic taxonomy engine is deferred.
2. **Modify the Player:** Extend the existing Next.js app via the YouTube IFrame API to control playback and listen to timestamps.
3. **Approximate semantic segmentation cheaply:** Use YouTube's native chapter markers as a proxy for concept boundaries where available (avoids building embedding-based segmentation for the demo).
4. **Build the Quiz UI:** A glassmorphic overlay, plus — critically — the **wrong-answer remediation flow** (auto-rewind + hint + re-ask) built now, not deferred. This is the single highest-leverage UX element to validate early.
5. **Confidence tagging:** A simple "I know this" pre-quiz prompt, hardcoded logic to skip/flag accordingly.
6. **Mock the Brain, per domain:** Hardcode a question set (MCQ + one free-text) for at least two domains selectable from the grid in step 1 — mapped to chapter-marker timestamps. Which set loads is driven by the path chosen, proving the mechanism generalizes beyond code.
7. **The Zen Dashboard (v1 scope):** Local-storage-based tracking of Mastery Score, incremented on quiz pass, decremented/flagged on repeated failure — laying the groundwork for the full spaced-repetition scheduler in Phase 2.
8. **Flow Mode toggle:** Ship even in V1 — trivial to build, and removes the single biggest reason a tester would bounce off the demo.

**Explicitly deferred to Phase 2:** cross-session spaced repetition scheduling, embedding-based segmentation, the *adaptive* diagnostic (V1 ships only path selection, not the full 2-minute calibration quiz), the dynamic topic-taxonomy engine behind the grid, multi-path interleaving in curation, content classifier, the theme system (3G), and the Live Sandbox.

---

## 6. Success Metrics
* **Quiz completion rate** (did users engage vs. abandon session on first gate)
* **Remediation recovery rate** (% who pass after the rewind+hint loop vs. give up)
* **Flow Mode usage rate** (signal on whether interception is felt as valuable or intrusive)
* **7-day retention of concepts** (via a follow-up recall check) as the core "did this actually work" metric, distinct from vanity engagement metrics like session length.

## 7. Open Risks
* Hard-gating perception risk is mitigated but not eliminated — needs real user testing, not just design intent.
* LLM-graded free-text answers introduce grading-consistency risk; needs a rubric and confidence threshold before trusting it over MCQ.
* Content classifier false negatives (quizzing on content that shouldn't be quizzed) are the most likely source of early churn — worth over-indexing on conservative classification in V1.