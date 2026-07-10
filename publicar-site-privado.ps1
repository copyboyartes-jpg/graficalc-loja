param()

$ErrorActionPreference = 'Stop'

$projectId = 'appgprj_6a515a7e24b8819183b2e9bd948265dc'
$remoteUrl = 'https://git.chatgpt-team.site/76804600-c670-4841-ad5a-d5dddee30694/appgprj_6a515a7e24b8819183b2e9bd948265dc.git'
$branchName = 'main'
$token = 'art_v1_305f6ba1180c8388c47c657ecbc6ad048e0ac0d4'
$tokenExpiresLocal = '10/07/2026 18:29'

function Resolve-GitPath {
    $candidates = @(
        'C:\Program Files\Git\cmd\git.exe',
        'C:\Program Files\Git\bin\git.exe',
        'C:\Program Files (x86)\Git\cmd\git.exe',
        'C:\Program Files (x86)\Git\bin\git.exe',
        'C:\Users\Usuário\AppData\Local\Programs\Git\cmd\git.exe',
        'C:\Users\Usuário\AppData\Local\Programs\Git\bin\git.exe'
    )

    foreach ($candidate in $candidates) {
        if (Test-Path $candidate) {
            return $candidate
        }
    }

    $gitFromPath = Get-Command git -ErrorAction SilentlyContinue
    if ($gitFromPath) {
        return $gitFromPath.Source
    }

    throw 'Nao encontrei o Git instalado neste computador.'
}

function Invoke-Git {
    param(
        [string]$GitPath,
        [string]$WorkingDirectory,
        [string[]]$Arguments
    )

    & $GitPath -C $WorkingDirectory -c ("safe.directory=" + $WorkingDirectory) @Arguments
    if ($LASTEXITCODE -ne 0) {
        throw ("Falha ao executar Git: " + ($Arguments -join ' '))
    }
}

$scriptDirectory = Split-Path -Parent $MyInvocation.MyCommand.Path
$buildScript = Join-Path $scriptDirectory 'build-private-site.ps1'
$resultFile = Join-Path $scriptDirectory 'resultado-publicacao.txt'
$gitPath = Resolve-GitPath

Write-Host ''
Write-Host 'Copy Boy | Publicacao privada' -ForegroundColor Cyan
Write-Host ('Projeto: ' + $projectId)
Write-Host ('Token valido ate: ' + $tokenExpiresLocal)
Write-Host ''

if (-not (Test-Path $buildScript)) {
    throw 'Nao encontrei o script de build da versao online.'
}

Write-Host '1. Gerando pacote atualizado...' -ForegroundColor Yellow
powershell -ExecutionPolicy Bypass -File $buildScript
if ($LASTEXITCODE -ne 0) {
    throw 'Falha ao gerar o pacote do site.'
}

Write-Host '2. Preparando repositorio local da publicacao...' -ForegroundColor Yellow
if (Test-Path (Join-Path $scriptDirectory '.git')) {
    Remove-Item -LiteralPath (Join-Path $scriptDirectory '.git') -Recurse -Force
}

Invoke-Git -GitPath $gitPath -WorkingDirectory $scriptDirectory -Arguments @('init', '-b', $branchName)
& $gitPath config --global --add safe.directory $scriptDirectory *> $null
Invoke-Git -GitPath $gitPath -WorkingDirectory $scriptDirectory -Arguments @('add', '.')

& $gitPath -C $scriptDirectory -c ("safe.directory=" + $scriptDirectory) -c 'user.name=Codex Publish' -c 'user.email=codex-publish@example.com' commit -m 'Initial private site source' *> $null
if ($LASTEXITCODE -ne 0) {
    & $gitPath -C $scriptDirectory -c ("safe.directory=" + $scriptDirectory) -c 'user.name=Codex Publish' -c 'user.email=codex-publish@example.com' commit --allow-empty -m 'Initial private site source' *> $null
}
if ($LASTEXITCODE -ne 0) {
    throw 'Nao consegui criar o commit local da versao online.'
}

$existingOrigin = & $gitPath -C $scriptDirectory -c ("safe.directory=" + $scriptDirectory) remote
if ($existingOrigin -match 'origin') {
    Invoke-Git -GitPath $gitPath -WorkingDirectory $scriptDirectory -Arguments @('remote', 'remove', 'origin')
}
Invoke-Git -GitPath $gitPath -WorkingDirectory $scriptDirectory -Arguments @('remote', 'add', 'origin', $remoteUrl)

Write-Host '3. Enviando o primeiro codigo para o repositorio privado...' -ForegroundColor Yellow
& $gitPath -C $scriptDirectory -c ("safe.directory=" + $scriptDirectory) -c ("http.extraHeader=Authorization: Bearer " + $token) push -u origin $branchName
if ($LASTEXITCODE -ne 0) {
    throw 'Falha no envio para o repositorio privado. Se o token venceu, peca um novo token.'
}

$commitSha = (& $gitPath -C $scriptDirectory -c ("safe.directory=" + $scriptDirectory) rev-parse HEAD).Trim()

$summary = @"
PUBLICACAO PRIVADA CONCLUIDA

Projeto:
$projectId

Branch:
$branchName

Commit:
$commitSha

Proximo passo:
Volte para o Codex e envie este commit para finalizar a publicacao:
$commitSha
"@

Set-Content -LiteralPath $resultFile -Value $summary -Encoding UTF8

Write-Host ''
Write-Host 'Publicacao tecnica concluida.' -ForegroundColor Green
Write-Host ('Commit gerado: ' + $commitSha) -ForegroundColor Green
Write-Host ''
Write-Host ('Resumo salvo em: ' + $resultFile)
Write-Host 'Agora volte para o Codex e me envie o commit mostrado acima.'
Write-Host ''
Pause
