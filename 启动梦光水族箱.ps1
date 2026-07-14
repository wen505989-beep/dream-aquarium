$ErrorActionPreference = 'Stop'
$npm = (Get-Command npm -ErrorAction SilentlyContinue).Source
if (-not $npm) {
  Write-Error 'npm was not found. Please install Node.js and try again.'
  exit 1
}

Start-Process -FilePath $npm -ArgumentList @('run', 'dev', '--', '--open') -WorkingDirectory $PSScriptRoot
