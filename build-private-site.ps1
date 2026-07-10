param(
    [string]$OutputRoot = (Join-Path $PSScriptRoot 'dist')
)

$ErrorActionPreference = 'Stop'

function Write-Utf8File {
    param(
        [string]$Path,
        [string]$Content
    )

    $directory = Split-Path -Parent $Path
    if (-not (Test-Path $directory)) {
        New-Item -ItemType Directory -Path $directory -Force | Out-Null
    }

    $encoding = New-Object System.Text.UTF8Encoding($false)
    [System.IO.File]::WriteAllText($Path, $Content, $encoding)
}

$projectRoot = Split-Path -Parent $PSScriptRoot
$clientSource = Join-Path $projectRoot 'internal-web-app'
$hostingSource = Join-Path $projectRoot '.openai\hosting.json'
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
Copy-Item $hostingSource (Join-Path $openaiOutput 'hosting.json')

$workerSource = @'
const HTML_FALLBACK = "/index.html";

function isAssetRequest(pathname) {
  return /\.[a-zA-Z0-9]+$/.test(pathname);
}

async function fetchAsset(env, request, pathname) {
  const assetUrl = new URL(request.url);
  assetUrl.pathname = pathname;
  return env.ASSETS.fetch(new Request(assetUrl.toString(), request));
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method not allowed", { status: 405 });
    }

    const directResponse = await fetchAsset(env, request, url.pathname);
    if (directResponse.status !== 404) {
      return directResponse;
    }

    if (isAssetRequest(url.pathname)) {
      return directResponse;
    }

    const fallbackResponse = await fetchAsset(env, request, HTML_FALLBACK);
    if (fallbackResponse.status !== 404) {
      return fallbackResponse;
    }

    return new Response("Not found", { status: 404 });
  },
};
'@

Write-Utf8File -Path (Join-Path $serverOutput 'index.js') -Content $workerSource

Write-Output ("Build pronto em " + $OutputRoot)
