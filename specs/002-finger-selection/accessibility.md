# Finger Pick Mode Accessibility Notes

## Overview
Finger Pick mode enables multi-touch interaction to select a random starting player. Accessibility considerations ensure users of assistive technologies (AT) receive equivalent feedback.

## Live Region Announcements
Events announced via `#ariaLive` (polite):
- Mode change: "Player Count mode" / "Finger Pick mode"
- First finger detected: "First finger detected"
- Finger count updates: "N fingers detected"
- Selection start (anticipation): "Selecting random finger…"
- Winner chosen: "Random finger selected"
- Reset: "Reset complete, place fingers"
- Errors / guards: max fingers reached, insufficient fingers, blocked mode switch
- Large contact ignored (palm heuristic)

Clear messages are short (< 60 chars) to avoid queue delays.

## Keyboard & Focus
- Finger surface (`#fingerSurface`) is focusable (`tabindex="0"`).
- After reset, focus returns to the surface for continued rounds.
- Numeric mode retains existing keyboard flow (input → generate).

## Reduced Motion Support
- Users with `prefers-reduced-motion: reduce` skip anticipation cycling and winner pulse animations.
- Static fallback: markers gain `.finger-select-pending` outline to indicate pending selection, then winner briefly outlined.

## Touch Interaction Constraints
- `touch-action: none` + suppression of gesture events prevents accidental pinch/zoom or back navigation gestures, aiding users with tremor who might otherwise trigger browser UI.

## Palm-Size Heuristic (Large Contact Ignoring)
- Contacts exceeding 140px width or height are treated as palm and ignored with announcement: "Large contact ignored".
- Prevents accidental whole-hand placement from skewing fairness or occluding markers.

## Visual Contrast
- Markers use high saturation colors with a strong white border (≈4.5:1 edge against typical backgrounds) to improve visibility under finger occlusion.
- High contrast mode adds more prominent border adjustments via media query.

## Screen Reader Behavior
- Finger markers themselves are not focusable (purely visual) but each carries `aria-label` for potential future AT enumeration.
- Live region is atomic to prevent partial update overlaps.

## Potential Future Enhancements
- Explicit instructions toggle for verbosity adjustments.
- Optional sound cues with user opt-in for selection feedback.
- Adjustable palm threshold via settings UI.

## Known Limitations
- Finger enumeration order is color-based; colors are not announced individually (could add mapping if needed).
- Some browsers may not report `width` / `height` reliably for contacts; palm heuristic falls back gracefully (no false positive announcement).

## Testing Matrix
| Scenario | Expected Announcement | Visual Feedback | Result |
|----------|-----------------------|-----------------|--------|
| First finger | First finger detected | One marker | Pass |
| Second finger | 2 fingers detected | Two markers | Pass |
| <2 fingers selection attempt | Need at least two fingers to select | None | Pass |
| Auto selection (>=2 idle) | Selecting random finger… → Random finger selected | Cycle → Pulse (normal motion) | Pass |
| Auto selection (reduced motion) | Selecting random finger… → Random finger selected | Pending outline → Winner outline | Pass |
| Max fingers exceeded | Maximum of X fingers reached | Surface pulse | Pass |
| Palm contact | Large contact ignored | No marker | Pass |
| Reset | Reset complete, place fingers | All cleared | Pass |

## Assistive Tech Verified
- VoiceOver (iOS 17) – announcements sequenced correctly.
- NVDA (Windows 11) – numeric mode unaffected, mode switch announced.
- Safari / Chrome (macOS) – reduced motion respected.

---
Last updated: 2025-10-26
