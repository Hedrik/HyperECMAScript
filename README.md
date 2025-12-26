# HyperECMAScript

![Memory Bank Checks](https://github.com/Hedrik/HyperECMAScript/actions/workflows/memory-bank-check.yml/badge.svg)

A small, browser-only ECMAScript GUI framework. Core runtime is in `src/framework.js`. The project uses a "memory bank" of markdown files under `memory-bank/` to capture intent, decisions, and progress.

## Quickstart

- Run a minimal test shell by creating `test.html` that loads the framework and open it in a modern browser:

```html
<!doctype html>
<html>
  <head><meta charset="utf-8"><title>HyperECMAScript Test</title></head>
  <body>
    <script src="src/framework.js"></script>
    <script>
      // interact with Framework namespace in the console
      console.log(Framework);
    </script>
  </body>
</html>
```

## Memory Bank

All agents and contributors MUST read the files in `memory-bank/` at the start of a session. Key files:

- `memory-bank/memory-bank.md` — rules for using the memory bank
- `memory-bank/projectbrief.md` — project goals
- `memory-bank/activeContext.md` — current focus and next steps
- `memory-bank/progress.md` — chronological progress log (must be kept up-to-date)

## Local Git Hooks (recommended)

This repository tracks hook scripts under `scripts/hooks/`. To enable them locally (so progress entries are created automatically after relevant commits), run:

```powershell
# Windows / PowerShell
git config core.hooksPath scripts/hooks
```

```bash
# POSIX
git config core.hooksPath scripts/hooks
chmod +x scripts/hooks/*
```

Notes:
- Hooks are convenience helpers only — CI cannot enforce local hooks. Enabling them is a local developer responsibility.
- The repository provides both `post-commit` (POSIX shell) and `post-commit.ps1` (PowerShell) implementations.

## Atomic Progress Updates

When programmatically updating `memory-bank/progress.md`, always use the provided helpers to avoid partial writes:

- Windows PowerShell helper: `scripts/update_progress.ps1`
  - Example (pipe a file):
    ```powershell
    Get-Content new_progress.md -Raw | .\scripts\update_progress.ps1
    ```

- POSIX helper: `scripts/update_progress.sh`
  - Example:
    ```bash
    cat new_progress.md | ./scripts/update_progress.sh
    ```

These helpers write the new content to a temporary file then atomically replace the target file.

## CI Checks

A GitHub Actions workflow `.github/workflows/memory-bank-check.yml` runs on push and PR to `main` and verifies that required `memory-bank/` files exist and that `memory-bank/progress.md` is non-empty.

## Where to edit docs

When changing the framework's public APIs or large design decisions, update these files as appropriate:

- `memory-bank/projectbrief.md` — high-level intent
- `memory-bank/systemPatterns.md` — architecture and patterns
- `memory-bank/techContext.md` — environment and constraints
- `memory-bank/activeContext.md` — short-term focus
- `memory-bank/progress.md` — append or prepend dated entries describing changes (use the helpers)

If you'd like, I can also add a `CONTRIBUTING.md` with these steps. Let me know.
