$ErrorActionPreference = "Stop"

Write-Host "Starting Infrastructure..."
docker-compose up -d

Write-Host "Wait 15 seconds for infrastructure to boot..."
Start-Sleep -Seconds 15

Write-Host "Building microservices..."
mvn clean install -DskipTests

Write-Host "To run the services, you can open separate terminals and run 'mvn spring-boot:run' in each directory:"
Write-Host "1. cd discovery-server && mvn spring-boot:run"
Write-Host "2. cd api-gateway && mvn spring-boot:run"
Write-Host "3. cd product-service && mvn spring-boot:run"
Write-Host "4. cd inventory-service && mvn spring-boot:run"
Write-Host "5. cd order-service && mvn spring-boot:run"

Write-Host "To run the frontend, open a terminal and run:"
Write-Host "cd frontend && npm install && npm run dev"
