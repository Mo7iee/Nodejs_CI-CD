pipeline {
    agent { label 'ec2' }

    environment {
        SLACK_CHANNEL = '#test'
    }

    stages {

        stage("CI - Build & Push Docker Image") {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'Dockerhub', passwordVariable: 'PASS', usernameVariable: 'USER')]) {
                        slackSend(channel: SLACK_CHANNEL, message: "🛠️ CI started: Building Docker Image...")
                        
                        sh 'docker build -t mo7iiee/devops:latest .'
                        sh "echo $PASS | docker login -u $USER --password-stdin"
                        sh 'docker push mo7iiee/devops:latest'

                        slackSend(channel: SLACK_CHANNEL, message: "✅ Docker Image pushed to DockerHub!")
                    }
                }
            }
        }

        stage("CD - Run Application") {
            steps {
                script {
                    slackSend(channel: SLACK_CHANNEL, message: "🚀 Deployment started...")

                    sh 'docker-compose down || true'
                    sh 'docker pull mo7iiee/devops:latest || true'
                    sh 'docker-compose up -d'

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