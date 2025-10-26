# Tasks: Multi-Touch Finger Selection & Dual Mode Toggle

Updated to reflect current implementation state. ✅ done | ⏳ pending | 💤 intentionally skipped | ✖ replaced/removed.

**Input**: Design documents from `/specs/002-finger-selection/`  
**Prerequisites**: plan.md (required), spec.md (required for user stories)

**Tests**: Manual; fairness helpers in console (`_fairnessSample`, `_fairnessStats`).

**Organization**: User stories & phases map to incremental demo value.

## Format: `[ID] [P?] [Story] Description (notes)`

---
## Phase 1: Setup (Shared Infrastructure)
**Purpose**: Prepare existing static app for dual mode; no functionality yet.

- [x] T001 Add mode toggle container markup placeholder to `index.html` (above existing generator section)
- [x] T002 Add finger selection section placeholder (hidden by default) in `index.html`
- [x] T003 Create structural CSS classes for `.mode-toggle`, `.finger-mode`, `.numeric-mode` in `styles.css`
- [x] T004 Add ARIA live region reuse note (no change) comment in `index.html`
- [x] T005 Update README with dual-mode overview (root `README.md`)

---
## Phase 2: Foundational (Blocking Prerequisites)
**Purpose**: Core scaffolding before finger logic.

- ✅ T006 Initialize mode state object & minimal API in `app.js`
- ✅ T007 Mode toggle event handling (numeric ↔ finger) in `app.js`
- ✅ T008 [P] Hidden/visible mode transition utilities in `styles.css`
- ✅ T009 Guard mode switch during selection in `app.js`
- ✅ T010 Mode change announcements centralize via `Announce.mode()`

**Checkpoint**: Mode switching skeleton works (no finger logic yet); numeric mode unaffected.

---
## Phase 3: User Story 1 - Touch Point Registration and Validation (Priority: P1) 🎯 MVP Part A
**Goal**: Users see markers appear/disappear as they place/remove fingers; positions update.
**Independent Test**: Place 2–6 fingers; markers appear with stable identifiers; removal clears marker instantly.

### Implementation
- ✅ T011 [US1] Finger capture surface container in `index.html`
- ✅ T012 [US1] Pointer down → marker creation in `app.js`
- ✅ T013 [US1] Pointer up/cancel → marker removal in `app.js`
- ✅ T014 [P] Active touches Map maintained in `app.js`
- ✅ T015 [P] Pointer move batching via rAF in `app.js`
- ✅ T016 [US1] Marker base styles (size, color) in `styles.css`
- ✅ T017 [US1] Removed visible numeric label; using color + aria-label
- ✖ T018 [US1] Active finger count UI badge (removed / not desired)
- ✅ T019 [US1] Max touches enforcement (dynamic by hardware ≤6)
- ✅ T020 [US1] Announce first finger & count changes

**Checkpoint**: Finger placement/removal functional; independent demo possible.

---
## Phase 4: User Story 2 - Basic Random Finger Selection (Priority: P1) 🎯 MVP Part B
**Goal**: Randomly select one active finger; highlight winner.
**Independent Test**: With ≥2 active markers press Select; one winner highlighted; fairness observable over repeated runs.

### Implementation
- ✖ T021 [US2] Manual Select button (removed; auto-select implemented Phase Enhancement)
- ✅ T022 [US2] Secure random winner pick using `crypto.getRandomValues`
- ✅ T023 [P] Fallback to `Math.random` warning
- ✅ T024 [US2] Winner revealed (transient pulse replaces persistent highlight)
- ✅ T025 [US2] Winner announcement
- ✅ T026 [US2] Selection lock until reset
- ✅ T027 [P] Console fairness sampler helper

**Checkpoint**: Random selection demo complete; combined with US1 forms full MVP.

---
## Phase 5: User Story 3 - Visual Feedback During Selection (Priority: P2)
**Goal**: Provide anticipation animation and clear highlight styling persists after selection.
**Independent Test**: Trigger selection → animation plays → winner revealed → highlight persists until reset.

### Implementation
- ✅ T028 [US3] Pre-selection animation cycle logic in `app.js`
- ✅ T029 [US3] Animation CSS classes & transitions in `styles.css`
- ✅ T030 [P] Reduced motion respected (skip animations) + static fallback indicator
- 💤 T031 [US3] Persistent winner highlight (skipped by preference)
- 💤 T032 [US3] Distinct winner styling glow (skipped; uniform look)
- ✅ T033 [P] Sound trigger placeholder comment added in `app.js`

**Checkpoint**: Enhanced UX layer independently testable (can layer after MVP).

---
## Phase 6: User Story 4 - Reset and Replay (Priority: P2)
**Goal**: Clear state & allow new round; block mid-animation mode switch per spec.
**Independent Test**: After selection → press Reset → markers cleared; selection allowed again; toggle enabled.

### Implementation
 - ✅ T034 [US4] Reset button (delayed reveal post-winner per refinement)
- ✅ T035 [US4] Reset logic clearing state & timers
- ✅ T036 [US4] Re-enable selection & mode toggle post-reset
- ✅ T037 [US4] Focus moves to capture surface after reset
- ✅ T038 [P] Reset announcement

**Checkpoint**: Replay flow functional; independent demonstration possible with prior stories stubbed.

---
## Phase 7: Polish & Cross-Cutting
**Purpose**: Accessibility, performance, cohesion, and fairness extras.

 - ✖ T039 Mode-specific instruction text (added then removed for space efficiency)
- ✅ T040 Numeric mode regression review (no breakage)
- ✅ T041 Palm-size heuristic (ignore large contacts)
- ✅ T042 [P] Fairness distribution helper (100-run stats)
- ✅ T043 Consolidated announce messages utility
- ✅ T044 [P] Persist last chosen mode (`localStorage`)
- ✅ T045 Contrast audit adjustments (stronger border, fallback outline)
- ✅ T046 Reduced motion fallback style (static indicator class)
- ✅ T047 Removed temporary console logs & warnings
- ✅ T048 README finger mode instructions update
- ✅ T049 [P] Fairness & accessibility notes docs created
- ✅ T050 Sign-off checklist / verification notes
- ✅ T051 [P] iOS gesture suppression (touch-action + gesture events)
---
## Enhancement: Auto Selection & Winner Persistence
 - ✅ T052 Auto-select after 2s inactivity (≥2 fingers)
 - ✅ T053 Persist winner marker; remove others
 - ✅ T054 Removed manual Select button (auto mode only)
 - ✅ T055 Ignore new touches post-selection; winner persists
 - ✅ T056 Enlarged active markers to 120px
 - ✅ T057 Removed distinct winner highlight (uniform styling)

---
## Dependencies & Execution Order
**Phase Dependencies**:
- Setup → Foundational → User Stories (US1, US2 can follow foundational; US3 depends on US2; US4 depends on US2) → Polish.

**User Story Dependencies**:
- US1 (Touch Registration) precedes US2 (Random Selection).
- US2 required before US3 (Animation) and US4 (Reset).
- US3 and US4 can proceed in parallel after US2.

**Within Story**:
- Markup/CSS before JS behavior; selection lock after winner highlight; reset reinstates initial state.

## Parallel Execution Examples
- T012, T013, T016, T017 can run in parallel (distinct files) once T011 scaffold present.
- T022, T024, T025 can run in parallel after T021 button markup exists.
- T028 animation logic & T032 winner styling can be parallel after base selection (T024) done.
- Polish tasks marked [P] are safe to parallelize late phase.

## Implementation Strategy
1. Deliver MVP: Complete Phases 1–4 (through T027) for functional selection.
2. Add Reset (Phase 6) for full replay UX.
3. Add Animation (Phase 5) if prioritizing engagement next.
4. Perform Polish & fairness instrumentation last.

## Task Counts
- Setup: 5
- Foundational: 5
- US1: 10
- US2: 7
- US3: 6
- US4: 5
- Polish: 12
Total: 50 (several replaced/removed tasks annotated)

## MVP Scope Recommendation
Complete through T027 (US2 winner selection) to deliver core value; optionally include Reset (T034–T038) for smoother demos.

## Format Validation
All tasks follow: `- [ ] T### [P]? [USn]? Description with file path`.

