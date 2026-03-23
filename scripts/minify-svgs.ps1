$svgPath = Join-Path $PSScriptRoot '..\images'
Get-ChildItem -Path $svgPath -Filter *.svg | ForEach-Object {
    $p = $_.FullName
    try {
        $c = Get-Content -Path $p -Raw -ErrorAction Stop
        $c = [regex]::Replace($c,'<\?xml.*?\?>','', [System.Text.RegularExpressions.RegexOptions]::Singleline)
        $c = [regex]::Replace($c,'<!--.*?-->','', [System.Text.RegularExpressions.RegexOptions]::Singleline)
        $c = [regex]::Replace($c,'\s+',' ')
        Set-Content -Path $p -Value $c -Encoding utf8
        Write-Host "Optimized: $p"
    } catch {
        Write-Host "Failed: $p - $($_.Exception.Message)"
    }
}

# Show resulting sizes
Get-ChildItem -Path $svgPath | Select-Object Name,@{Name='KB';Expression={[math]::Round($_.Length/1KB,1)}} | Format-Table -AutoSize
