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
The homepage and search bar are still eliminated by default — the app queues the single best next video based on goals, time of day, and performance.

* **But:** a persistent, low-friction "not this" affordance always exists. A wrong pick with zero recourse breaks trust in the whole system; a wrong pick with a one-tap correction is a minor annoyance.
* Curation logic explicitly favors **spaced-repetition due items** over new material when a concept is close to being forgotten (see 3C).

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

### F. Onboarding Calibration *(new)*
The proactive engine needs a cold-start signal instead of guessing blind on day one.

* When a user starts a new topic, a short (2-minute) diagnostic — a handful of adaptive questions — seeds the knowledge graph with an initial estimate of what they already know.
* This lets curation (3B) skip material the user has already mastered instead of starting everyone at zero.

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

1. **Modify the Player:** Extend the existing Next.js app via the YouTube IFrame API to control playback and listen to timestamps.
2. **Approximate semantic segmentation cheaply:** Use YouTube's native chapter markers as a proxy for concept boundaries where available (avoids building embedding-based segmentation for the demo).
3. **Build the Quiz UI:** A glassmorphic overlay, plus — critically — the **wrong-answer remediation flow** (auto-rewind + hint + re-ask) built now, not deferred. This is the single highest-leverage UX element to validate early.
4. **Confidence tagging:** A simple "I know this" pre-quiz prompt, hardcoded logic to skip/flag accordingly.
5. **Mock the Brain:** Hardcode a question set (MCQ + one free-text) at chapter-marker timestamps for a demo video, proving the UX before wiring up dynamic LLM generation.
6. **The Zen Dashboard (v1 scope):** Local-storage-based tracking of Mastery Score, incremented on quiz pass, decremented/flagged on repeated failure — laying the groundwork for the full spaced-repetition scheduler in Phase 2.
7. **Flow Mode toggle:** Ship even in V1 — trivial to build, and removes the single biggest reason a tester would bounce off the demo.

**Explicitly deferred to Phase 2:** cross-session spaced repetition scheduling, embedding-based segmentation, content classifier, onboarding diagnostic, and the Live Sandbox.

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