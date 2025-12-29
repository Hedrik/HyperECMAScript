$token = Get-Content -Raw .\token.txt
$uri = 'https://api.github.com/repos/imontage-gh-devs/HyperECMAScript/branches/main/protection'
$body = @{
  required_status_checks = @{
    strict = $true
    contexts = @('memory-bank-check')
  }
  enforce_admins = $true
  required_pull_request_reviews = @{
    required_approving_review_count = 1
  }
  restrictions = $null
} | ConvertTo-Json -Depth 5

try {
  Invoke-RestMethod -Uri $uri -Method Put -Headers @{ Authorization = "token $token"; 'User-Agent' = 'HyperECMAScript-Agent' } -ContentType 'application/json' -Body $body
  Write-Host 'Branch protection applied.'
} catch {
  Write-Host 'Branch protection failed:' $_.Exception.Message
  exit 1
}

Remove-Item .\token.txt -Force
Write-Host 'Removed token.txt'
