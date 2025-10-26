# Game Order Generator

A simple, accessible static web application to generate random turn order for board games and card games.

## Quick Start

1. Open `public/index.html` in a modern browser
2. Enter the number of players (2-20)
3. Click "Generate Order" or press Enter
4. View your random turn order
5. Optionally copy the order to clipboard

## Features

- 🎲 Random turn order generation using Fisher-Yates shuffle
- ♿ WCAG 2.1 AA accessible
- 📱 Fully responsive (mobile-first design)
- ⚡ Fast and lightweight (< 500KB total)
- 🔒 Works offline after initial load
- ⌨️ Full keyboard navigation support

## Technology

- Vanilla JavaScript (ES2020+)
- HTML5
- CSS3
- Zero external dependencies

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Usage

Enter a number between 2 and 20 representing the number of players. The application will:

1. Validate your input in real-time
2. Generate a random permutation of numbers 1 through N
3. Display the turn order
4. Allow you to copy the order or generate a new one

## Development

No build process required. Simply edit the files in `public/` and refresh your browser.

### File Structure

```
public/
├── index.html    # Main page
├── styles.css    # Styles
└── app.js        # Logic
```

### Testing

- Manual testing on different browsers and devices
- Accessibility testing with screen readers (NVDA/VoiceOver)
- Optional randomness validation script (see tests/)

## License

MIT
