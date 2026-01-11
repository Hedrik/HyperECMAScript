$pp='C:\Program Files\GitHub CLI'
$userPath=[Environment]::GetEnvironmentVariable('Path','User')
if ([string]::IsNullOrEmpty($userPath)) {
  [Environment]::SetEnvironmentVariable('Path',$pp,'User')
  Write-Host "User PATH set to: $pp"
} elseif ($userPath -notlike "*${pp}*") {
  [Environment]::SetEnvironmentVariable('Path', $userPath + ';' + $pp, 'User')
  Write-Host "Appended to user PATH: $pp"
} else {
  Write-Host "GitHub CLI already in user PATH"
}
# Update current session so this shell can use gh immediately
$env:PATH = $env:PATH + ';' + $pp
Write-Host "Updated current session PATH."

try {
  gh --version
} catch {
  & 'C:\Program Files\GitHub CLI\gh.exe' --version
}
