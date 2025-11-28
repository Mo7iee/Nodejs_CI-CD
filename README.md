# Deploying a node.js app on AWS using Jenkins&Ansible
<img width="1162" height="918" alt="Finalllllllllll drawio" src="https://github.com/user-attachments/assets/6d483663-327e-48e4-897c-f5b6f2032c70" />


## Project Description
This projects sets up a complete CI/CD pipeline for a Node.js app on AWS. The application integrates with MongoDB for persistent storage and Redis, provisioned via AWS ElastiCache, for secure in-memory caching. The project architecture features a private EC2 instance configured as a Jenkins slave using an Ansible script, with SSH tunneling through a bastion host to securely run builds in private subnets. Docker handles containerization, The CI stage builds and pushes the Docker image to Dockerhub, and CD stage pulls the image and deploys it on the EC2. The application can be externally accessed by via the Application Load Balancer URL. Finally, Slack notifications are integrated into the Jenkins pipeline to provide real-time updates on build, push, and deployment events. 

---
## Repositories
**Infrastructure Repo:** <br>
https://github.com/Mo7iee/IaC-Terraform <br>
**Node.js App Repo:** <br>
https://github.com/Mo7iee/eCommerceBackend-Nodejs

---
## Deployment Steps
### 1. Clone the Repository
```bash
git clone https://github.com/Mo7iee/Nodejs_CI-CD.git
```
### 2. Run Jenkins container with Docker CLI and Docker socket mounted
```bash
docker run -d --name jenkins -p 8080:8080 -v jenkins_home:/var/jenkins_home -v /var/run/docker.sock:/var/run/docker.sock -v /usr/bin/docker:/usr/bin/docker jenkins/jenkins:lts
```
Open Jenkins in your browser:
```bash
http://localhost:8080
```
Retrieve the admin password from inside the container:
```bash
docker exec -it jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```
Create your admin user.
### 3. Configure the private ec2 named 'Jenkins-Slave' as a Jenkins agent by running the ansible script
The ansible script installs jdk, Docker, and creates a Jenkins directory. 
```bash
cd ansible
ansible-playbook -i inventory jenkins-slave.yml
```
### 4. Create SSH tunnel from inside the Jenkins container to the Bastion host
First, You need to copy the SSH key into the Jenkins container:
```bash
docker cp ~/.ssh/key.pem jenkins:/var/jenkins_home/key.pem
```
Set correct permissions inside the container:
```bash
docker exec -it jenkins bash -c "chmod 600 /var/jenkins_home/key.pem"
```
Enter the Jenkins container:
```bash
docker exec -it jenkins bash
```
Create a tunnel to the Bastion:
```bash
 ssh -i /var/jenkins_home/.ssh/key.pem \
    -N -f \
    -L 2222:<jenkins-slave-private-ip>:22 \
    -o "StrictHostKeyChecking=no" \
    ubuntu@<bastion-public-ip>
```
This forwards the local port 2222 in the Jenkins container to port 22 on the Jenkins Slave through the tunnel
You can now SSH directly to the Jenkins Slave from inside the Jenkins container:
```bash
ssh -i /var/jenkins_home/key.pem -p 2222 ubuntu@localhost
```
### 5. Manually configure a New Node (Jenkins Slave) via Jenkins UI
Open Jenkins in your browser:
```bash
http://localhost:8080
```
Create a new node and name it "ec2", choose "Launch agents via SSH" as a launch method, set the Host as "localhost" and the Port as "2222". <br><br>

![d04724f6-9e70-42a7-a1a1-e147e7b7b5cf](https://github.com/user-attachments/assets/03bf65d2-7047-4b4a-b12a-0354556b82bb)

![c33588e5-601d-4c3a-87e6-1bb1e765eb31](https://github.com/user-attachments/assets/6f0ab5d3-00da-42ed-826b-019f70b9c011)

### 6. Run Jenkins Pipeline and ensure that Slack plugin is installed
![6a37ba8a-3f1f-4bfa-9a7f-7422cba006d0](https://github.com/user-attachments/assets/7dca8b87-b517-45f6-924b-68c719ed9340)

### 7. Verify Pipeline stages on Slack
![2ad3aabc-d23d-4b60-916d-d7af1e8bf804](https://github.com/user-attachments/assets/e3bf8548-f617-4161-8bde-c40263ae516e)

### 8. Access the deployed Node.js app via the Application Load Balancer URL.
![c85ab9c5-d95d-4e41-8ab7-84ad7aea080f](https://github.com/user-attachments/assets/f32c00ec-5da7-4663-8507-616ab16db50e)






