# Data Model: Turn Order Generator

Although the MVP is ephemeral and does not persist data, we define conceptual entities for clarity.

## Entities

### PlayerCountInput
- **Description**: User-provided integer representing number of players.
- **Fields**:
  - value (integer, required, 2 <= value <= 20)
- **Validation Rules**:
  - Must be whole number
  - Trim whitespace before parsing
  - Reject non-numeric or decimal input

### TurnOrder
- **Description**: A single generated permutation of sequential integers 1..N.
- **Fields**:
  - playerCount (integer, 2..20)
  - sequence (array<int>, length = playerCount, unique coverage 1..playerCount)
  - generatedAt (timestamp, in-memory only, optional for display)
- **Invariants**:
  - set(sequence) == {1..playerCount}
  - length(sequence) == playerCount
  - No duplicates

## State Flow
1. User enters playerCount (validation state: pending → valid or error)
2. On Generate: produce TurnOrder.sequence via Fisher-Yates
3. Display sequence and enable Copy action
4. On Regenerate: repeat step 2 (playerCount unchanged)

## Derived / Computed Data
- Display string: join(sequence, ",")
- Accessibility announcement: "Turn order: <display string>" or error message.

## Persistence Strategy
- None required; ephemeral in-memory objects. Optional enhancement: Local Storage key `lastPlayerCount`.

## Rationale
A minimal model avoids premature abstraction while documenting constraints needed for validation and testing.
