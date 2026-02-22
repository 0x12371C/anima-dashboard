# ANIMA Rebrand Script
# Renames OpenClaw -> ANIMA across the codebase
# Run from repo root: powershell -File scripts/rebrand.ps1

$root = $PSScriptRoot | Split-Path

# Files to process (exclude node_modules, .git, dist, pnpm-lock)
$files = Get-ChildItem $root -Recurse -File -Include *.ts,*.mjs,*.js,*.json,*.md,*.yml,*.yaml,*.toml,*.sh,*.html,*.css,*.swift,*.kt,*.plist,*.cfg |
    Where-Object { 
        $_.FullName -notmatch '(node_modules|\.git[/\\]|dist[/\\]|pnpm-lock|\.pnpm)' 
    }

$count = 0
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw -ErrorAction SilentlyContinue
    if (-not $content) { continue }
    
    $original = $content
    
    # Product name replacements (order matters - specific first)
    $content = $content -replace 'OpenClaw', 'ANIMA'
    $content = $content -replace 'openclaw', 'anima'
    $content = $content -replace 'OPENCLAW', 'ANIMA'
    # CLI/package references
    $content = $content -replace 'clawdbot', 'animabot'
    $content = $content -replace 'CLAWDBOT', 'ANIMABOT'
    $content = $content -replace 'Clawdbot', 'Animabot'
    $content = $content -replace 'moltbot', 'animabot'
    # Lobster/claw references
    $content = $content -replace 'EXFOLIATE! EXFOLIATE!', 'SOVEREIGN AGENTS ON VEIL'
    $content = $content -replace '🦞', '▽'
    
    if ($content -ne $original) {
        Set-Content $file.FullName -Value $content -NoNewline
        $count++
    }
}

Write-Host "Rebranded $count files"
