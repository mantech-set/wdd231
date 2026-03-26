$svgDir = Join-Path $PSScriptRoot '..\images'
$target = Join-Path $svgDir 'daniel (1).svg'
$backup = Join-Path $svgDir 'daniel (1).svg.bak'

if (-Not (Test-Path $target)) { Write-Host "File not found: $target"; exit }

Copy-Item -Path $target -Destination $backup -Force
Write-Host "Backup created: $backup"

try {
  $c = Get-Content -Path $target -Raw -ErrorAction Stop
  # remove XML declaration
  $c = [regex]::Replace($c, '<\?xml.*?\?>', '', [System.Text.RegularExpressions.RegexOptions]::Singleline)
  # remove comments
  $c = [regex]::Replace($c, '<!--.*?-->', '', [System.Text.RegularExpressions.RegexOptions]::Singleline)
  # remove metadata, title, desc, defs (might remove gradients; use carefully)
  $c = [regex]::Replace($c, '<metadata.*?>.*?</metadata>', '', [System.Text.RegularExpressions.RegexOptions]::Singleline)
  $c = [regex]::Replace($c, '<title.*?>.*?</title>', '', [System.Text.RegularExpressions.RegexOptions]::Singleline)
  $c = [regex]::Replace($c, '<desc.*?>.*?</desc>', '', [System.Text.RegularExpressions.RegexOptions]::Singleline)
  # remove inkscape and sodipodi attributes
  $c = [regex]::Replace($c, '\s(?:inkscape|sodipodi):[a-zA-Z-]+="[^"]*"', '')
  # remove unnecessary xml:space and inkscape labels
  $c = [regex]::Replace($c, '\s(?:xml:space)="[^"]*"', '')
  # remove empty groups and empty defs
  $c = [regex]::Replace($c, '<g[^>]*>\s*</g>', '', [System.Text.RegularExpressions.RegexOptions]::Singleline)
  $c = [regex]::Replace($c, '<defs[^>]*>\s*</defs>', '', [System.Text.RegularExpressions.RegexOptions]::Singleline)
  # optionally remove id attributes (risky if used), remove only long editor ids
  $c = [regex]::Replace($c, '\s(id|class)="(?:_?[-a-zA-Z0-9_:.]+)"', '')
  # collapse whitespace
  $c = [regex]::Replace($c, '\s+', ' ')

  Set-Content -Path $target -Value $c -Encoding utf8
  Write-Host "Optimized: $target"
  $info = Get-Item $target
  Write-Host "New size: $([math]::Round($info.Length/1KB,1)) KB"
  Write-Host "Backup retained at: $backup"
}
catch {
  Write-Host "Failed to optimize: $($_.Exception.Message)"
}
