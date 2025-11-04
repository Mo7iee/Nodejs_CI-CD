# Deploying a node.js app on AWS using Jenkins&Ansible
<img width="1149" height="918" alt="AWStttt drawio" src="https://github.com/user-attachments/assets/1d16a1ec-9f1a-47be-9573-a56148ff62b5" />

## Project Description
This project sets up a complete CI/CD pipeline for a Node.js app on AWS. It features a private EC2 instance configured as a Jenkins slave using Ansible, with SSH tunneling through a bastion host to securely run builds in private subnets. Docker handles containerization, The CI stage builds and pushes the Docker image to Dockerhub, and CD stage pulls the image and deploys it on Auto Scaling Group. Finally, Slack notifications are integrated into the Jenkins pipeline to provide real-time updates on build, push, and deployment events.

- **Infrastructure Repo:**  
  https://github.com/Mo7iee/IaC-Terraform

- **Node.js App Repo:**  
  https://github.com/Mo7iee/eCommerceBackend-Nodejs


