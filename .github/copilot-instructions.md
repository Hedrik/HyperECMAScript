<!-- Auto-generated guidance for AI coding agents working in this repo -->
# Copilot instructions — HyperECMAScript

Summary
- Purpose: Small, browser-only ECMAScript GUI framework. Core code is in a single file and the project uses a "memory bank" of markdown docs to encode project intent and context.

What to read first
- Read every file in `memory-bank/` at the start of each session: [memory-bank/memory-bank.md](memory-bank/memory-bank.md#L1-L200), [memory-bank/projectbrief.md](memory-bank/projectbrief.md#L1-L200), [memory-bank/activeContext.md](memory-bank/activeContext.md#L1-L200). These contain the project's assumptions and the MUST-follow workflow.

Big-picture architecture
- Single-file client-side framework: see [src/framework.js](src/framework.js#L1-L200). The framework exposes a `Framework` namespace (e.g., `Framework.toggleManipulationMode()`), and implements GUI elements using prototypal inheritance.
- Execution environment: intended to run in modern web browsers; there is no server component or packaging system present in the repository.

Project-specific conventions
- Prototype-first design: follow the prototypal pattern already used in `src/framework.js` when adding new components.
- Mode toggle pattern: user-editing vs runtime separation is implemented as a global toggle state (manipulation mode). Keep UI-editing concerns isolated behind the toggle.
- Memory Bank policy: any change that affects design, patterns, or decisions must be mirrored in the `memory-bank/` docs. The agent MUST update those files when implementing or changing core behavior.

Developer workflows (what works now)
- No build/test scripts detected. To run or experiment, create a minimal HTML shell that loads `src/framework.js` and open it in a browser.
  - Example: create `test.html` that includes `<script src="src/framework.js"></script>` then open in browser.
- There is no `package.json`, task runner, or CI configured in repo; do not assume Node-specific tooling unless the user adds it.

Patterns and examples
- Manipulation toggle: the toggle function is central — search for `toggleManipulationMode` in `src/framework.js` and integrate new UI controls with this API.
- GUI element base prototype: extend `Framework.GuiElement` for new element types to inherit common behavior and events (position/size and `onElementManipulated`).

Integration points & constraints
- Browser-only: code must avoid Node-only APIs and should be written defensively for browser contexts.
- No external dependencies: prefer vanilla ECMAScript; if adding a dependency, update `memory-bank/techContext.md` and inform maintainers.

Editing conventions for AI agents
- Keep changes small and focused: prefer single-file edits that preserve existing API names and patterns.
- When introducing new public symbols, document them in `memory-bank/` and add a short example in `projectbrief.md` or `activeContext.md`.
- If you modify the manipulation model or element prototypes, include a short migration note in `progress.md` describing the reason and steps to verify behavior in a browser.

- Progress updates: Agents MUST update `memory-bank/progress.md` after making changes that affect project state or documentation. Use the helper scripts in `scripts/` to perform an atomic two-phase update (write to a temp file, then rename/move into place). On Windows prefer `scripts/update_progress.ps1`, on POSIX use `scripts/update_progress.sh`.

Where to leave notes for humans
- Use the `memory-bank/` files for intent and decision records. Prefer `activeContext.md` for short-term work items and `progress.md` for verification steps.

If anything is missing or unclear
- Ask the repo owner to provide a minimal HTML runner and specify preferred browser targets. Also request any desired linting/packaging conventions before adding build tooling.

----
Please review these notes and tell me which parts you want expanded (examples, HTML test harness, or CI guidance).
