# Implementation Plan: Turn Order Generator MVP

**Branch**: `001-turn-order` | **Date**: 2025-10-26 | **Spec**: ./spec.md
**Input**: Feature specification from `./spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Provide a static, offline-capable web page where a user enters a player count (2–20) and receives a randomized, copyable turn order permutation. Focus on accessibility (WCAG 2.1 AA), responsiveness (mobile-first), performance (<0.5s generation), and simplicity (vanilla JS, no backend). No additional features (player names, history) in MVP.

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: Vanilla JavaScript (ES2020+), HTML5, CSS3  
**Primary Dependencies**: None (intentionally zero external runtime deps)  
**Storage**: Local Storage (optional for remembering last count)  
**Testing**: Manual exploratory + lightweight scripted randomness & accessibility checks (axe)  
**Target Platform**: Modern browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)  
**Project Type**: single / web (static)  
**Performance Goals**: <0.5s first generation; initial load <300KB compressed; interactions <100ms perceived  
**Constraints**: Offline-capable after first load; accessible (WCAG 2.1 AA); no backend; bundle <500KB total  
**Scale/Scope**: Single page; 3 core user stories (generate, validate input, copy/regenerate)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Compliance Plan | Status (Pre-Design) |
|-----------|-----------------|---------------------|
| Static-First | Pure HTML/CSS/JS; no external APIs/CDN required | ✅ |
| Mobile-Responsive Design | Fluid layout, min touch target 44px, responsive typography | ✅ |
| Accessibility-First | Semantic elements, labels, aria-live for errors & copy confirmation, keyboard focus order | ✅ |
| Performance-Optimized | Minimal JS (<5KB logic), defer non-critical styles, no frameworks | ✅ |
| User-Centered Design | Clear single input + actions, immediate validation, copy feedback | ✅ |

No violations anticipated; no Complexity Tracking entries required.

## Project Structure

### Documentation (this feature)

```text
specs/001-turn-order/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
└── tasks.md (later)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

ios/ or android/
directories captured above]
```text
public/
├── index.html          # Single page
├── styles.css          # Core styles (responsive, accessible)
├── app.js              # Logic (validation, generation, copy)
└── assets/             # (Optional future: icons)

tests/ (future optional)
├── accessibility/      # axe run scripts
└── randomness/         # statistical permutation checks
```

**Structure Decision**: Adopt minimal static site layout under `public/` to satisfy Static-First principle and simplify hosting (e.g., GitHub Pages). Future enhancements can add tests directory; no build pipeline required initially.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| *(none)* |  |  |

## Constitution Check (Post-Design)

| Principle | Implementation Confirmation | Status |
|-----------|-----------------------------|--------|
| Static-First | Only `public/` static assets planned | ✅ |
| Mobile-Responsive Design | Responsive CSS in single stylesheet; no fixed widths | ✅ |
| Accessibility-First | Aria-live region, semantic HTML, focus management listed in quickstart & FRs | ✅ |
| Performance-Optimized | No dependencies, minimal JS, small DOM | ✅ |
| User-Centered Design | Single-task interface, immediate validation, copy convenience | ✅ |

No changes required; proceeding to tasks phase next.
