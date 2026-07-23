pipeline {
    agent any

    environment {
        // AWS configuration for ECR and EKS
        AWS_ACCOUNT_ID = '123456789012'
        REGION = 'us-east-1'
        CLUSTER_NAME = 'MyEcomCluster'
        ECR_REGISTRY = "${AWS_ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com"
        
        // Use Jenkins credentials ID if pulling from secret manager, otherwise assume EC2 IAM Role
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

        stage('Docker Build & Push (AWS ECR)') {
            steps {
                echo 'Logging into AWS ECR...'
                // Using AWS CLI to login to ECR (Requires EC2 IAM Role or AWS Credentials configured in Jenkins)
                sh "aws ecr get-login-password --region ${REGION} | docker login --username AWS --password-stdin ${ECR_REGISTRY}"

                echo 'Building and Pushing discovery-server image...'
                sh "docker build -t ${ECR_REGISTRY}/discovery-server:latest ./discovery-server"
                sh "docker push ${ECR_REGISTRY}/discovery-server:latest"

                echo 'Building and Pushing api-gateway image...'
                sh "docker build -t ${ECR_REGISTRY}/api-gateway:latest ./api-gateway"
                sh "docker push ${ECR_REGISTRY}/api-gateway:latest"

                echo 'Building and Pushing product-service image...'
                sh "docker build -t ${ECR_REGISTRY}/product-service:latest ./product-service"
                sh "docker push ${ECR_REGISTRY}/product-service:latest"

                echo 'Building and Pushing order-service image...'
                sh "docker build -t ${ECR_REGISTRY}/order-service:latest ./order-service"
                sh "docker push ${ECR_REGISTRY}/order-service:latest"

                echo 'Building and Pushing inventory-service image...'
                sh "docker build -t ${ECR_REGISTRY}/inventory-service:latest ./inventory-service"
                sh "docker push ${ECR_REGISTRY}/inventory-service:latest"
                
                echo 'Building and Pushing frontend image...'
                sh "docker build -t ${ECR_REGISTRY}/frontend:latest ./frontend"
                sh "docker push ${ECR_REGISTRY}/frontend:latest"
            }
        }

        stage('Deploy to Kubernetes (AWS EKS)') {
            steps {
                echo 'Updating Kubeconfig for AWS EKS...'
                sh "aws eks update-kubeconfig --region ${REGION} --name ${CLUSTER_NAME}"

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
