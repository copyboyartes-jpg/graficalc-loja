param(
    [string]$PushToken,
    [string]$TokenExpiresLocal = '',
    [switch]$NoPause
)

$ErrorActionPreference = 'Stop'

$projectId = 'appgprj_6a515a7e24b8819183b2e9bd948265dc'
$remoteUrl = 'https://git.chatgpt-team.site/76804600-c670-4841-ad5a-d5dddee30694/appgprj_6a515a7e24b8819183b2e9bd948265dc.git'
$branchName = 'main'

function Resolve-GitPath {
    $candidates = @(
        'C:\Program Files\Git\cmd\git.exe',
        'C:\Program Files\Git\bin\git.exe',
        'C:\Program Files (x86)\Git\cmd\git.exe',
        'C:\Program Files (x86)\Git\bin\git.exe',
        'C:\Users\Usuario\AppData\Local\Programs\Git\cmd\git.exe',
        'C:\Users\Usuario\AppData\Local\Programs\Git\bin\git.exe'
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

function Write-ResultFile {
    param(
        [string]$ResultFile,
        [string]$Title,
        [string]$ProjectId,
        [string]$BranchName,
        [string]$CommitSha,
        [string]$NextStep
    )

    $summary = @"
$Title

Projeto:
$ProjectId

Branch:
$BranchName

Commit:
$CommitSha

Proximo passo:
$NextStep
"@

    Set-Content -LiteralPath $ResultFile -Value $summary -Encoding UTF8
}

function Finish-Flow {
    if (-not $NoPause) {
        Pause
    }
}

$scriptDirectory = Split-Path -Parent $MyInvocation.MyCommand.Path
$buildScript = Join-Path $scriptDirectory 'build-private-site.ps1'
$resultFile = Join-Path $scriptDirectory 'resultado-publicacao.txt'
$gitPath = Resolve-GitPath

Write-Host ''
Write-Host 'Copy Boy | Publicacao privada' -ForegroundColor Cyan
Write-Host ('Projeto: ' + $projectId)
if ($PushToken) {
    if ($TokenExpiresLocal) {
        Write-Host ('Token valido ate: ' + $TokenExpiresLocal)
    }
    else {
        Write-Host 'Token informado para envio imediato.'
    }
}
else {
    Write-Host 'Modo atual: gerar apenas o commit final local.'
}
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
if (-not (Test-Path (Join-Path $scriptDirectory '.git'))) {
    Invoke-Git -GitPath $gitPath -WorkingDirectory $scriptDirectory -Arguments @('init', '-b', $branchName)
}

$existingOrigin = (& $gitPath -C $scriptDirectory -c ("safe.directory=" + $scriptDirectory) remote) -join "`n"
if (-not ($existingOrigin -match '(^|`n)origin($|`n)')) {
    Invoke-Git -GitPath $gitPath -WorkingDirectory $scriptDirectory -Arguments @('remote', 'add', 'origin', $remoteUrl)
}

Invoke-Git -GitPath $gitPath -WorkingDirectory $scriptDirectory -Arguments @('add', '--', 'build-private-site.ps1', 'server', 'dist', '.openai', 'README.md', 'publicar-site-privado.ps1', 'publicar-site-privado.cmd', 'COMO-PUBLICAR.txt')

& $gitPath -C $scriptDirectory -c ("safe.directory=" + $scriptDirectory) -c 'user.name=Codex Publish' -c 'user.email=codex-publish@example.com' commit -m 'Atualiza app online privado' *> $null
if ($LASTEXITCODE -ne 0) {
    Write-Host 'Nenhuma alteracao nova para commitar. Vou usar o commit atual.' -ForegroundColor DarkYellow
}

$commitSha = (& $gitPath -C $scriptDirectory -c ("safe.directory=" + $scriptDirectory) rev-parse HEAD).Trim()

if (-not $PushToken) {
    Write-ResultFile -ResultFile $resultFile -Title 'COMMIT FINAL GERADO' -ProjectId $projectId -BranchName $branchName -CommitSha $commitSha -NextStep ('Volte para o Codex e envie este commit para finalizar a publicacao online:' + [Environment]::NewLine + $commitSha)

    Write-Host ''
    Write-Host 'Commit final gerado com sucesso.' -ForegroundColor Green
    Write-Host ('Commit gerado: ' + $commitSha) -ForegroundColor Green
    Write-Host ''
    Write-Host ('Resumo salvo em: ' + $resultFile)
    Write-Host 'Agora volte para o Codex e me envie o commit mostrado acima.'
    Write-Host ''
    Finish-Flow
    exit 0
}

Write-Host '3. Enviando codigo para a hospedagem privada...' -ForegroundColor Yellow
& $gitPath -C $scriptDirectory -c ("safe.directory=" + $scriptDirectory) -c ("http.extraHeader=Authorization: Bearer " + $PushToken) push origin $branchName
if ($LASTEXITCODE -ne 0) {
    throw 'Falha no envio para o repositorio privado. Confira se o token ainda esta valido.'
}

Write-ResultFile -ResultFile $resultFile -Title 'PUBLICACAO PRIVADA CONCLUIDA' -ProjectId $projectId -BranchName $branchName -CommitSha $commitSha -NextStep ('Volte para o Codex e envie este commit para finalizar a publicacao:' + [Environment]::NewLine + $commitSha)

Write-Host ''
Write-Host 'Publicacao tecnica concluida.' -ForegroundColor Green
Write-Host ('Commit gerado: ' + $commitSha) -ForegroundColor Green
Write-Host ''
Write-Host ('Resumo salvo em: ' + $resultFile)
Write-Host 'Agora volte para o Codex e me envie o commit mostrado acima.'
Write-Host ''
Finish-Flow
