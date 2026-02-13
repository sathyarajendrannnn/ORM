<#
Starts the backend after loading environment variables from the repository `.env`.
Usage:
  .\scripts\start-backend.ps1
This script will:
  - Load reviewmanagement\.env via load-env.ps1
  - Run .\mvnw.cmd spring-boot:run if present, otherwise `mvn spring-boot:run`
#>

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$ProjectRoot = Resolve-Path (Join-Path $ScriptDir "..")
$EnvPath = Join-Path $ProjectRoot ".env"
$Loader = Join-Path $ScriptDir "load-env.ps1"

if (-not (Test-Path $Loader)) {
  Write-Error "Loader not found: $Loader"
  exit 1
}

Write-Host "Loading env from $EnvPath"
& $Loader -EnvFile $EnvPath

# Prefer mvnw.cmd in project root
$mvnw = Join-Path $ProjectRoot "mvnw.cmd"
if (Test-Path $mvnw) {
  Write-Host "Using Maven Wrapper: $mvnw"
  & $mvnw spring-boot:run
} else {
  # Fall back to system mvn
  $mvn = Get-Command mvn -ErrorAction SilentlyContinue
  if ($mvn) {
    Write-Host "Using system Maven"
    mvn spring-boot:run
  } else {
    Write-Error "Neither mvnw.cmd nor mvn is available. Install Maven or include mvnw.cmd."
    exit 1
  }
}
