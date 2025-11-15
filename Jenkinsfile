pipeline {
    agent { label 'ec2' }

    environment {
        SLACK_CHANNEL = '#test'
        IMAGE_NAME = 'mo7iiee/devops:latest'
    }

    stages {

        stage("CI - Build & Push Docker Image") {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'Dockerhub', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                        slackSend(channel: SLACK_CHANNEL, message: "🛠️ CI started: Building Docker Image...")

                        // Build the Docker image locally
                        sh "docker build -t $IMAGE_NAME ."

                        // Login to Docker Hub and push the image
                        sh "echo $PASS | docker login -u $USER --password-stdin"
                        sh "docker push $IMAGE_NAME"

                        slackSend(channel: SLACK_CHANNEL, message: "✅ Docker Image pushed to DockerHub!")
                    }
                }
            }
        }

        stage("CD - Deploy with Docker Compose") {
            steps {
                script {
                    slackSend(channel: SLACK_CHANNEL, message: "🚀 Deployment started...")

                    sh 'docker-compose down || true'
                    sh 'docker-compose up -d --pull always --remove-orphans'

                    slackSend(channel: SLACK_CHANNEL, message: "🎉 Deployment completed successfully!")
                }
            }
        }
    }

    post {
        success {
            slackSend(channel: SLACK_CHANNEL, message: "✅ Pipeline completed successfully!")
        }
        failure {
            slackSend(channel: SLACK_CHANNEL, message: "❌ Pipeline failed! Check Jenkins console logs.")
        }
    }
}
