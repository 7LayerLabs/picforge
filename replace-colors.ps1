# Replace orange colors with teal (Sunny Beach Day palette)
$files = Get-ChildItem -Path "C:\Users\derek\OneDrive\Desktop\nano" -Include *.tsx,*.jsx,*.ts,*.js -Recurse | Where-Object { $_.FullName -notmatch 'node_modules' }

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $changed = $false

    # Replace orange-500 with teal-500
    if ($content -match 'orange-500') {
        $content = $content -replace 'orange-500', 'teal-500'
        $changed = $true
    }

    # Replace orange-600 with teal-600
    if ($content -match 'orange-600') {
        $content = $content -replace 'orange-600', 'teal-600'
        $changed = $true
    }

    # Replace orange-400 with teal-400
    if ($content -match 'orange-400') {
        $content = $content -replace 'orange-400', 'teal-400'
        $changed = $true
    }

    # Replace orange-50 with teal-50
    if ($content -match 'orange-50') {
        $content = $content -replace 'orange-50', 'teal-50'
        $changed = $true
    }

    # Replace orange-100 with teal-100
    if ($content -match 'orange-100') {
        $content = $content -replace 'orange-100', 'teal-100'
        $changed = $true
    }

    # Replace red-500 with coral-500
    if ($content -match 'red-500') {
        $content = $content -replace 'red-500', 'coral-500'
        $changed = $true
    }

    # Replace red-600 with coral-600
    if ($content -match 'red-600') {
        $content = $content -replace 'red-600', 'coral-600'
        $changed = $true
    }

    # Replace red-50 with amber-50
    if ($content -match 'red-50') {
        $content = $content -replace 'red-50', 'amber-50'
        $changed = $true
    }

    if ($changed) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "Updated: $($file.Name)"
    }
}

Write-Host "`nColor replacement complete!"
