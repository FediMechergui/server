# CI Pipeline Documentation

## Project Overview

This document outlines the Continuous Integration (CI) pipeline setup for the project, utilizing Jenkins for CI automation. The pipeline is triggered by new pushes to the GitHub repository and includes several key stages: cloning the repository, code analysis with SonarQube, Docker image building, image scanning with Trivy, and pushing the image to Docker Hub. The tools required for the pipeline are run in containers using Docker Compose.

## Walkthrough

The following sections provide a step-by-step guide to create an effective CI pipeline.


# Installing Docker on Windows

## Step 1: Download Docker Desktop for Windows
1. Go to the [Docker Desktop for Windows download page](https://www.docker.com/products/docker-desktop).
2. Click on the **"Download Docker Desktop for Windows"** button.

## Step 2: Install Docker Desktop
1. Once the installer is downloaded, run it.
2. Follow the on-screen instructions to complete the installation.

    - Accept the license agreement.
    - Enable the **"Install required Windows components for WSL 2"** option if prompted.
    - Click **"Ok"** to continue with the installation.

## Step 3: Start Docker Desktop
1. After the installation is complete, Docker Desktop will automatically start.
2. You may be prompted to sign in to Docker Hub. If you do not have an account, you can create one for free.

## Step 4: Enable WSL 2 Backend
1. Open Docker Desktop.
2. Go to **Settings**.
3. Select the **"General"** tab.
4. Check the **"Use the WSL 2 based engine"** option.

## Step 5: Configure WSL 2
1. Open **PowerShell** as Administrator.
2. Set WSL 2 as the default version:
    ```
    wsl --set-default-version 2
    ```

## Step 6: Verify Installation
1. Open a **Command Prompt** or **PowerShell** window.
2. Run the following command to verify Docker is installed and running:
    ```
    docker --version
    ```
3. You should see the Docker version information displayed.

## Step 7: Test Docker Installation
1. Run the following command to test Docker by pulling and running a test container:
    ```
    docker run hello-world
    ```
2. You should see a message indicating that Docker is working correctly.

## Additional Resources
- [Docker Documentation](https://docs.docker.com/)
- [Docker Desktop for Windows Release Notes](https://docs.docker.com/desktop/release-notes/)

# Installing Jenkins and SonarQube with Docker

## Prerequisites
- Docker installed on your machine.

## Step 1: Pull Jenkins Docker Image
1. Open a **Command Prompt** or **PowerShell** window.
2. Run the following command to pull the Jenkins image from Docker Hub:
    ```
    docker pull jenkins/jenkins:lts
    ```

## Step 2: Run Jenkins Container
1. Create a directory on your host machine to store Jenkins data:
    ```
    mkdir -p jenkins_home
    ```
2. Run the following command to start the Jenkins container:
    ```
    docker run -d -p 8080:8080 -p 50000:50000 -v jenkins_home:/var/jenkins_home --name jenkins jenkins/jenkins:lts
    ```
    - This command maps port 8080 of your host to port 8080 of the Jenkins container.
    - It also maps port 50000 for Jenkins agent communication.
    - The `-v` option mounts the `jenkins_home` directory on your host to the container.

## Step 3: Access Jenkins
1. Open a web browser and go to `http://localhost:8080`.
2. Follow the on-screen instructions to unlock Jenkins using the password from the following command:
    ```
    docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
    ```
3. Complete the setup by installing suggested plugins and creating an admin user.

## Step 4: Install Necessary Jenkins Plugins
1. Go to **Manage Jenkins** > **Manage Plugins**.
2. Install the following plugins:
    - **Docker**: For running Docker commands.
    - **SonarQube Scanner**: For integrating with SonarQube.
    - **Trivy**: For running security scans using Trivy.
    - **Git**: For Git version control.
    - **NodeJS**: For building and running Node.js applications.
``` https://www.youtube.com/watch?v=yixrwzMz5-c ```

## Step 5: Pull SonarQube Docker Image
1. Run the following command to pull the SonarQube image from Docker Hub:
    ```
    docker pull sonarqube
    ```

## Step 6: Run SonarQube Container
1. Create a directory on your host machine to store SonarQube data:
    ```
    mkdir -p sonarqube_data
    ```
2. Run the following command to start the SonarQube container:
    ```
    docker run -d -p 9000:9000 -v sonarqube_data:/opt/sonarqube/data --name sonarqube sonarqube
    ```
    - This command maps port 9000 of your host to port 9000 of the SonarQube container.
    - The `-v` option mounts the `sonarqube_data` directory on your host to the container.

## Step 7: Access SonarQube
1. Open a web browser and go to `http://localhost:9000`.
2. Follow the on-screen instructions to set up SonarQube.
    - The default username is `admin` and the default password is `admin`.

## Additional Resources
- [Jenkins Documentation](https://www.jenkins.io/doc/)
- [SonarQube Documentation](https://docs.sonarqube.org/latest/)



**Step 1**: Launch the container
The first step is to launch all the containers with Docker Compose. To do this, clone the repo and go to the docker-compose folder. Then, type the following command:
```
$ sudo docker-compose up -d
```
**Step 2**: Configuration
The next step is to configure Jenkins and SonarQube. To do this, follow these steps:

* Install the necessary plugins in Jenkins.
* Change the login password for each tool. Some of them will prompt you to change the password after putting in the initial user and password.
* Integrate Github and Sonar with Jenkins:
****Github Credentials:
-    - Navigate to your Jenkins dashboard.
    - Go to **Manage Jenkins** > **Manage Credentials** (or **Manage Credentials** directly if available).
    - Select the appropriate domain (e.g., `Global` domain).
    - Click on **Add Credentials** on the left-hand side.
     *  select Type (user/password): username of github, Pat ..and give an Id name (githubtoken)
     
****Sonarqube Credentials:

Manage Jenkins > Manage Credentials-> Secret-> add the token generated in sonarqube project-> ID:sonarqube-token

**Step 3:** Jenkinsfile
To create a pipeline, you need to create a Jenkinsfile. You can create one Jenkinsfile for each pipeline you need, such as Continuous Integration Pipeline, Daily Pipeline, and Continuous Deployment Pipeline.

**Step 4:** Creating the Pipeline
To create the pipeline, follow these steps:

* Go to the main dashboard -> new item -> pipeline.

* Configure triggers if needed, but we won't dive into that here.

* Copy the text from the Jenkinsfile into the section.

* Apply and save.
# Second Method :  
# Configuring Jenkins and SonarQube Containers with Docker Compose

This guide will help you set up Jenkins and SonarQube containers using Docker Compose.

## Prerequisites

- Docker installed on your machine
- Docker Compose installed on your machine

## Docker Compose Configuration

Create a file named `docker-compose.yaml` and add the following configuration:

```yaml
services:
  jenkins:
    image: jenkins/jenkins:latest
    privileged: true
    user: root
    ports:
      - 8080:8080
    container_name: jenkins
    networks:
      devops:
        ipv4_address: 172.20.0.2
    volumes:
      - ~/jenkins_data:/var/jenkins_home
      - /var/run/docker.sock:/var/run/docker.sock

  sonarqube:
    image: sonarqube:lts-community
    container_name: sonarqube
    volumes:
      - sonarqube_data:/opt/sonarqube/data
      - sonarqube_extensions:/opt/sonarqube/extensions
      - sonarqube_logs:/opt/sonarqube/logs
    ports:
      - "9000:9000"
    networks:
      devops:
        ipv4_address: 172.20.0.3

volumes:
  sonarqube_data:
  sonarqube_extensions:
  sonarqube_logs:
  postgresql_data:

networks:
  devops:
    driver: bridge
    ipam:
      config:
        - subnet: 172.20.0.0/24
```


## Steps to Deploy the Containers

 **1.Navigate to the directory containing your `docker-compose.yaml` file:**

  ```
    cd /path/to/your/docker-compose-file

```

 **2.Deploy the containers:**

  ```
    docker-compose up -d
```

    This command will start the Jenkins and SonarQube containers in detached mode.

 **3.Verify the containers are running:**

```
    docker-compose ps
```

    You should see both Jenkins and SonarQube containers listed and running.

## Accessing the Services

- **Jenkins:** Open your browser and go to `http://localhost:8080`. You will be prompted to unlock Jenkins using a password found in the Jenkins container logs or at `~/jenkins_data/secrets/initialAdminPassword`.

- **SonarQube:** Open your browser and go to `http://localhost:9000`. The default login credentials are:
    - Username: `admin`
    - Password: `admin`

## Stopping the Containers

To stop the containers, run:

```
docker-compose down
```

## CI Pipeline Stages

### 1. Trigger

**Step:** `Trigger`

- **Description:** The CI pipeline is triggered by a new push to the GitHub repository. Jenkins listens for these events and initiates the pipeline accordingly.

### 2. Cloning the Repository

**Step:** `Clone Repository`

- **Description:** The pipeline starts by cloning the latest version of the code from the GitHub repository to the Jenkins workspace.
- **Jenkins Configuration:** Configure the Jenkins job to pull from the GitHub repository using appropriate credentials.

### 3. Code Analysis with SonarQube

**Step:** `Analyze Code`

- **Description:** After cloning the repository, the code is analyzed for quality and security issues using SonarQube.
- **SonarQube Configuration:** SonarQube is set up to analyze code according to predefined quality gates and rules.

### 4. Building Docker Image

**Step:** `Build Docker Image`

- **Description:** A Docker image is built from the Dockerfile located in the repository. This image contains the application's runtime environment.
- **Docker Configuration:** Ensure that Docker is installed and properly configured in the Jenkins environment to execute Docker commands.

### 5. Image Scanning with Trivy

**Step:** `Scan Docker Image`

- **Description:** The built Docker image is scanned for vulnerabilities using Trivy. This step helps ensure that the image is secure and free from known vulnerabilities.
- **Trivy Configuration:** Ensure that Trivy is installed in jenkins environment.


### 6. Pushing Docker Image to Docker Hub

**Step:** `Push Docker Image`

- **Description:** Once the Docker image passes the vulnerability scan, it is pushed to Docker Hub for distribution and deployment.
- **Docker Hub Configuration:** Ensure Jenkins has access to Docker Hub credentials for pushing the image.




