# Feature Specification: Turn Order Generator MVP

**Feature Branch**: `001-turn-order`  
**Created**: 2025-10-26  
**Status**: Draft  
**Input**: User description: "Build a static web application where user will enter number of players participating in the board game and the application will randomly generate turn order (e.g., 4,2,3,1)."

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.
  
  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - Generate Random Turn Order (Priority: P1)

User enters a valid number of players and receives a randomized, duplicate‑free list representing player turn sequence.

**Why this priority**: Core purpose of the application; without this the product has no user value.

**Independent Test**: Input a number (e.g., 4) and verify output is a permutation of 1..4, uniformly random across multiple trials, with no repeats or omissions.

**Acceptance Scenarios**:

1. **Given** the page is loaded, **When** the user enters 4 and clicks Generate, **Then** they see 4 integers in random order each from 1–4 with no duplicates.
2. **Given** the user previously generated an order for 4 players, **When** they click Generate again, **Then** a new (not necessarily unique historically but independently randomized) order is displayed.

---

### User Story 2 - Input Validation & Guidance (Priority: P2)

User receives immediate, accessible feedback when entering invalid values (non-numeric, decimal, out of supported range) without generating an order.

**Why this priority**: Prevents confusion and ensures predictable behavior; improves accessibility and usability.

**Independent Test**: Enter invalid inputs (e.g., blank, 1, 0, 21, "abc") and observe contextual error messaging and disabled generation until valid.

**Acceptance Scenarios**:

1. **Given** the field is empty, **When** the user focuses out or presses Generate, **Then** an error message indicates a number is required.
2. **Given** the user enters 1, **When** validation runs, **Then** message indicates minimum is 2 players and no order is generated.
3. **Given** the user enters 25, **When** validation runs, **Then** message indicates maximum is 20 players.
4. **Given** the user enters text "abc", **When** validation runs, **Then** message indicates only whole numbers are accepted.

---

### User Story 3 - Share & Re-Generate Convenience (Priority: P3)

User can easily copy the generated order to clipboard and generate a new order without retyping the player count.

**Why this priority**: Enhances efficiency during live game setup; reduces re-entry friction.

**Independent Test**: Generate order, click Copy → order is in clipboard; click Generate again → new permutation shown using existing player count.

**Acceptance Scenarios**:

1. **Given** an order is displayed, **When** user clicks Copy, **Then** order string is available for paste (system clipboard contains same sequence).
2. **Given** an order is displayed, **When** user clicks Generate again, **Then** a new permutation appears without changing player count input.

---

[Add more user stories as needed, each with an assigned priority]

### Edge Cases

- Minimum players (2) produces exactly two numbers swapped (either 1,2 or 2,1).
- Maximum players (20) still returns promptly (<100ms perceived).
- Repeated rapid clicks on Generate produce distinct permutations (statistically) without freezing UI.
- Extremely large pasted number (e.g., 999999) is rejected with range message and not processed.
- Leading/trailing spaces around input are trimmed before validation.

## Requirements *(mandatory)*

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right functional requirements.
-->

### Functional Requirements

- **FR-001**: System MUST accept a whole number player count input between 2 and 20 inclusive.
- **FR-002**: System MUST validate input immediately on change or blur and present accessible error messaging (ARIA-live) when invalid.
- **FR-003**: System MUST generate a uniformly random permutation of integers 1..N where N is the validated player count.
- **FR-004**: System MUST render the generated order clearly (horizontal or vertical list) with sufficient contrast.
- **FR-005**: System MUST allow user to regenerate a new order without re-entering the player count.
- **FR-006**: System MUST provide a one‑click Copy function that places the order in clipboard in comma-separated format.
- **FR-007**: System MUST prevent generation when input is invalid or empty.
- **FR-008**: System MUST handle rapid repeated generation requests without performance degradation or duplicated numbers.
- **FR-009**: System MUST be fully usable with keyboard only (tab order logical, buttons focusable, Enter triggers generation when focused in input or on button).
- **FR-010**: System MUST function offline once initially loaded (no network after first load required).
- **FR-011**: System MUST announce success messages (e.g., "Order copied") to assistive technologies.
- **FR-012**: System SHOULD remember last valid player count during the session (optional enhancement; can be deferred if needed).

### Key Entities *(include if feature involves data)*

- **TurnOrder**: Abstract representation of one permutation generation event (playerCount, list of integers 1..N in random order, timestamp for user display if extended later). Not persisted beyond session.
- **PlayerCountInput**: Single integer value provided by user; must satisfy validation rules; ephemeral UI state.

## Success Criteria *(mandatory)*

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable.
-->

### Measurable Outcomes

- **SC-001**: First order generation for a valid input completes with visible result in < 0.5 seconds on a mid-range mobile device.
- **SC-002**: 95% of test iterations show uniformly distributed permutations (no position bias beyond statistical noise for 1,000 generations at N=5).
- **SC-003**: 100% of invalid input types (empty, <2, >20, non-numeric, decimal) produce clear guidance without generating an order.
- **SC-004**: 90% of first-time users (observational test) successfully generate and copy an order in under 30 seconds without external help.
- **SC-005**: All interactive controls meet WCAG 2.1 AA contrast and are keyboard accessible.

## Assumptions

- Range 2–20 chosen as practical common tabletop player counts; can be extended later.
- Uniform randomness interpreted as Fisher-Yates or equivalent unbiased algorithm; details left to implementation phase.
- No user accounts or persistence beyond optional session memory for player count.
- Accessibility conformance targets WCAG 2.1 AA subset relevant to this simple interaction (focus visibility, labels, contrast, aria-live announcements).

## Out of Scope

- Named players or custom labels (future enhancement).
- Saving or exporting history of generated orders.
- Multi-round scheduling or seeding logic.
- Server-side components or analytics.

## Risks

- Misinterpretation of randomness if duplicate order appears consecutively (user perception). Mitigation: Clarify randomness in help text if needed.
- Over-expansion of scope (adding player names) delaying MVP. Mitigation: Strict adherence to FR list.

## Open Questions

None at this time (no critical clarifications required for MVP delivery).
