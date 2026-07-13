param()

$ErrorActionPreference = 'Stop'

$projectId = 'appgprj_6a515a7e24b8819183b2e9bd948265dc'
$remoteUrl = 'https://git.chatgpt-team.site/76804600-c670-4841-ad5a-d5dddee30694/appgprj_6a515a7e24b8819183b2e9bd948265dc.git'
$branchName = 'main'
$token = 'art_v1_5bf234d8fe6d2478be54a4e6cef56b006963a9c0'
$tokenExpiresLocal = '13/07/2026 13:30'

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

    throw 'Não encontrei o Git instalado neste computador.'
}

function Invoke-Git {
    param(
        [string]$GitPath,
        [string]$WorkingDirectory,
        [string[]]$Arguments,
        [switch]$AllowFailure
    )

    & $GitPath -C $WorkingDirectory -c ("safe.directory=" + $WorkingDirectory) @Arguments
    if (-not $AllowFailure -and $LASTEXITCODE -ne 0) {
        throw ("Falha ao executar Git: " + ($Arguments -join ' '))
    }
}

$scriptDirectory = Split-Path -Parent $MyInvocation.MyCommand.Path
$buildScript = Join-Path $scriptDirectory 'build-private-site.ps1'
$resultFile = Join-Path $scriptDirectory 'resultado-publicacao.txt'
$gitPath = Resolve-GitPath

Write-Host ''
Write-Host 'Copy Boy | Publicação privada' -ForegroundColor Cyan
Write-Host ('Projeto: ' + $projectId)
Write-Host ('Token válido até: ' + $tokenExpiresLocal)
Write-Host ''

if (-not (Test-Path $buildScript)) {
    throw 'Não encontrei o script de build da versão online.'
}

Write-Host '1. Gerando pacote atualizado...' -ForegroundColor Yellow
powershell -ExecutionPolicy Bypass -File $buildScript
if ($LASTEXITCODE -ne 0) {
    throw 'Falha ao gerar o pacote do site.'
}

Write-Host '2. Preparando repositório local da publicação...' -ForegroundColor Yellow
if (-not (Test-Path (Join-Path $scriptDirectory '.git'))) {
    Invoke-Git -GitPath $gitPath -WorkingDirectory $scriptDirectory -Arguments @('init', '-b', $branchName)
}

& $gitPath config --global --add safe.directory $scriptDirectory *> $null

$existingOrigin = (& $gitPath -C $scriptDirectory -c ("safe.directory=" + $scriptDirectory) remote) -join "`n"
if (-not ($existingOrigin -match '(^|`n)origin($|`n)')) {
    Invoke-Git -GitPath $gitPath -WorkingDirectory $scriptDirectory -Arguments @('remote', 'add', 'origin', $remoteUrl)
}

Invoke-Git -GitPath $gitPath -WorkingDirectory $scriptDirectory -Arguments @('add', '--', 'build-private-site.ps1', 'server', 'dist', '.openai', 'README.md', 'publicar-site-privado.ps1', 'publicar-site-privado.cmd', 'COMO-PUBLICAR.txt')

& $gitPath -C $scriptDirectory -c ("safe.directory=" + $scriptDirectory) -c 'user.name=Codex Publish' -c 'user.email=codex-publish@example.com' commit -m 'Atualiza app online privado' *> $null
if ($LASTEXITCODE -ne 0) {
    Write-Host 'Nenhuma alteração nova para commitar. Vou usar o commit atual.' -ForegroundColor DarkYellow
}

$commitSha = (& $gitPath -C $scriptDirectory -c ("safe.directory=" + $scriptDirectory) rev-parse HEAD).Trim()

Write-Host '3. Enviando código para a hospedagem privada...' -ForegroundColor Yellow
& $gitPath -C $scriptDirectory -c ("safe.directory=" + $scriptDirectory) -c ("http.extraHeader=Authorization: Bearer " + $token) push origin $branchName
if ($LASTEXITCODE -ne 0) {
    throw 'Falha no envio para o repositório privado. Se o token venceu, peça um novo token.'
}

$summary = @"
PUBLICACAO PRIVADA CONCLUIDA

Projeto:
$projectId

Branch:
$branchName

Commit:
$commitSha

Proximo passo:
Volte para o Codex e envie este commit para finalizar a publicação:
$commitSha
"@

Set-Content -LiteralPath $resultFile -Value $summary -Encoding UTF8

Write-Host ''
Write-Host 'Publicação técnica concluída.' -ForegroundColor Green
Write-Host ('Commit gerado: ' + $commitSha) -ForegroundColor Green
Write-Host ''
Write-Host ('Resumo salvo em: ' + $resultFile)
Write-Host 'Agora volte para o Codex e me envie o commit mostrado acima.'
Write-Host ''
Pause
