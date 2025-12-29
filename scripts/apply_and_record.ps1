try {
  .\scripts\apply_branch_protection.ps1
  $ok = $true
} catch {
  $ok = $false
  $err = $_
}

if ($ok) {
  $entry = "## $(Get-Date -Format yyyy-MM-dd)`n- Enabled branch protection on main: required reviews=1, status check=memory-bank-check, enforce_admins=true."
  $entry | Out-File -FilePath .\memory-bank\progress_entry.md -Encoding UTF8
  .\scripts\update_progress.ps1 -ContentFile .\memory-bank\progress_entry.md
  git add memory-bank/progress.md
  & git commit -m 'Record: enabled branch protection for main'
  if ($LASTEXITCODE -ne 0) {
    Write-Host 'No changes to commit'
  } else {
    git push
  }
} else {
  Write-Host "APPLY_FAILED: $($err.Exception.Message)"
}
