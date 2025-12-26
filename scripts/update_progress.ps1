param(
  [string]$Target = "memory-bank/progress.md",
  [string]$Temp = "$env:TEMP\progress.tmp",
  [string]$ContentFile
)

if ($ContentFile) {
  Get-Content -Raw -Encoding UTF8 $ContentFile | Out-File -FilePath $Temp -Encoding UTF8
} else {
  $stdin = [Console]::In.ReadToEnd()
  if ($stdin) {
    $stdin | Out-File -FilePath $Temp -Encoding UTF8
  } else {
    Write-Error "No content provided. Either supply -ContentFile or pipe content to the script."
    exit 1
  }
}

Move-Item -Force -Path $Temp -Destination $Target

Write-Host "Updated $Target (atomic move from $Temp)"
