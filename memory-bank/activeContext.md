# Active Context

## Current Work Focus
The current focus is on establishing the memory bank for this project. This involves creating the initial set of documentation files as described in `memory-bank.md`.

## Recent Changes
The initial memory bank was created. Recent changes performed on 2025-12-25:
- Added `.github/copilot-instructions.md` (AI agent guidance).
- Added atomic progress update helpers: `scripts/update_progress.ps1`, `scripts/update_progress.sh`.
- Updated `memory-bank/progress.md` with the two-phase update policy and example usage.


## Next Steps
1. Keep `memory-bank/` files current after every change (update `progress.md`).
2. When adding public APIs or changing core behavior, update `projectbrief.md` or `activeContext.md` with rationale.
3. Use `scripts/update_progress.*` for atomic progress writes.
4. Continue implementing `src/framework.js` features; document major design changes in `systemPatterns.md`.

## Active Decisions and Considerations
The primary consideration is to accurately capture the information from `projectbrief.md` to create a solid foundation for the memory bank. This will ensure that future work is based on a clear and consistent understanding of the project goals.
