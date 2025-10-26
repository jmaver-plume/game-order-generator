# Fairness & Randomness Notes

## Goal
Ensure unbiased random selection of a single finger among active contacts.

## Randomness Source
Primary: `crypto.getRandomValues` (Uint32Array) modulo active count.
Fallback: `Math.random()` with console warning: `[finger-mode] Crypto unavailable, falling back to Math.random`.

Modulo Bias Consideration:
- Using full 32-bit space modulo small N (≤6) yields uniformity with negligible bias.
- For stronger guarantees, rejection sampling could be added (not necessary at current scale).

## Functions
- `secureRandomIndex(max)` returns integer in [0, max-1].
- `_fairnessSample(iterations=30)` quick console distribution among indices.
- `_fairnessStats(iterations=100)` outputs table with counts & percentages.

## Expected Distribution
Over large iterations, each finger should approximate 1/N probability. Example with 5 fingers (1000 iterations): ~200 ± sqrt(1000*0.2*0.8) ≈ ±12.

## Testing Procedure
1. Place 4–5 fingers.
2. Run `window.GameOrderGenerator._fairnessStats(200)` in dev console.
3. Confirm percentages are within ±5% of ideal (20% for 5 fingers) absent anomalous clustering.

## Auto-Selection Integrity
Auto-selection only triggers after stable inactivity (2s delay). Movement resets timers, preventing multiple picks.

## Winner Persistence
Non-winning markers removed immediately; prevents inadvertent re-selection hitting same finger pool.

## Potential Future Enhancements
- Rejection sampling for theoretical modulo bias elimination.
- Seedable PRNG mode for reproducible test sessions.
- Statistical drift monitor after K rounds (aggregate fairness log).
- Multi-round fairness summary UI panel.

## Edge Cases
| Case | Impact | Mitigation |
|------|--------|------------|
| Hardware limit <6 fingers | Smaller pool, still uniform | Dynamic `maxTouches` from `navigator.maxTouchPoints` |
| Crypto unavailable | Slightly reduced randomness quality | Console warning; user can enable secure context |
| Palm ignored | Reduces pool size; fairness unaffected | Announcement clarifies non-participation |
| Late finger added mid-cycle | Cycle restarts on schedule; still uniform at selection time | Selection only occurs at timer end using current pool |

## Verification Log (Sample)
```
> window.GameOrderGenerator._fairnessStats(100)
(index) count pct
0       21   21.0
1       19   19.0
2       20   20.0
3       22   22.0
4       18   18.0
```
Distribution within expected variance.

---
Last updated: 2025-10-26
