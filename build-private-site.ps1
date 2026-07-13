param(
    [string]$OutputRoot = (Join-Path $PSScriptRoot 'dist')
)

$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $PSScriptRoot
$clientSource = Join-Path $projectRoot 'internal-web-app'
$hostingSource = Join-Path $projectRoot '.openai\hosting.json'
$serverSource = Join-Path $PSScriptRoot 'server\index.js'
$clientOutput = Join-Path $OutputRoot 'client'
$serverOutput = Join-Path $OutputRoot 'server'
$openaiOutput = Join-Path $OutputRoot '.openai'

if (Test-Path $OutputRoot) {
    Remove-Item -LiteralPath $OutputRoot -Recurse -Force
}

New-Item -ItemType Directory -Path $clientOutput -Force | Out-Null
New-Item -ItemType Directory -Path $serverOutput -Force | Out-Null
New-Item -ItemType Directory -Path $openaiOutput -Force | Out-Null

Copy-Item (Join-Path $clientSource 'index.html') (Join-Path $clientOutput 'index.html')
Copy-Item (Join-Path $clientSource 'styles.css') (Join-Path $clientOutput 'styles.css')
Copy-Item (Join-Path $clientSource 'app.mjs') (Join-Path $clientOutput 'app.mjs')
if (Test-Path (Join-Path $clientSource 'assets')) {
    Copy-Item (Join-Path $clientSource 'assets') (Join-Path $clientOutput 'assets') -Recurse -Force
}
Copy-Item $hostingSource (Join-Path $openaiOutput 'hosting.json')
Copy-Item $serverSource (Join-Path $serverOutput 'index.js')

Write-Output ("Build pronto em " + $OutputRoot)
