param()

# Post-commit PowerShell hook: prepend a progress entry when relevant files change
$files = git diff-tree --no-commit-id --name-only -r HEAD
if (-not ($files -match '^(src/|\.github/|memory-bank/|scripts/)')) { exit 0 }

$sha = git rev-parse --short HEAD
$author = git --no-pager show -s --format='%an <%ae>' HEAD
$date = git --no-pager show -s --format='%cI' HEAD
$msg = git --no-pager show -s --format='%s' HEAD

$entry = "## $date`n- Commit: $sha ($author)`n- Message: $msg`n- Files:`n"

$files -split "\r?\n" | ForEach-Object { if ($_ -ne '') { $entry += "  - $_`n" } }

# Create new content by prepending entry to existing progress file
$temp = [System.IO.Path]::GetTempFileName()
$entry | Out-File -FilePath $temp -Encoding UTF8
Get-Content -Raw memory-bank/progress.md | Out-File -FilePath ($temp + ".tail") -Encoding UTF8
Get-Content -Raw $temp, ($temp + ".tail") | Out-File -FilePath $temp -Encoding UTF8

# Use update_progress.ps1 to atomically replace the target
.\scripts\update_progress.ps1 -ContentFile $temp

# Stage and commit the updated progress.md
git add memory-bank/progress.md
git commit -m "Auto: update progress for commit $sha" || exit 0

exit 0
