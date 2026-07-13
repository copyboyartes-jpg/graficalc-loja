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

$appHash = (Get-FileHash (Join-Path $clientOutput 'app.mjs') -Algorithm SHA256).Hash.Substring(0, 12).ToLower()
$stylesHash = (Get-FileHash (Join-Path $clientOutput 'styles.css') -Algorithm SHA256).Hash.Substring(0, 12).ToLower()
$indexPath = Join-Path $clientOutput 'index.html'
$indexContent = Get-Content -Path $indexPath -Raw
$indexContent = $indexContent.Replace('./styles.css', "./styles.css?v=$stylesHash")
$indexContent = $indexContent.Replace('./app.mjs', "./app.mjs?v=$appHash")
Set-Content -Path $indexPath -Value $indexContent -Encoding UTF8

Copy-Item $hostingSource (Join-Path $openaiOutput 'hosting.json')
Copy-Item $serverSource (Join-Path $serverOutput 'index.js')

Write-Output ("Build pronto em " + $OutputRoot)
