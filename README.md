# Game Order Generator

An accessible, lightweight web app to decide player order two ways:
1. Player Count mode: enter total players for a full shuffled turn order.
2. Finger Pick mode: place multiple fingers on a touch screen—one is randomly chosen after brief anticipation.

## Quick Start

1. Open `index.html` in any modern browser.
2. Use the toggle to pick a mode.
3. Player Count: enter 2–20 and press Generate.
4. Finger Pick: place at least two fingers on the capture area; keep them still. After ~2 seconds of inactivity an anticipation cycle runs, then one finger pulses as the selected starter.
5. Tap Reset to play another round (Finger Pick mode).

## Features

- 🎲 Unbiased Fisher–Yates shuffle for numeric turn order
- ✋ Multi-touch Finger Pick (up to 6 or device limit; many mobile devices cap at 5)
- ⏱ Auto-selection after inactivity (no manual button needed)
- 💫 Anticipation cycle + winner pulse animation (respects reduced motion preferences)
- ♿ ARIA live announcements (mode changes, counts, selection, winner, reset)
- � Mode persistence (remembers last used mode across page reloads)
- 🧪 Fairness helpers in console: `window.GameOrderGenerator._fairnessStats()`
- 📱 Responsive layout & large markers for finger coverage
- 🔒 No dependencies, works offline, zero network calls
- ⌨️ Full keyboard navigation in Player Count mode

## Technology

- Vanilla JavaScript (ES2020+)
- HTML5 + semantic regions
- CSS3 (custom properties, reduced motion support)
- Zero external runtime dependencies

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Usage Details

### Player Count Mode
1. Enter a number between 2 and 20.
2. Input validates live; errors announced to assistive tech.
3. Press Generate (or Enter) to produce a shuffled order.
4. Read the order visually or with a screen reader (aria-live announcement).

### Finger Pick Mode
1. Switch to Finger Pick.
2. Place at least two fingers simultaneously on the surface.
3. Markers enlarge slightly while active; colors differentiate fingers.
4. Maintain stillness—after ~2s an anticipation cycle highlights markers sequentially.
5. A winner pulses once; the winning marker remains while the others disappear.
6. Lift fingers or press Reset to start a new round.

Notes:
- Hardware touch limits: Many iOS devices cap at 5 simultaneous touches; app enforces device max (≤6).
- Reduced motion: If OS setting prefers reduced motion, cycle & pulse animations are skipped (selection still occurs).
- Fairness: Secure randomness uses `crypto.getRandomValues` when available; fallback warns via console.

## File Structure

```
index.html     # Main page (both modes)
styles.css     # Styling & animations
app.js         # Logic (mode, selection, fairness, announcements)
specs/         # Specifications & task tracking
tests/         # (Optional) future manual / script tests
```

## Development

No build step. Open `index.html` or serve directory statically. Edits to files reflect immediately on refresh.

Recommended Dev Checks:
- Toggle modes after a selection to confirm lock behavior.
- Run `_fairnessStats(200)` with several fingers placed to inspect distribution.
- Test with reduced motion enabled in system preferences.

## Accessibility

- Live region (`#ariaLive`) announces dynamic events.
- Finger markers have `aria-label` ("Finger N") even though numeric labels are visually removed for minimal clutter.
- Focus returns to capture surface after Reset for continued interaction.

## Planned Polish (Remaining)
- Palm-size heuristic to ignore very large contacts.
- Contrast audit for marker colors under varied lighting / high contrast modes.
- Reduced motion static indicator (non-animated highlight) before selection.
- Documentation for accessibility & fairness audits.

## License

MIT
