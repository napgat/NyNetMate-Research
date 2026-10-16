param(
    [string]$RendererPath = 'C:\Users\evilm\.cache\codex-uml-renderer\plantuml-1.2026.8.jar'
)

$ErrorActionPreference = 'Stop'
$componentSourcePath = Join-Path $PSScriptRoot 'network-management-components.puml'
if (-not (Test-Path -LiteralPath $RendererPath)) { throw "Local PlantUML renderer not found: $RendererPath" }
if (-not (Test-Path -LiteralPath $componentSourcePath)) { throw "Diagram source not found: $componentSourcePath" }

& java '-Djava.awt.headless=true' '-jar' $RendererPath '-charset' 'UTF-8' '-checkonly' $componentSourcePath
if ($LASTEXITCODE -ne 0) { throw 'PlantUML syntax check failed.' }
& java '-Djava.awt.headless=true' '-jar' $RendererPath '-charset' 'UTF-8' '-tsvg' $componentSourcePath
if ($LASTEXITCODE -ne 0) { throw 'PlantUML SVG render failed.' }
& java '-Djava.awt.headless=true' '-jar' $RendererPath '-charset' 'UTF-8' '-tpng' $componentSourcePath
if ($LASTEXITCODE -ne 0) { throw 'PlantUML PNG render failed.' }

Get-Item -LiteralPath (Join-Path $PSScriptRoot 'network-management-components.svg'),(Join-Path $PSScriptRoot 'network-management-components.png') | Select-Object Name,Length
