<#
Loads key=value entries from a .env file into the current PowerShell process environment.
Usage (dot-source to affect current session):
  . .\scripts\load-env.ps1   # loads .env in project root
  . .\scripts\load-env.ps1 -EnvFile ".env"  # specify path
#>
param(
  [string]$EnvFile = ".env"
)

if (-not (Test-Path $EnvFile)) {
  Write-Error "Env file not found: $EnvFile"
  exit 1
}

Get-Content $EnvFile | ForEach-Object {
  $line = $_.Trim()
  if ([string]::IsNullOrWhiteSpace($line)) { return }
  if ($line.StartsWith('#')) { return }
  $pair = $line -split '=', 2
  if ($pair.Length -ne 2) { return }
  $name = $pair[0].Trim()
  $value = $pair[1].Trim()
  [System.Environment]::SetEnvironmentVariable($name, $value, 'Process')
  Write-Host "Set $name=$value"
}
