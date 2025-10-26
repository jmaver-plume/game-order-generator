# Tasks: Multi-Touch Finger Selection & Dual Mode Toggle

**Input**: Design documents from `/specs/002-finger-selection/`  
**Prerequisites**: plan.md (required), spec.md (required for user stories)

**Tests**: No formal automated test suite mandated; randomness / fairness and performance checks are manual or optional dev scripts.

**Organization**: Tasks grouped by user story to enable independent implementation and testing. Each user story yields a demonstrable increment.

## Format: `[ID] [P?] [Story] Description`

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
**Purpose**: Core scaffolding required before any user story work.
**⚠️ CRITICAL**: Must finish before user stories start.

- [ ] T006 Initialize mode state object & export minimal API in `app.js`
- [ ] T007 Implement mode toggle event handling (numeric ↔ finger) in `app.js`
- [ ] T008 [P] Add CSS utility classes for hidden/visible mode transitions in `styles.css`
- [ ] T009 Guard mode switch during selection (state flag placeholder) in `app.js`
- [ ] T010 Instrument announce() for mode change messaging in `app.js`
- [x] T006 Initialize mode state object & export minimal API in `app.js`
- [x] T007 Implement mode toggle event handling (numeric ↔ finger) in `app.js`
- [x] T008 [P] Add CSS utility classes for hidden/visible mode transitions in `styles.css`
- [x] T009 Guard mode switch during selection (state flag placeholder) in `app.js`
- [x] T010 Instrument announce() for mode change messaging in `app.js`

**Checkpoint**: Mode switching skeleton works (no finger logic yet); numeric mode unaffected.

---
## Phase 3: User Story 1 - Touch Point Registration and Validation (Priority: P1) 🎯 MVP Part A
**Goal**: Users see markers appear/disappear as they place/remove fingers; positions update.
**Independent Test**: Place 2–6 fingers; markers appear with stable identifiers; removal clears marker instantly.

### Implementation
- [ ] T011 [US1] Add finger capture surface container (absolute layer) to `index.html`
- [ ] T012 [US1] Implement pointer down handler → create marker element in `app.js`
- [ ] T013 [US1] Implement pointer up/cancel handler → remove marker element in `app.js`
- [x] T011 [US1] Add finger capture surface container (absolute layer) to `index.html`
- [x] T012 [US1] Implement pointer down handler → create marker element in `app.js`
- [x] T013 [US1] Implement pointer up/cancel handler → remove marker element in `app.js`
- [ ] T014 [P] [US1] Maintain active touches map (pointerId → metadata) in `app.js`
- [ ] T015 [P] [US1] Implement pointer move batching (requestAnimationFrame) for position updates in `app.js`
- [ ] T016 [US1] Add marker base styles (size, color) in `styles.css`
- [x] T016 [US1] Add marker base styles (size, color) in `styles.css`
- [x] T017 [US1] (UPDATED) Remove visible numeric label; rely on color differentiation & aria-label for accessibility in `app.js`
- [ ] T018 [US1] Display active finger count UI element in `index.html`
- [ ] T019 [US1] Enforce max 6 touches (ignore additional) in `app.js`
- [ ] T020 [US1] Announce first finger detected & total count changes via announce() in `app.js`

**Checkpoint**: Finger placement/removal functional; independent demo possible.

---
## Phase 4: User Story 2 - Basic Random Finger Selection (Priority: P1) 🎯 MVP Part B
**Goal**: Randomly select one active finger; highlight winner.
**Independent Test**: With ≥2 active markers press Select; one winner highlighted; fairness observable over repeated runs.

### Implementation
- [x] T021 [US2] Add Select button (disabled <2 touches) to finger section in `index.html`
- [x] T022 [US2] Implement secure random winner pick using `crypto.getRandomValues` in `app.js`
- [x] T023 [P] [US2] Fallback to `Math.random` with console warning if crypto unavailable in `app.js`
- [x] T024 [US2] Highlight winner marker (distinct CSS class) in `styles.css`
- [x] T025 [US2] Announce winner via live region in `app.js`
- [x] T026 [US2] Lock selection state (prevent re-select) until reset in `app.js`
- [x] T027 [P] [US2] Console fairness sampler (30 selections distribution) function in `app.js`

**Checkpoint**: Random selection demo complete; combined with US1 forms full MVP.

---
## Phase 5: User Story 3 - Visual Feedback During Selection (Priority: P2)
**Goal**: Provide anticipation animation and clear highlight styling persists after selection.
**Independent Test**: Trigger selection → animation plays → winner revealed → highlight persists until reset.

### Implementation
- [ ] T028 [US3] Add pre-selection animation sequence (cycle/pulse markers) in `app.js`
- [ ] T029 [US3] Add animation CSS classes & transitions in `styles.css`
- [ ] T030 [P] [US3] Respect reduced motion preference (skip animation) in `app.js`
- [ ] T031 [US3] Persist winner highlight until reset (no flicker) in `app.js`
- [ ] T032 [US3] Add distinct winner styling (glow/border) in `styles.css`
- [ ] T033 [P] [US3] Add optional sound trigger placeholder comment (non-implementation) in `app.js`

**Checkpoint**: Enhanced UX layer independently testable (can layer after MVP).

---
## Phase 6: User Story 4 - Reset and Replay (Priority: P2)
**Goal**: Clear state & allow new round; block mid-animation mode switch per spec.
**Independent Test**: After selection → press Reset → markers cleared; selection allowed again; toggle enabled.

### Implementation
- [ ] T034 [US4] Add Reset button to finger mode section in `index.html`
- [ ] T035 [US4] Implement reset logic (clear markers, state flags) in `app.js`
- [ ] T036 [US4] Re-enable Select button and mode toggle post-reset in `app.js`
- [ ] T037 [US4] Focus management: move focus to Select button after reset in `app.js`
- [ ] T038 [P] [US4] Announce reset completion via live region in `app.js`

**Checkpoint**: Replay flow functional; independent demonstration possible with prior stories stubbed.

---
## Phase 7: Polish & Cross-Cutting
**Purpose**: Accessibility, performance, cohesion, and fairness extras.

- [ ] T039 Add mode-specific instruction text for finger vs numeric in `index.html`
- [ ] T040 Ensure numeric mode unaffected (quick regression review) in `app.js`
- [ ] T041 Add palm-size heuristic (ignore large contacts) in `app.js`
- [ ] T042 [P] Add fairness distribution helper (100-run stats) in `app.js`
- [ ] T043 Consolidate announce messages (winner/mode/reset) in single utility in `app.js`
- [ ] T044 [P] Persist last chosen mode in `localStorage` (optional) in `app.js`
- [ ] T045 Color contrast audit adjustments for new styles in `styles.css`
- [ ] T046 [P] Reduced motion fallback style adjustments in `styles.css`
- [ ] T047 Remove temporary console logs & dev warnings in `app.js`
- [ ] T048 Update README usage section with finger mode instructions (root `README.md`)
- [ ] T049 [P] Add manual fairness & accessibility notes file `tests/accessibility/finger-mode.md`
- [ ] T050 Sign-off checklist: verify FR-001–FR-015 & SC-001–SC-008 (create verification notes `specs/002-finger-selection/checklists/verification.md`)
- [ ] T051 [P] Prevent iOS Safari pinch/back gestures in finger surface (CSS touch-action:none + gesture event preventDefault) `styles.css` / `app.js`

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
Total: 50

## MVP Scope Recommendation
Complete through T027 (US2 winner selection) to deliver core value; optionally include Reset (T034–T038) for smoother demos.

## Format Validation
All tasks follow: `- [ ] T### [P]? [USn]? Description with file path`.

