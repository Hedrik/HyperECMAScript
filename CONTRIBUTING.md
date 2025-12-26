# Contributing to HyperECMAScript

Thanks for contributing! This repository follows a lightweight, local-first workflow designed to keep the project's Memory Bank authoritative and recoverable.

## Quick setup

1. Clone the repo and set the tracked hooks path so hooks are versioned with the repository:

```bash
git clone https://github.com/Hedrik/HyperECMAScript.git
cd HyperECMAScript
git config core.hooksPath scripts/hooks
chmod +x scripts/hooks/*
```

On Windows use PowerShell for `git config` and enable the PowerShell hook `post-commit.ps1` if you prefer.

## Memory Bank rules

- Read `memory-bank/` files at the start of every session. They are the single source of context for ongoing work.
- After any non-trivial change (API, architecture, or docs), update `memory-bank/progress.md` and `memory-bank/activeContext.md` as appropriate.

## Atomic progress updates

Use the provided helpers to update `memory-bank/progress.md` to avoid partial writes if a process restarts:

- PowerShell (Windows): `scripts/update_progress.ps1`
- POSIX (macOS/Linux): `scripts/update_progress.sh`

Example (POSIX):

```bash
printf "## 2025-12-25\n- Describe changes...\n" > new_progress.md
cat new_progress.md | ./scripts/update_progress.sh
```

Example (PowerShell):

```powershell
"## 2025-12-25`n- Describe changes...`n" | .\scripts\update_progress.ps1
```

## Local hooks

- `scripts/hooks/post-commit` (POSIX) and `scripts/hooks/post-commit.ps1` (PowerShell) will automatically prepend a progress entry and commit it for commits that touch `src/`, `.github/`, `memory-bank/`, or `scripts/`.
- Hooks are a convenience; CI enforces only the presence/non-empty state of core `memory-bank/` files.

## CI

- The repository includes a GitHub Actions workflow `.github/workflows/memory-bank-check.yml` that runs on push/PR to `main` and verifies required `memory-bank/` files exist and that `memory-bank/progress.md` is non-empty.

## PRs

- Open PRs against `main` for any feature or doc changes.
- Ensure `memory-bank/` files are updated where appropriate and include a short entry in `memory-bank/progress.md` describing the change.

If you'd like stricter automation (pre-push hooks, badge checks, or auto-formatting), tell me which tools to add and I can scaffold them.
