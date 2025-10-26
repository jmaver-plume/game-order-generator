# Quickstart: Turn Order Generator

## Goal
Generate a random player turn order given a player count (2–20) using a static, accessible web page.

## Usage Steps (Planned UX)
1. Open `public/index.html` in a modern browser.
2. Enter number of players (2–20).
3. Press "Generate Order" (or hit Enter while focused in input).
4. View the displayed order.
5. (Optional) Press "Copy" to copy the order to clipboard.
6. Press "Generate Order" again to create a new permutation.

## Accessibility Notes
- Screen reader announces validation errors via aria-live region.
- After successful generation, focus moves to result heading for immediate announcement.
- Copy action announces success message ("Order copied").

## Performance Notes
- Single small JS file (<5KB) performing O(N) shuffle.
- No external network calls post-load.

## Development Checklist
- [ ] Implement layout skeleton (HTML)
- [ ] Add responsive styles (CSS)
- [ ] Implement input validation logic
- [ ] Implement Fisher-Yates shuffle
- [ ] Render permutation
- [ ] Add copy-to-clipboard
- [ ] Add accessibility (aria-live, focus management)
- [ ] Add lightweight randomness check script (optional)
- [ ] Manual test on mobile + desktop

## Future Enhancements (Not in MVP)
- Named player inputs
- Shareable link with seed
- Service worker for installable PWA
- History of previous orders
