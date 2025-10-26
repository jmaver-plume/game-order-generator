# Tasks: Multi-Touch Finger Selection & Dual Mode

**Input**: `plan.md`, `spec.md` (FR-001–015, SC-001–008)  
**Goal**: Implement finger selection mode alongside existing numeric player permutation generator with accessible mode switching.

## Format: `[ID] [P?] [Story/Phase] Description`
[P] = polish / optional / can defer

---
## Phase 1: Scaffold & Mode Integration
- [ ] F001 Mode toggle markup added to `index.html` (radio or segmented control)
- [ ] F002 Finger selection container & instructions section in `index.html`
- [ ] F003 Base CSS classes for hidden/visible mode states in `styles.css`
- [ ] F004 Initialize mode state & event listeners in `app.js`
- [ ] F005 Announce mode change via live region (accessibility) in `app.js`

## Phase 2: Touch Capture & Marker Rendering (US3 / Core)
- [ ] F006 Implement pointer down handler: create marker element
- [ ] F007 Implement pointer up/cancel handler: remove marker element
- [ ] F008 Maintain active touches map (id → metadata) in `app.js`
- [ ] F009 Throttle pointer move updates (requestAnimationFrame batch) [P]
- [ ] F010 Marker styling (size, color, number label) in `styles.css`
- [ ] F011 Finger count display (active touches) in UI

## Phase 3: Selection Logic & Winner Highlight (US1)
- [ ] F012 Add Select button (disabled <2 touches) in `index.html`
- [ ] F013 Secure random winner pick using `crypto.getRandomValues`
- [ ] F014 Fallback to `Math.random` with warning if crypto unavailable [P]
- [ ] F015 Highlight winner marker (distinct style class)
- [ ] F016 Live region announcement of winner result
- [ ] F017 Prevent new selection until reset (lock state)

## Phase 4: Reset & Mode Protection (US4)
- [ ] F018 Reset button clears markers & state
- [ ] F019 Block mode toggle while selection animating (FR-015)
- [ ] F020 Provide focus management (focus winner → reset → toggle) [P]

## Phase 5: Animation & UX Polish (US2)
- [ ] F021 Pre-selection animation (pulse through markers)
- [ ] F022 Reduced motion preference: skip animation [P]
- [ ] F023 Distinct background tint or header text per mode
- [ ] F024 Instruction text adjustments for each mode
- [ ] F025 Winner celebration style (glow/border) [P]

## Phase 6: Fairness & Heuristics
- [ ] F026 Finger area size heuristic to ignore large palm contacts [P]
- [ ] F027 Developer fairness check script (100-run distribution) [P]
- [ ] F028 Console diagnostics toggle (dev only) [P]

## Phase 7: Accessibility & Performance Checks
- [ ] F029 All interactive elements keyboard operable & tabbable
- [ ] F030 Aria-live messaging consolidated (mode change, errors, winner)
- [ ] F031 Color contrast review > 4.5:1
- [ ] F032 Verify marker creation/removal <16ms average (manual timestamp sampling) [P]
- [ ] F033 High contrast mode CSS adjustments [P]

## Phase 8: Integration & Cohesion
- [ ] F034 Ensure numeric mode unchanged & still functional
- [ ] F035 Persist last selected mode in `localStorage` (optional) [P]
- [ ] F036 QA stress test rapid touch add/remove (manual) document results
- [ ] F037 Document usage instructions in README (update dual-mode section)
- [ ] F038 Add quickstart snippet for finger mode to `quickstart.md` [P]

## Phase 9: Finalization
- [ ] F039 Remove any temporary console logs
- [ ] F040 Final accessibility sweep & notes file `tests/accessibility/finger-mode.md` [P]
- [ ] F041 Manual test matrix exported (scenarios → pass/fail) [P]
- [ ] F042 Sign-off: all FR & SC verified

## Parallelization Notes
- Phases 1 & 2 can begin immediately.
- Fairness (F026–F028) can wait until selection logic stable (after F015).
- Accessibility passes (F029–F033) run after core UI (F006–F021).

## MVP Recommendation
MVP cutoff after F018 (basic selection, reset, highlight). Remaining tasks are enhancements.

## Counts
Core (non-[P]) tasks: 28  
Polish / optional ([P]) tasks: 14  
Total: 42

## Exit Criteria
All core tasks complete (F001–F034 excluding [P]) and SC-001–SC-008 demonstrably achievable.
