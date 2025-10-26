# Tasks: Turn Order Generator MVP

**Input**: Design documents from `/specs/001-turn-order/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, quickstart.md

**Tests**: No formal automated test suite mandated for MVP; include lightweight optional tasks.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize minimal static project structure.

- [ ] T001 Create `public/` directory structure (public/index.html, styles.css, app.js)
- [ ] T002 Add base HTML skeleton with landmark regions in `public/index.html`
- [ ] T003 [P] Add placeholder CSS file with root variables in `public/styles.css`
- [ ] T004 [P] Initialize basic JS module pattern in `public/app.js`
- [ ] T005 Add README with quick usage instructions (root `README.md`)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core utilities and accessibility scaffolding required by all stories.

- [ ] T006 Implement accessibility live region container in `public/index.html`
- [ ] T007 [P] Implement utility: DOM query helpers in `public/app.js`
- [ ] T008 [P] Implement Fisher-Yates shuffle function stub in `public/app.js`
- [ ] T009 Add responsive meta tag & viewport scaling in `public/index.html`
- [ ] T010 Define CSS responsive layout + spacing scale in `public/styles.css`
- [ ] T011 Add focus outline and reduced motion preferences to `public/styles.css`
- [ ] T012 Add ARIA roles and labels to structural elements in `public/index.html`

**Checkpoint**: All foundational utilities & structure present; user story work can run in parallel.

---

## Phase 3: User Story 1 - Generate Random Turn Order (Priority: P1) 🎯 MVP

**Goal**: User enters valid player count and sees random permutation.
**Independent Test**: Enter 4 -> output is permutation of 1..4; repeat generates new permutations.

### Implementation
- [ ] T013 [US1] Add player count input + label with constraints text in `public/index.html`
- [ ] T014 [P] [US1] Implement parse & trim input logic in `public/app.js`
- [ ] T015 [P] [US1] Complete Fisher-Yates shuffle implementation in `public/app.js`
- [ ] T016 [US1] Render permutation list region in `public/index.html`
- [ ] T017 [US1] Connect Generate button handler to shuffle & render in `public/app.js`
- [ ] T018 [P] [US1] Add randomness sanity check dev function (1000 iterations N=5 console stats) in `public/app.js`

### Optional Tests
- [ ] T019 [P] [US1] Script to run randomness frequency distribution in `tests/randomness/check.js` (optional)

**Checkpoint**: Generation works, permutation displays correctly.

---

## Phase 4: User Story 2 - Input Validation & Guidance (Priority: P2)

**Goal**: Invalid inputs produce accessible, immediate feedback; generation blocked until valid.
**Independent Test**: Invalid entries show errors (1, 25, blank, abc) and no order produced.

### Implementation
- [ ] T020 [US2] Add validation rules (range 2–20, integer) in `public/app.js`
- [ ] T021 [P] [US2] Display inline error message region tied to input in `public/index.html`
- [ ] T022 [P] [US2] Implement live validation on input event in `public/app.js`
- [ ] T023 [US2] Disable Generate button when invalid in `public/app.js`
- [ ] T024 [US2] Announce errors via aria-live region in `public/app.js`
- [ ] T025 [P] [US2] Trim and sanitize pasted values before validation in `public/app.js`

### Optional Tests
- [ ] T026 [P] [US2] Validation scenario script (manually invoke validation with test values) in `tests/validation/validate.js`

**Checkpoint**: Validation UX complete and accessible.

---

## Phase 5: User Story 3 - Share & Re-Generate Convenience (Priority: P3)

**Goal**: User can copy order and regenerate without re-entering count.
**Independent Test**: Copy places order in clipboard; regenerate produces different permutation.

### Implementation
- [ ] T027 [US3] Add Copy button & icon (aria-label) in `public/index.html`
- [ ] T028 [P] [US3] Implement copy-to-clipboard logic with fallback in `public/app.js`
- [ ] T029 [US3] Announce copy success via aria-live in `public/app.js`
- [ ] T030 [P] [US3] Maintain last valid count in memory variable in `public/app.js`
- [ ] T031 [US3] Ensure Generate button reuses existing valid count value in `public/app.js`

### Optional Tests
- [ ] T032 [P] [US3] Manual test checklist doc `tests/manual/share-copy.md`

**Checkpoint**: Convenience features operational.

---

## Phase 6: Polish & Cross-Cutting

**Purpose**: Final quality, performance, accessibility refinements.

- [ ] T033 Add keyboard focus management (focus result heading) in `public/app.js`
- [ ] T034 [P] Add high-contrast theme verification adjustments in `public/styles.css`
- [ ] T035 [P] Minify CSS & JS (manual simple whitespace removal) optional in `public/` files
- [ ] T036 Add README usage GIF placeholder in `README.md`
- [ ] T037 Add license file `LICENSE` (select permissive, e.g., MIT)
- [ ] T038 [P] Manual mobile viewport verification notes in `tests/manual/mobile.md`
- [ ] T039 [P] Add accessibility audit notes (axe results) in `tests/accessibility/audit.md`
- [ ] T040 Final pass: ensure no external network requests (inspect code) in `public/app.js`

---

## Dependency Graph (User Story Level)
- US1 → (independent)
- US2 → depends on foundational + US1 input field (but can begin after T013/T014 are in place)
- US3 → depends on US1 (needs generated order) but not on US2 strict validation (can proceed in parallel after basic generation)

## Parallel Execution Examples
- After foundational (T006–T012): T014, T015, T016, T018 can run in parallel.
- Validation tasks T021, T022, T025 can run in parallel once T020 stub exists.
- Copy features T028, T030 can run in parallel with T029 after button markup (T027).

## Implementation Strategy
1. Deliver MVP with Phase 1–3 (US1) to provide immediate user value.
2. Layer validation (Phase 4) for robustness.
3. Add convenience (Phase 5) to enhance UX.
4. Polish for accessibility & performance (Phase 6).

## Task Counts
- Total Tasks: 40
- Setup: 5
- Foundational: 7
- US1: 6 (+1 optional test) = 7
- US2: 6 (+1 optional test) = 7
- US3: 5 (+1 optional test) = 6
- Polish: 8

## MVP Scope Recommendation
Implement through T018 (end of US1) for first deploy. Remaining phases iterate without breaking core flow.

## Format Validation
All tasks comply with required pattern: `- [ ] T### [P]? [USn]? Description with file path`.
