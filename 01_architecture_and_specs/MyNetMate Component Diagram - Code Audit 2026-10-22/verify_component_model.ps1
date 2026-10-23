[CmdletBinding()]
param(
    [string]$WorkspaceRoot,
    [string]$BackendRepoPath,
    [string]$WebsiteRepoPath,
    [string]$OxianRepoPath,
    [string]$CacheDirectory,
    [string]$PlantUmlPath = $env:PLANTUML_PATH,
    [string]$JavaPath = 'java',
    [string]$GitPath = 'git',
    [switch]$Render
)
$ErrorActionPreference = 'Stop'
$taskArtifactDir = $PSScriptRoot
if (-not $WorkspaceRoot) { $WorkspaceRoot = Join-Path $taskArtifactDir '../..' }
$WorkspaceRoot = [System.IO.Path]::GetFullPath($WorkspaceRoot)
if (-not $BackendRepoPath) { $BackendRepoPath = Join-Path $WorkspaceRoot 'mynetmate/backend' }
if (-not $WebsiteRepoPath) { $WebsiteRepoPath = Join-Path $WorkspaceRoot 'mynetmate/website' }
if (-not $CacheDirectory) { $CacheDirectory = Join-Path $taskArtifactDir '.verification-cache' }
$CacheDirectory = [System.IO.Path]::GetFullPath($CacheDirectory)
$taskProtected = [System.IO.Path]::GetFullPath((Join-Path $WorkspaceRoot 'mynetmate/network-discovery'))
function Assert-SafeWritePath([string]$Path) {
    $taskResolved = [System.IO.Path]::GetFullPath($Path).TrimEnd([char[]]"\/")
    $taskBoundary = $taskProtected.TrimEnd([char[]]"\/")
    if ($taskResolved.Equals($taskBoundary, [StringComparison]::OrdinalIgnoreCase) -or $taskResolved.StartsWith($taskBoundary + [IO.Path]::DirectorySeparatorChar, [StringComparison]::OrdinalIgnoreCase)) {
        throw 'Refusing to write inside the protected network-discovery repository.'
    }
}
Assert-SafeWritePath $CacheDirectory
Assert-SafeWritePath $taskArtifactDir
foreach ($taskRepo in @($BackendRepoPath, $WebsiteRepoPath)) {
    if (-not (Test-Path -LiteralPath $taskRepo -PathType Container)) { throw "Missing source repository: $taskRepo. Supply -WorkspaceRoot or -BackendRepoPath / -WebsiteRepoPath." }
}
$taskModel = Get-Content -LiteralPath (Join-Path $taskArtifactDir 'component-model.json') -Raw -Encoding UTF8 | ConvertFrom-Json
$taskLayout = Get-Content -LiteralPath (Join-Path $taskArtifactDir 'A4/layout.json') -Raw -Encoding UTF8 | ConvertFrom-Json
$taskEvidenceBundle = Join-Path $taskArtifactDir 'evidence/oxian-59ee94f.bundle'
if (-not $OxianRepoPath) {
    if (-not (Test-Path -LiteralPath $taskEvidenceBundle)) { throw 'Oxian evidence bundle is missing. Supply -OxianRepoPath with the audited revision, or restore evidence/oxian-59ee94f.bundle.' }
    $taskBundleHash = (Get-FileHash -LiteralPath $taskEvidenceBundle -Algorithm SHA256).Hash
    if ($taskBundleHash -ne '06E573759EDFD4FD84F425085F6CEA3984E2641297EB9C79855C3C086BE8B4A9') { throw 'Oxian evidence bundle checksum mismatch.' }
    $OxianRepoPath = Join-Path $CacheDirectory 'oxian.git'
    if (-not (Test-Path -LiteralPath $OxianRepoPath)) {
        $null = New-Item -ItemType Directory -Path $CacheDirectory -Force
        $taskCloneOutput = @(& $GitPath clone --bare $taskEvidenceBundle $OxianRepoPath 2>&1)
        if ($LASTEXITCODE -ne 0) { throw "Cannot open bundled Oxian evidence: $($taskCloneOutput -join ' ')" }
    }
}
$taskRepos = @{ backend = $BackendRepoPath; website = $WebsiteRepoPath; oxian = $OxianRepoPath }
foreach ($taskRepoName in @('backend','website','oxian')) {
    if (-not (Test-Path -LiteralPath $taskRepos[$taskRepoName])) { throw "Missing repository for $taskRepoName." }
}
$taskRendererResolved = $null
if ($Render) {
    if (-not $PlantUmlPath) {
        $taskPlantCommand = Get-Command plantuml.exe, plantuml -ErrorAction SilentlyContinue | Select-Object -First 1
        if ($taskPlantCommand) { $PlantUmlPath = $taskPlantCommand.Source }
    }
    if (-not $PlantUmlPath -or -not (Test-Path -LiteralPath $PlantUmlPath -PathType Leaf)) { throw 'Local PlantUML is required for -Render. Supply -PlantUmlPath (native executable or .jar), set PLANTUML_PATH, or install it on PATH. Verification without -Render does not need a renderer.' }
    $taskRendererResolved = [IO.Path]::GetFullPath($PlantUmlPath)
}
function Invoke-LocalPlantUml([string]$Source, [string]$Mode, [string]$OutputPath, [switch]$HighResolution) {
    $taskStart = [Diagnostics.ProcessStartInfo]::new()
    $taskStart.UseShellExecute = $false
    $taskStart.CreateNoWindow = $true
    $taskStart.RedirectStandardInput = $true
    $taskStart.RedirectStandardOutput = $true
    $taskStart.RedirectStandardError = $true
    $taskStart.StandardInputEncoding = [Text.UTF8Encoding]::new($false)
    if ([IO.Path]::GetExtension($taskRendererResolved) -eq '.jar') {
        $taskStart.FileName = $JavaPath
        $taskStart.ArgumentList.Add('-jar')
        $taskStart.ArgumentList.Add($taskRendererResolved)
    } else { $taskStart.FileName = $taskRendererResolved }
    foreach ($taskArg in @('-charset','UTF-8','-pipe',$Mode)) { $taskStart.ArgumentList.Add($taskArg) }
    if ($HighResolution) { $taskStart.ArgumentList.Add('-Sdpi=300') }
    $taskProcess = [Diagnostics.Process]::new()
    $taskProcess.StartInfo = $taskStart
    $taskSink = if ($OutputPath) { [IO.File]::Create($OutputPath) } else { [IO.MemoryStream]::new() }
    try {
        $null = $taskProcess.Start()
        $taskRead = $taskProcess.StandardOutput.BaseStream.CopyToAsync($taskSink)
        $taskErrors = $taskProcess.StandardError.ReadToEndAsync()
        $taskProcess.StandardInput.Write($Source)
        $taskProcess.StandardInput.Close()
        if (-not $taskProcess.WaitForExit(60000)) { $taskProcess.Kill(); throw 'PlantUML exceeded the 60-second per-render limit.' }
        $null = $taskRead.GetAwaiter().GetResult()
        $taskErrorText = $taskErrors.GetAwaiter().GetResult()
        if ($taskProcess.ExitCode -ne 0) { throw "PlantUML $Mode failed: $taskErrorText" }
    } finally { $taskSink.Dispose(); $taskProcess.Dispose() }
}
$taskCache = @{}
$taskEvidence = @()
$taskFailures = @()
$taskCounts = @()
foreach ($taskDiagram in $taskModel.models) {
    $taskSourcePath = Join-Path $taskArtifactDir ($taskDiagram.file + '.puml')
    $taskSource = Get-Content -LiteralPath $taskSourcePath -Raw -Encoding UTF8
    if ($taskSource -match '(\.\.>|-->|<--|<\.\.)') { $taskFailures += "$($taskDiagram.file): arrow token found" }
    $taskExpected = 0
    foreach ($taskGroup in $taskDiagram.groups) {
        $taskNodeIds = @($taskGroup.nodes | ForEach-Object { $_.id })
        foreach ($taskContract in $taskGroup.contracts) {
            $taskExpected++
            if ($taskNodeIds -notcontains $taskContract.from -or $taskNodeIds -notcontains $taskContract.to) {
                $taskFailures += "$($taskContract.id): endpoint outside assembly"
            }
            $taskReqCount = [regex]::Matches($taskSource, ('(?m)^\s*port(?:in|out)? " " as R_' + [regex]::Escape($taskContract.id) + '\s*$')).Count
            $taskProvCount = [regex]::Matches($taskSource, ('(?m)^\s*port(?:in|out)? " " as P_' + [regex]::Escape($taskContract.id) + '\s*$')).Count
            $taskBinding = 'R_' + $taskContract.id + ' -(0- P_' + $taskContract.id + ' : ' + $taskContract.id + ': ' + $taskContract.name
            if ($taskReqCount -ne 1 -or $taskProvCount -ne 1 -or -not $taskSource.Contains($taskBinding)) {
                $taskFailures += "$($taskContract.id): simple-port pair / named binding mismatch"
            }
            foreach ($taskEndpoint in @(@{ node = $taskContract.from; port = ('R_' + $taskContract.id) }, @{ node = $taskContract.to; port = ('P_' + $taskContract.id) })) {
                $taskNodePattern = '(?s)component\s+"[^"]+"\s+as\s+' + [regex]::Escape($taskEndpoint.node) + '\s*\{(?<body>[^}]*)\}'
                $taskNodeMatch = [regex]::Match($taskSource, $taskNodePattern)
                if (-not $taskNodeMatch.Success -or -not $taskNodeMatch.Groups['body'].Value.Contains('as ' + $taskEndpoint.port)) {
                    $taskFailures += "$($taskContract.id): port not owned by expected component $($taskEndpoint.node)"
                }
            }
            if ($taskContract.evidence.Count -lt 2) { $taskFailures += "$($taskContract.id): insufficient evidence" }
            foreach ($taskItem in $taskContract.evidence) {
                $taskKey = "$($taskItem.repo)|$($taskItem.ref)|$($taskItem.path)"
                if (-not $taskCache.ContainsKey($taskKey)) {
                    $taskLines = @(& $GitPath -C $taskRepos[$taskItem.repo] show "$($taskItem.ref):$($taskItem.path)" 2>&1)
                    if ($LASTEXITCODE -ne 0) { $taskFailures += "$($taskContract.id): cannot read $taskKey"; $taskCache[$taskKey] = @() }
                    else { $taskCache[$taskKey] = $taskLines }
                }
                $taskMatches = @()
                $taskLineNo = 0
                foreach ($taskLine in $taskCache[$taskKey]) {
                    $taskLineNo++
                    if ([string]$taskLine -and ([string]$taskLine).Contains([string]$taskItem.pattern)) { $taskMatches += $taskLineNo }
                }
                if ($taskMatches.Count -eq 0) { $taskFailures += "$($taskContract.id): pattern not found: $taskKey :: $($taskItem.pattern)" }
                $taskEvidence += [pscustomobject]@{
                    contract = $taskContract.id; repo = $taskItem.repo; ref = $taskItem.ref
                    path = $taskItem.path; pattern = $taskItem.pattern; lines = $taskMatches
                    passed = ($taskMatches.Count -gt 0)
                }
            }
        }
    }
    $taskActual = [regex]::Matches($taskSource, '(?m)^\s*R_\w+ -\(0- P_\w+ : ').Count
    if ($taskActual -ne $taskExpected) { $taskFailures += "$($taskDiagram.file): connector count mismatch" }
    $taskCounts += [pscustomobject]@{ file = $taskDiagram.file; contracts = $taskExpected; bindings = $taskActual }
}

$taskA4Counts = @()
$taskCoverage = @{}
$taskRenderTargets = @($taskModel.models | ForEach-Object { [pscustomobject]@{ file = $_.file; a4 = $false } })
foreach ($taskPanel in $taskLayout.panels) {
    $taskCanonical = $taskModel.models | Where-Object { $_.file -eq $taskPanel.sourceFile } | Select-Object -First 1
    $taskAllContracts = @($taskCanonical.groups | ForEach-Object { $_.contracts })
    $taskPanelSource = [IO.File]::ReadAllText((Join-Path $taskArtifactDir ($taskPanel.file + '.puml')))
    $taskFlatSource = $taskPanelSource.Replace('\n','')
    if ($taskPanelSource -match '(\.\.>|-->|<--|<\.\.)') { $taskFailures += "$($taskPanel.file): arrow token" }
    foreach ($taskId in $taskPanel.contractIds) {
        $taskContract = $taskAllContracts | Where-Object { $_.id -eq $taskId } | Select-Object -First 1
        if (-not $taskContract) { $taskFailures += "$taskId : not in canonical model"; continue }
        if (-not $taskCoverage.ContainsKey($taskId)) { $taskCoverage[$taskId] = 0 }
        $taskCoverage[$taskId]++
        $taskBinding = 'R_' + $taskId + ' -(0- P_' + $taskId + ' : ' + $taskId + ': ' + $taskContract.name
        if (-not $taskFlatSource.Contains($taskBinding)) { $taskFailures += "$taskId : A4 named binding mismatch" }
        foreach ($taskEndpoint in @(@{ node=$taskContract.from; port=('R_'+$taskId) },@{ node=$taskContract.to; port=('P_'+$taskId) })) {
            $taskNodeMatch = [regex]::Match($taskPanelSource, ('(?s)component\s+"[^"]+"\s+as\s+' + [regex]::Escape($taskEndpoint.node) + '\s*\{(?<body>[^}]*)\}'))
            if (-not $taskNodeMatch.Success -or -not $taskNodeMatch.Groups['body'].Value.Contains('as '+$taskEndpoint.port)) { $taskFailures += "$taskId : A4 port owner mismatch" }
        }
    }
    $taskBindingCount = [regex]::Matches($taskPanelSource,'(?m)^\s*R_\w+ -\(0- P_\w+ : ').Count
    if ($taskBindingCount -ne $taskPanel.contractIds.Count) { $taskFailures += "$($taskPanel.file): extra / missing binding" }
    $taskA4Counts += [pscustomobject]@{ file=$taskPanel.file; contracts=$taskPanel.contractIds.Count; bindings=$taskBindingCount }
    $taskRenderTargets += [pscustomobject]@{ file=$taskPanel.file; a4=$true }
}
foreach ($taskContract in @($taskModel.models | ForEach-Object { $_.groups | ForEach-Object { $_.contracts } })) {
    if ($taskCoverage[$taskContract.id] -ne 1) { $taskFailures += "$($taskContract.id): A4 coverage must be exactly once" }
}
$taskRenders = @()
$taskPrintMetrics = @()
$taskCanRender = ($taskFailures.Count -eq 0)
foreach ($taskTarget in $taskRenderTargets) {
    $taskPumlPath = Join-Path $taskArtifactDir ($taskTarget.file + '.puml')
    $taskSvgPath = Join-Path $taskArtifactDir ($taskTarget.file + '.svg')
    $taskPngPath = Join-Path $taskArtifactDir ($taskTarget.file + '.png')
    if ($Render -and $taskCanRender) {
        try {
            $taskSource = [IO.File]::ReadAllText($taskPumlPath)
            Invoke-LocalPlantUml $taskSource '-checkonly' ''
            Invoke-LocalPlantUml $taskSource '-tsvg' $taskSvgPath
            Invoke-LocalPlantUml $taskSource '-tpng' $taskPngPath -HighResolution:$taskTarget.a4
            $taskRenders += [pscustomobject]@{ file=$taskTarget.file; sourceHash=(Get-FileHash -LiteralPath $taskPumlPath).Hash; syntax='passed'; renderer='local UTF-8 stdin/stdout'; pngDpi=($(if($taskTarget.a4){300}else{96})) }
        } catch { $taskFailures += "$($taskTarget.file): $_" }
    }
    if (Test-Path -LiteralPath $taskSvgPath) {
        [xml]$taskSvg = [IO.File]::ReadAllText($taskSvgPath)
        if ($taskSvg.DocumentElement.LocalName -ne 'svg' -or $taskSvg.OuterXml -match 'Syntax Error|An error has occurred') { $taskFailures += "$($taskTarget.file): invalid SVG" }
        if ($taskTarget.a4) {
            $taskViewBox = $taskSvg.DocumentElement.GetAttribute('viewBox').Split(' ',[StringSplitOptions]::RemoveEmptyEntries)
            $taskWidth = [double]::Parse($taskViewBox[2],[cultureinfo]::InvariantCulture)
            $taskHeight = [double]::Parse($taskViewBox[3],[cultureinfo]::InvariantCulture)
            $taskFonts = @($taskSvg.SelectNodes("//*[local-name()='text']") | ForEach-Object { [double]::Parse($_.GetAttribute('font-size'),[cultureinfo]::InvariantCulture) })
            $taskMinFont = ($taskFonts | Measure-Object -Minimum).Minimum
            $taskScale = [math]::Min(($taskLayout.contentWidthMm*72/25.4)/$taskWidth,($taskLayout.contentHeightMm*72/25.4)/$taskHeight)
            $taskFontPt = $taskMinFont*$taskScale
            $taskMetric = [pscustomobject]@{ file=$taskTarget.file; widthMm=[math]::Round($taskWidth*$taskScale*25.4/72,2); heightMm=[math]::Round($taskHeight*$taskScale*25.4/72,2); minFontPt=[math]::Round($taskFontPt,2); minimumRequiredPt=$taskLayout.minimumFontPt; passed=($taskFontPt -ge $taskLayout.minimumFontPt) }
            $taskPrintMetrics += $taskMetric
            if ($Render) {
                $taskSvg.DocumentElement.SetAttribute('width', ($taskMetric.widthMm.ToString([cultureinfo]::InvariantCulture) + 'mm'))
                $taskSvg.DocumentElement.SetAttribute('height', ($taskMetric.heightMm.ToString([cultureinfo]::InvariantCulture) + 'mm'))
                $taskSvg.Save($taskSvgPath)
            }
            if (-not $taskMetric.passed) { $taskFailures += "$($taskTarget.file): A4 minimum font $($taskMetric.minFontPt) pt below $($taskLayout.minimumFontPt) pt" }
        }
    } elseif (-not $Render) { $taskFailures += "$($taskTarget.file): SVG missing; run with -Render." }
    if (Test-Path -LiteralPath $taskPngPath) {
        $taskBytes=[IO.File]::ReadAllBytes($taskPngPath)
        if ($taskBytes.Length -lt 24 -or [BitConverter]::ToString($taskBytes,0,8) -ne '89-50-4E-47-0D-0A-1A-0A') { $taskFailures += "$($taskTarget.file): invalid PNG" }
    } elseif (-not $Render) { $taskFailures += "$($taskTarget.file): PNG missing; run with -Render." }
}
[pscustomobject]@{
    toolingVersion=3; modelVersion=$taskModel.modelVersion
    diagrams=$taskCounts; a4Panels=$taskA4Counts
    evidenceChecks=$taskEvidence.Count; sourceObjectsRead=$taskCache.Count
    evidence=$taskEvidence; renders=$taskRenders; printMetrics=$taskPrintMetrics
    oxianSource=($(if($OxianRepoPath -like "$CacheDirectory*"){'bundled local Git evidence'}else{'explicit repository'}))
    failures=$taskFailures; passed=($taskFailures.Count -eq 0)
    limits=@('Static code and diagram checks, not E2E / device tests.','UML semantics require manual review in addition to syntax.','A4 metrics assume the documented insertion dimensions; do not shrink below them.')
} | ConvertTo-Json -Depth 12

