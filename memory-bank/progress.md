# Progress

## What Works
- The project brief (`projectbrief.md`) is defined.
- The structure for the memory bank (`memory-bank.md`) is established.

## What's Left to Build
- The initial memory bank files need to be created.
- The `framework.js` file needs to be implemented as per the project brief.
- The full feature set of the GUI manipulation framework needs to be developed.

## Current Status
The project is in the initialization phase. The immediate task is to create the foundational documentation for the memory bank.

## Known Issues
There are no known issues at this time.

## Recent Actions
- Added `.github/copilot-instructions.md` to capture AI agent guidance (committed and pushed to origin).

## Update Policy
- Agents MUST update this file after making changes that affect project state or documentation.
- Use an atomic two-phase update: write the new content to a temporary file then rename/move it into place. This avoids partial writes if an agent or process restarts mid-update.

## Example (PowerShell)
```powershell
# write content to a temp file, then move over the real file
Get-Content -Raw new_progress.md | Out-File -FilePath memory-bank/progress.md.tmp -Encoding UTF8
Move-Item -Force memory-bank/progress.md.tmp memory-bank/progress.md
```

## Example (POSIX shell)
```bash
# write content to a temp file, then atomically replace the target
cat new_progress.md > memory-bank/progress.md.tmp
mv -f memory-bank/progress.md.tmp memory-bank/progress.md
```
