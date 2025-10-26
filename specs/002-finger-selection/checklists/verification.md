# Finger Pick Mode Verification Checklist

Use this checklist prior to release or merge.

## Functional Requirements
- [x] FR-001 Mode toggle switches between Player Count and Finger Pick.
- [x] FR-002 Player Count generation unaffected by Finger Pick logic.
- [x] FR-003 Finger markers appear for each valid touch (≤ device max / 6).
- [x] FR-004 Markers track movement smoothly (rAF batching).
- [x] FR-005 Max touches respected; additional contacts ignored with announcement.
- [x] FR-006 At least two fingers required for selection.
- [x] FR-007 Auto-selection triggers after ~2s of inactivity.
- [x] FR-008 Anticipation animation cycles markers (normal motion).
- [x] FR-009 Reduced motion setting skips animations and uses static indicator.
- [x] FR-010 Random winner selected via secure randomness (crypto).
- [x] FR-011 Fallback randomness warns when crypto unavailable.
- [x] FR-012 Non-winning markers removed; winner persists until reset.
- [x] FR-013 Mode switching blocked during selection/winner persistence.
- [x] FR-014 Reset clears markers, timers, winner, and allows fresh round.
- [x] FR-015 Palm-size (large contact) ignored with announcement.

## Accessibility & UX
- [x] AX-001 Live region announces state changes (counts, selection, winner, reset).
- [x] AX-002 Finger surface focusable; focus returns after reset.
- [x] AX-003 Marker contrast adequate (saturated color + white border).
- [x] AX-004 Reduced motion honored.
- [x] AX-005 Instructions visible in Finger Pick mode.
- [x] AX-006 Large contact ignoring announced clearly.
- [x] AX-007 No unexpected layout shift during selection.

## Performance
- [x] PERF-001 Move batching prevents excessive layout thrash.
- [x] PERF-002 Timers cleared on reset (no leaks).
- [x] PERF-003 No external network requests.

## Fairness
- [x] FAIR-001 Distribution appears uniform across sample runs.
- [x] FAIR-002 Helpers `_fairnessSample`, `_fairnessStats` output counts.
- [x] FAIR-003 Crypto path preferred; fallback logged.

## Browser / Device Smoke
- [ ] SMOKE-001 iOS Safari multi-touch (5 fingers) – confirm max enforcement.
- [ ] SMOKE-002 Android Chrome multi-touch.
- [ ] SMOKE-003 Desktop Chrome (simulated touch).
- [ ] SMOKE-004 Reduced motion (macOS) visual fallback.
- [ ] SMOKE-005 VoiceOver iOS announcements order.

## Edge Cases
- [x] EC-001 Reset during anticipation.
- [x] EC-002 Palm contact mixed with regular fingers.
- [x] EC-003 Finger lifted right before selection.
- [x] EC-004 Additional finger added mid-cycle (should delay selection by restart timers).

## Code Hygiene
- [x] CODE-001 No stray console logs (except intentional crypto fallback warning).
- [x] CODE-002 Clear separation of ModeManager and FingerManager responsibilities.
- [x] CODE-003 Configurable timings stored in `config` object.

## Next Review Items (Optional Enhancements)
- Palm threshold configurability.
- Sound cue opt-in.
- Rejection sampling refinement.
- Visual multi-round stats panel.

---
Reviewer:
Date:
Notes:
