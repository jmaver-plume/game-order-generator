<!--
Sync Impact Report:
- Version change: 1.0.0 → 2.0.0
- Removed principles: Accessibility-First (III), Performance-Optimized (IV)
- Modified principles: User-Centered Design (V → III, renumbered)
- Rationale: Removing two core principles constitutes backward-incompatible governance change
- Templates requiring updates: ✅ plan-template.md, ✅ spec-template.md, ✅ tasks-template.md
- Follow-up TODOs: Review existing feature specs (001-turn-order, 002-finger-selection) to remove accessibility/performance requirements if desired
-->

# Game Order Generator Constitution

## Core Principles

### I. Static-First
All functionality MUST be implemented as a static web page with no server dependencies. The application MUST work entirely through client-side JavaScript, HTML, and CSS. No external APIs or databases are required for core functionality. Local storage MAY be used for user preferences and temporary data persistence.

**Rationale**: Ensures maximum portability, zero hosting costs, and offline capability for users.

### II. Mobile-Responsive Design
The application MUST provide an optimal experience across all device sizes from mobile phones (320px width) to desktop screens (1920px+ width). Touch interactions MUST be prioritized for mobile users. All interactive elements MUST meet minimum touch target sizes (44px minimum).

**Rationale**: Game organizers often work on mobile devices during events and need full functionality regardless of device.

### III. User-Centered Design
Interface design MUST prioritize common game organization workflows. Features MUST be discoverable without documentation. Error states MUST provide clear, actionable guidance. User input MUST be validated in real-time with helpful feedback.

**Rationale**: Game organizers need intuitive tools that work under time pressure during events.

## Technical Standards

**Language Stack**: HTML5, CSS3, Vanilla JavaScript (ES2020+)
**Browser Support**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
**Build Tools**: Optional build step for optimization only (source must work unbundled)
**File Structure**: Single-page application with modular JavaScript components
**Testing**: Manual testing for all user scenarios
**Documentation**: Inline code comments for complex logic, README for setup

## Quality Assurance

**Testing Requirements**:
- Manual testing on mobile, tablet, and desktop viewports
- Cross-browser compatibility verification

**Review Process**:
- Mobile usability must be confirmed on actual devices

## Governance

This constitution supersedes all other development practices. All features and changes MUST comply with the stated principles. Any principle violations require explicit justification and amendment approval.

**Amendment Process**: Constitution changes require updating this document with rationale, incrementing version number, and updating dependent templates.

**Compliance Review**: Every feature implementation must verify adherence to all three core principles before completion.

**Version**: 2.0.0 | **Ratified**: 2025-10-26 | **Last Amended**: 2025-10-29
