$files = Get-ChildItem -Path . -Recurse -Filter 'pom.xml'
foreach ($f in $files) {
    $content = Get-Content $f.FullName -Raw
    $content = $content -replace '<groupId>org.postgresql</groupId>\s*<artifactId>postgresql</artifactId>\s*<scope>runtime</scope>', '<groupId>com.mysql</groupId><artifactId>mysql-connector-j</artifactId><scope>runtime</scope>'
    Set-Content -Path $f.FullName -Value $content
}
Write-Host "Replaced PostgreSQL with MySQL in POMs"
