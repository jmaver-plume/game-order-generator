# Phase 0 Research: Turn Order Generator

## Decisions

### Random Permutation Algorithm
- **Decision**: Use Fisher-Yates shuffle on an array [1..N].
- **Rationale**: Proven unbiased O(N) algorithm with minimal memory and trivial to implement in vanilla JS.
- **Alternatives Considered**: (1) Sorting with random comparator (biased, unstable). (2) Generating unique numbers via rejection sampling (less efficient). (3) Precomputed permutations (inflexible, memory waste).

### Input Range (2–20)
- **Decision**: Enforce inclusive range 2..20.
- **Rationale**: Covers common board/card game player counts while keeping UI simple and performance trivial.
- **Alternatives Considered**: (1) Unlimited upper bound (encourages unrealistic input). (2) 2..10 (too restrictive for some party games).

### Accessibility Strategy
- **Decision**: Semantic HTML (label+input+button), aria-live region for status/errors, focus management (focus result heading after generation), high-contrast colors passing WCAG 2.1 AA, minimum touch target 44px.
- **Rationale**: Aligns with constitution Accessibility-First; minimal overhead.
- **Alternatives Considered**: (1) Post-generation modal (adds complexity). (2) No live region (screen reader users miss updates).

### Offline Capability
- **Decision**: Simple static hosting; optional future addition of a service worker for offline caching, but MVP relies on browser cache.
- **Rationale**: Minimizes initial complexity; service worker not mandatory for basic offline (app functions after first load due to no network calls).
- **Alternatives Considered**: Immediate service worker implementation (adds code and testing overhead for marginal MVP value).

### Copy to Clipboard
- **Decision**: Use modern Clipboard API with graceful fallback (select & execCommand if necessary) if compatibility issues arise.
- **Rationale**: Straightforward; wide support; minimal code.
- **Alternatives Considered**: Manual user selection instructions (worse UX).

### Randomness Quality Verification
- **Decision**: Provide optional dev script to run 1,000 shuffles at N=5 and compute frequency distribution for each position; simple console stats.
- **Rationale**: Ensures no accidental bias introduced.
- **Alternatives Considered**: Full statistical test suite (overkill).

### Persistence of Last Player Count
- **Decision**: Store last valid count in memory only (variable) for MVP; optionally add Local Storage in a follow-up if strongly requested.
- **Rationale**: Reduces scope; not essential for core value.
- **Alternatives Considered**: Local Storage (adds small complexity); Omit entirely (less user convenience on repeat visits).

## Resolved Clarifications
No outstanding NEEDS CLARIFICATION items.

## Open Considerations (Deferred)
- Adding player name entry list (phase 2+ enhancement)
- Service worker for full offline installable experience

## Summary
All technical unknowns resolved with minimal, standards-based approaches aligned with constitution principles. Ready to proceed to Phase 1 design artifacts.
