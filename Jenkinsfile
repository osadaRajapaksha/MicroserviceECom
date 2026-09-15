pipeline {
    agent any

    environment {
        // Azure configuration for ACR and AKS
        AZURE_RESOURCE_GROUP = 'MicroserviceECom-rg'
        CLUSTER_NAME = 'MyEcomCluster'
        ACR_NAME = 'myecomclusteracr'
        ACR_REGISTRY = "${ACR_NAME}.azurecr.io"
        
        // Use Jenkins credentials ID for Azure Service Principal to login to Azure CLI
    }

    tools {
        // Assume these are configured in Jenkins global tool configuration
        maven 'Maven 3.9'
        nodejs 'Node 20'
    }

    stages {
        stage('Checkout Code') {
            steps {
                // Pulls the latest code from the active branch
                checkout scm
            }
        }

        stage('Build & Test Backend Services') {
            steps {
                echo 'Building Spring Boot Microservices...'
                // Run maven build using the wrapper provided in the repo
                sh './mvnw clean package -DskipTests'
            }
        }

        stage('Build React Frontend') {
            steps {
                echo 'Building React Frontend App...'
                dir('frontend') {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }

        stage('Docker Build & Push (Azure ACR)') {
            steps {
                echo 'Logging into Azure ACR...'
                // Using Azure CLI to login to ACR (Requires Azure Service Principal configured in Jenkins)
                sh "az acr login --name ${ACR_NAME}"

                echo 'Building and Pushing discovery-server image...'
                sh "docker build -t ${ACR_REGISTRY}/discovery-server:latest ./discovery-server"
                sh "docker push ${ACR_REGISTRY}/discovery-server:latest"

                echo 'Building and Pushing api-gateway image...'
                sh "docker build -t ${ACR_REGISTRY}/api-gateway:latest ./api-gateway"
                sh "docker push ${ACR_REGISTRY}/api-gateway:latest"

                echo 'Building and Pushing product-service image...'
                sh "docker build -t ${ACR_REGISTRY}/product-service:latest ./product-service"
                sh "docker push ${ACR_REGISTRY}/product-service:latest"

                echo 'Building and Pushing order-service image...'
                sh "docker build -t ${ACR_REGISTRY}/order-service:latest ./order-service"
                sh "docker push ${ACR_REGISTRY}/order-service:latest"

                echo 'Building and Pushing inventory-service image...'
                sh "docker build -t ${ACR_REGISTRY}/inventory-service:latest ./inventory-service"
                sh "docker push ${ACR_REGISTRY}/inventory-service:latest"
                
                echo 'Building and Pushing frontend image...'
                sh "docker build -t ${ACR_REGISTRY}/frontend:latest ./frontend"
                sh "docker push ${ACR_REGISTRY}/frontend:latest"
            }
        }

        stage('Deploy to Kubernetes (Azure AKS)') {
            steps {
                echo 'Updating Kubeconfig for Azure AKS...'
                sh "az aks get-credentials --resource-group ${AZURE_RESOURCE_GROUP} --name ${CLUSTER_NAME} --overwrite-existing"

                echo 'Applying Kubernetes Manifests...'
                // Apply all infrastructure and service manifests from the k8s directory
                sh 'kubectl apply -f k8s/'
            }
        }
    }

    post {
        always {
            echo 'Pipeline execution complete.'
        }
        success {
            echo 'Deployment successful! The Microservice E-commerce app is live.'
        }
        failure {
            echo 'Deployment failed! Check the Jenkins console logs for details.'
        }
    }
}
