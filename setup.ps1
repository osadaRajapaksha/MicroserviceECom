$ErrorActionPreference = "Stop"

function Scaffold-Project {
    param (
        [string]$Name,
        [string]$Dependencies
    )
    Write-Host "Scaffolding $Name..."
    $Url = "https://start.spring.io/starter.zip?type=maven-project&javaVersion=17&groupId=com.microservice&artifactId=$Name&name=$Name&dependencies=$Dependencies"
    Invoke-WebRequest -Uri $Url -OutFile "$Name.zip"
    Expand-Archive -Path "$Name.zip" -DestinationPath $Name -Force
    Remove-Item "$Name.zip"
}

Scaffold-Project -Name "api-gateway" -Dependencies "cloud-gateway,data-redis-reactive,actuator"
Scaffold-Project -Name "product-service" -Dependencies "web,data-jpa,postgresql,cloud-eureka,actuator,lombok"
Scaffold-Project -Name "order-service" -Dependencies "web,data-jpa,postgresql,cloud-eureka,kafka,cloud-resilience4j,actuator,lombok"
Scaffold-Project -Name "inventory-service" -Dependencies "web,data-jpa,postgresql,cloud-eureka,kafka,actuator,lombok"

Write-Host "Done!"
