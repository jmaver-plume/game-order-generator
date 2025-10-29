# Feature Specification: Remove Accessibility Features

**Feature Branch**: `003-remove-accessibility`  
**Created**: 2025-10-29  
**Status**: Draft  
**Input**: User description: "Remove all accessibility related features from app.js, index.html, and styles.css to keep the code simpler and lightweight"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Remove ARIA Announcements (Priority: P1)

As a developer maintaining the codebase, I need to remove all ARIA live region announcements and screen reader support so that the code is simpler and easier to maintain without accessibility overhead.

**Why this priority**: ARIA announcements represent the largest accessibility feature set in the codebase with the `announce()` function and centralized `#ariaLive` region used throughout.

**Independent Test**: Can be fully tested by verifying that all ARIA-related DOM elements, attributes, and JavaScript announcement logic are removed from the three source files, and the application still functions normally for sighted mouse/touch users.

**Acceptance Scenarios**:

1. **Given** the application is loaded, **When** reviewing the HTML, **Then** no `aria-live`, `aria-atomic`, `role="status"`, or `role="alert"` attributes exist
2. **Given** the application is running, **When** user interactions occur (mode switch, finger detection, selection), **Then** no announcements are made to screen readers
3. **Given** the JavaScript code, **When** reviewing functions, **Then** the `announce()` function and `Announce` object are completely removed
4. **Given** user generates turn order, **When** order is displayed, **Then** visual display works without accessibility announcements

---

### User Story 2 - Remove Semantic HTML & ARIA Attributes (Priority: P2)

As a developer, I need to remove semantic HTML elements and ARIA attributes (aria-label, aria-pressed, aria-describedby, role attributes) to simplify the markup and reduce code complexity.

**Why this priority**: Semantic HTML and ARIA attributes add complexity to the markup without providing value to users who don't use assistive technology.

**Independent Test**: Can be fully tested by inspecting the HTML and confirming all ARIA attributes and semantic roles are removed while the visual UI continues to function.

**Acceptance Scenarios**:

1. **Given** the HTML markup, **When** reviewing all elements, **Then** no `aria-label`, `aria-pressed`, `aria-describedby`, or `aria-labelledby` attributes exist
2. **Given** button elements, **When** user clicks them, **Then** buttons function normally without ARIA pressed states
3. **Given** the mode toggle, **When** switching modes, **Then** mode switching works without `aria-pressed` updates
4. **Given** input fields, **When** reviewing markup, **Then** no `aria-describedby` linking to hint/error messages exists
5. **Given** section elements, **When** reviewing markup, **Then** no `role="region"`, `role="main"`, `role="banner"`, or `role="application"` attributes exist

---

### User Story 3 - Remove Screen Reader Only Classes (Priority: P3)

As a developer, I need to remove all `.sr-only` screen reader utility classes and their CSS definitions to eliminate unused accessibility code.

**Why this priority**: Screen reader only content serves no purpose without accessibility support and adds unnecessary CSS and HTML.

**Independent Test**: Can be fully tested by searching for `.sr-only` class usage and confirming all instances are removed from HTML and CSS.

**Acceptance Scenarios**:

1. **Given** the CSS file, **When** searching for `.sr-only`, **Then** the class definition is completely removed
2. **Given** the HTML file, **When** searching for `sr-only` class usage, **Then** no elements use this class
3. **Given** span elements with screen reader text, **When** reviewing markup, **Then** all hidden accessibility text is removed

---

### User Story 4 - Remove Keyboard Navigation Support (Priority: P3)

As a developer, I need to remove keyboard navigation enhancements (tabindex, focus styles, button focus outlines) to simplify interaction code since the constitution no longer requires keyboard support.

**Why this priority**: Keyboard navigation features are no longer required by the constitution and can be simplified to default browser behavior.

**Independent Test**: Can be fully tested by removing explicit tabindex attributes, focus outline customizations, and verifying the UI works with standard mouse/touch interaction.

**Acceptance Scenarios**:

1. **Given** the HTML markup, **When** reviewing interactive elements, **Then** explicit `tabindex="0"` attributes are removed (browser defaults remain)
2. **Given** the CSS file, **When** reviewing focus styles, **Then** custom `:focus` outline rules are removed or simplified
3. **Given** the application running, **When** users interact via mouse/touch, **Then** all functionality works normally

---

### Edge Cases

- What happens when testing with a screen reader after removal? (Expected: No announcements, screen reader users cannot effectively use the app)
- How does the application handle reduced motion preferences after removing reduced motion accessibility code? (Review if any reduced motion CSS should be kept for UX reasons, not accessibility)
- What happens to existing users who relied on keyboard navigation? (Expected: They can no longer use the app effectively via keyboard)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Application MUST remove all ARIA live region elements (`#ariaLive`, `role="status"`, `aria-live="polite"`)
- **FR-002**: Application MUST remove all ARIA attribute usage (`aria-label`, `aria-pressed`, `aria-describedby`, `aria-labelledby`, `aria-atomic`)
- **FR-003**: Application MUST remove all semantic role attributes (`role="region"`, `role="main"`, `role="banner"`, `role="application"`)
- **FR-004**: Application MUST remove the `announce()` JavaScript function and `Announce` object with all announcement methods
- **FR-005**: Application MUST remove all calls to announcement functions throughout the JavaScript code
- **FR-006**: Application MUST remove `.sr-only` CSS class definition and all HTML elements using this class
- **FR-007**: Application MUST remove explicit `tabindex` attributes from non-interactive elements
- **FR-008**: Application MUST simplify or remove custom `:focus` outline styles in CSS
- **FR-009**: Application MUST maintain all visual functionality for mouse and touch users after removals
- **FR-010**: Application MUST remain functional in Player Count mode after removing accessibility features
- **FR-011**: Application MUST remain functional in Finger Pick mode after removing accessibility features

### Assumptions

- Users will interact with the application via mouse or touch only
- Screen reader compatibility is no longer required
- Keyboard-only navigation is no longer required
- Reduced motion preferences may be retained for general UX (not accessibility), but this is optional
- The application will be simpler and lighter after removing accessibility code

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Codebase contains zero ARIA attributes across all HTML files
- **SC-002**: JavaScript code contains zero accessibility announcement functions
- **SC-003**: Application loads and functions normally for mouse/touch users in both modes after changes
- **SC-004**: Code is measurably simpler with fewer lines dedicated to accessibility features (estimated 50+ lines removed across the three files)
- **SC-005**: All existing visual functionality (mode switching, turn order generation, finger selection) works identically for sighted users
