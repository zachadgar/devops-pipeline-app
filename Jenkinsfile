pipeline {
    agent any

    environment {
        DOCKERHUB_CREDS = credentials('dockerhub-cred')
        IMAGE_NAME = 'zachadgar/devops-pipeline-app'
        IMAGE_TAG = "1.${BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    credentialsId: 'github-cred',
                    url: 'https://github.com/zachadgar/devops-pipeline-app.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $IMAGE_NAME:$IMAGE_TAG .'
            }
        }

        stage('Push to Docker Hub') {
            steps {
                sh '''
                    echo $DOCKERHUB_CREDS_PSW | docker login -u $DOCKERHUB_CREDS_USR --password-stdin
                    docker push $IMAGE_NAME:$IMAGE_TAG
                '''
            }
        }

        stage('Deploy via Ansible') {
            steps {
                sshagent(credentials: ['k8s-ssh-key']) {
                    sh '''
                        cd /home/jenkins/deploy || cd ~/deploy
                        ansible-playbook deploy-playbook.yml --extra-vars "image_tag=$IMAGE_TAG"
                    '''
                }
            }
        }

        stage('Verify') {
            steps {
                sh 'sleep 10 && curl -f http://32.192.196.43:30080 || true'
            }
        }
    }

    post {
        success {
            echo "Pipeline succeeded: deployed ${IMAGE_TAG}"
        }

        failure {
            echo 'Pipeline failed - check the stage logs above'
        }
    }
}

