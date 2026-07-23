$files = @(
    "d:\MicroserviceECom\product-service\src\main\resources\application.yml",
    "d:\MicroserviceECom\order-service\src\main\resources\application.yml",
    "d:\MicroserviceECom\inventory-service\src\main\resources\application.yml"
)
foreach ($f in $files) {
    $content = Get-Content $f -Raw
    $content = $content -replace 'jdbc:postgresql://localhost:5432/ecom_db', 'jdbc:mysql://localhost:3306/ecom_db'
    
    # Also replace PostgreSQLDialect with MySQLDialect if it exists
    $content = $content -replace 'org.hibernate.dialect.PostgreSQLDialect', 'org.hibernate.dialect.MySQLDialect'
    
    Set-Content -Path $f -Value $content
}
Write-Host "Updated application.yml files for MySQL"
