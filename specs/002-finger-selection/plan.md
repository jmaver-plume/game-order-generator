# Implementation Plan: Multi-Touch Finger Selection & Dual Mode Toggle

**Branch**: `002-finger-selection` | **Date**: 2025-10-26 | **Spec**: ./spec.md  
**Input**: Specification for finger-based first-player selection plus dual-mode requirement (numeric vs touch)

## Summary
Add a second interaction mode to the existing turn order generator: a multi-touch "finger selection" that randomly picks one participant's finger as the first player. Provide a UI toggle allowing seamless switching between: (1) Numeric entry mode (existing permutation generator) and (2) Finger selection mode. Maintain fairness, responsiveness, accessibility, and simplicity with vanilla HTML/CSS/JS and zero runtime dependencies.

## Technical Context
**Language**: Vanilla JavaScript (ES2020+), HTML5, CSS3  
**Dependencies**: None (no external libs)  
**Randomness**: `crypto.getRandomValues` fallback to `Math.random` if unavailable (spec fairness requirement)  
**Touch APIs**: Pointer Events preferred (falls back to Touch Events if needed)  
**Accessibility Goals**: WCAG 2.1 AA; visual & textual winner indication; keyboard operable toggle; reduced motion compliance  
**Target Devices**: Mobile phones & tablets (primary), desktop (numeric mode still functional; finger mode gracefully degrades)  
**Performance Targets**: Touch registration <100ms, selection animation <3s total, mode switch <2s perceived (SC-008)  
**Constraints**: No back-end; no persistence beyond optional last-mode in `localStorage` (non-critical)  
**Out of Scope**: Ranking beyond first player; multi-device syncing; analytics.

## Constitution Check (Pre-Design)
| Principle | Compliance Plan | Status |
|-----------|-----------------|--------|
| Static-First | Extend existing static assets; add minimal new DOM nodes | ✅ |
| Mobile-Responsive | Fluid touch marker sizing, safe area spacing | ✅ |
| Accessibility-First | ARIA roles, winner announcement, keyboard toggle | ✅ |
| Performance-Optimized | Minimal per-frame work, no polling, event-driven | ✅ |
| User-Centered | Clear mode toggle + instructions for each mode | ✅ |

## Project Structure (Delta)
```text
public/
  index.html        # Extend with mode toggle + finger selection container
  styles.css        # Add touch marker styles, animation classes, mode visibility
  app.js            # Add mode state, touch manager, selection logic
  finger.css        # (Optional) Isolate touch styles if size grows (defer if <200 lines)
```
Feature docs:
```text
specs/002-finger-selection/
  plan.md
  spec.md
  checklists/
  tasks.md (to be added)
```

## New Components
- Mode Toggle Control: radio group or segmented button ("Players" / "Finger Pick")
- Finger Canvas/Layer: absolute-positioned container capturing pointer events
- Touch Marker Renderer: creates/removes marker elements; stable identity mapping
- Selection Controller: orchestrates animation and chooses winner
- Accessibility Announcer: reuses existing live region; add winner message

## Phases Overview
1. Scaffold & Mode Integration
2. Touch Capture & Marker Rendering
3. Selection Logic & Winner Highlight
4. UX Enhancements (animation, reset flow)
5. Accessibility & Robustness Pass
6. Dual-Mode Cohesion & Polish

## Risks & Mitigations
| Risk | Impact | Mitigation |
|------|--------|-----------|
| Pointer vs Touch API variance | Missed touches / inconsistent marker updates | Use Pointer Events first; test fallback on iOS Safari; feature detection branch |
| Performance with rapid touch churn | Jank or dropped frames | Throttle move updates (requestAnimationFrame batch) |
| Fairness perception | Users distrust randomness | Document fairness note + optional fairness test script |
| Mode confusion | Wrong mode used | Persistent visual header, distinct background tint per mode |
| Accidental palm touches | Unfair selection pool | Filter contacts larger than threshold radius (heuristic) |
| Mid-animation mode switch | Inconsistent state | Disallow toggle during active selection (FR-015) |

## Acceptance Matrix (Key Requirements)
| Req | Verification Approach | Tool/Method |
|-----|-----------------------|-------------|
| FR-001–003 | Manual multi-touch test (2–6 fingers) | Real devices |
| FR-005 | 30 repeated selections, distribution logging | Dev console script |
| FR-006 | Check use of crypto API present | Code inspection + fallback test |
| FR-011 | Invoke reset after selection; ensure clean state | Manual |
| FR-014 | Toggle mode w/o reload; both UIs accessible | Keyboard + pointer test |
| FR-015 | Try switching mid-selection; expect block | Manual scenario |
| SC-002 | Timestamp delta between touch & marker DOM insert | Console timing |
| SC-008 | User test: mode toggle discoverability (simulated) | Heuristic review |

## Implementation Strategy (Incremental Slices)
1. Add markup for toggle + conditional containers (no logic).
2. Implement mode state in `app.js`; wire toggle to hide/show containers.
3. Implement basic touch capture (down/up) with marker creation/removal.
4. Add selection trigger + secure random winner pick; console log only.
5. Add winner highlight UI + live region announcement.
6. Integrate reset flow; block mode switch mid-selection.
7. Add basic animation (pulse cycle) before winner reveal.
8. Add fairness dev script (optional) & palm-size filtering heuristics.
9. Polish: accessibility (focus management), reduced motion checks.
10. Final QA pass and code cleanup.

## Parallelization Opportunities
- Mode toggle UI & state (Step 1–2) can proceed independently of marker style polish.
- Fairness dev script can be added after winner logic (Step 4) without blocking animation (Step 7).
- Palm filtering can be implemented parallel to animation polishing.

## Complexity Tracking
No deviations triggering complexity justification; all additions align with static-first, dependency-free approach.

## Post-Design Constitution Check
| Principle | Confirmation | Status |
|-----------|-------------|--------|
| Static-First | Only HTML/CSS/JS additions, no build tooling | ✅ |
| Mobile-Responsive | Marker sizing uses relative units (vw/vmin) | ✅ |
| Accessibility-First | Live region reuse + keyboard toggle | ✅ |
| Performance-Optimized | event-driven, minimal DOM churn | ✅ |
| User-Centered | Clear separation & instructions per mode | ✅ |

## Defer / Future Considerations
- Naming players (annotation per finger)
- History of previous winners
- Multi-round fairness dashboard
- Haptic feedback (device vibration API)

## Exit Criteria For Feature Completion
- All FR-001–015 pass manual verification matrix.
- All SC-001–008 metrics demonstrably achievable (spot checks).
- No lingering [TODO] comments referencing core functionality.
- No unhandled pointer event errors in console during stress test (rapid finger churn).

## Initial Task Count Estimate
Expect ~35–45 tasks (will enumerate in `tasks.md`).

## MVP Cut Recommendation
Deliver through winner selection & basic highlight (up to Step 5) for earliest value; animation, palm filtering, and fairness script can follow.
