$ErrorActionPreference = "Stop"

$RepositoryRoot = Split-Path -Parent $PSScriptRoot
$FrontendDirectory = Join-Path $RepositoryRoot "front_end"
$OutputDirectory = Join-Path $FrontendDirectory "out"

Push-Location $FrontendDirectory
try {
    $PreviousApiUrl = $env:NEXT_PUBLIC_API_URL
    $env:NEXT_PUBLIC_API_URL = ""
    if (Test-Path "package-lock.json") {
        npm.cmd ci
    }
    else {
        npm.cmd install
    }
    npm.cmd run build
}
finally {
    $env:NEXT_PUBLIC_API_URL = $PreviousApiUrl
    Pop-Location
}

if (-not (Test-Path (Join-Path $OutputDirectory "index.html"))) {
    throw "Frontend build did not produce front_end/out/index.html"
}

Write-Output "Platform web build is ready in front_end/out."
