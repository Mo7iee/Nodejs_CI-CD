pipeline {
    agent { label 'ec2' }
    
    stages {

        stage("CI - Build & Push Docker Image") {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'Dockerhub', passwordVariable: 'PASS', usernameVariable: 'USER')]) {

                        sh 'docker build -t mo7iiee/devops:latest .'
                        sh "echo $PASS | docker login -u $USER --password-stdin"
                        sh 'docker push mo7iiee/devops:latest'
                    }
                }
            }
        }

        stage("CD - Run Application") {
            steps {
                script {
                    sh 'docker pull mo7iiee/devops:latest'
                    sh 'docker rm -f node-app || true'
                    sh 'docker run --name node-app -p 3000:3000 -d mo7iiee/devops:latest'
                }
            }
        }
    }
}