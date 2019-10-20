pipeline {
  agent any
  environment {
    CI = 'true'
  }
  stages {
    stage('Master-Build-Setup') {
      when {
        expression { env.BRANCH_NAME == 'master'}
      }
      steps { 
        script {
          deploy_env="ENVIRONMENT=PROD\r\n"
          backend_location="BACKEND_LOCATION=tourneygen.api.theserverproject.com/Api/\r\n"
        }
        dir('web/frontend') {
            writeFile file: '.env', text: deploy_env + backend_location
        }
      }
    }
    stage('Build') {
      steps {
        sh 'npm install'
        sh 'npm run build:frontend'
        sh 'npm run build:backend'
      }
    }
    stage('Test') {
      steps {
        sh 'npm run test:frontend'
        sh 'npm run test:backend'
      }
    }
    stage('Master-Deploy') {
      when {
        expression { env.BRANCH_NAME == 'master' }
      }
      steps {
        sh 'mkdir web/frontend/html'
        sh 'mv web/frontend/src/* web/frontend/html'
        sh 'rm -r web/frontend/src'
        sh 'sshpass -p $TOURNEYGENPASSWORD scp -r -oStrictHostKeyChecking=no $WORKSPACE/web/frontend/html tourneygen@$SERVER:$TOURNEYGENFRONTLOCATION'
        sh 'sshpass -p $TOURNEYGENPASSWORD scp -r -oStrictHostKeyChecking=no $WORKSPACE/web/backend/ tourneygen@$SERVER:$TOURNEYGENBACKLOCATION/web/backend'
        sh 'sshpass -p $TOURNEYGENPASSWORD scp -r -oStrictHostKeyChecking=no $WORKSPACE/Dockerfile tourneygen@$SERVER:$TOURNEYGENBACKLOCATION/'
        sh 'sshpass -p $TOURNEYGENPASSWORD scp -r -oStrictHostKeyChecking=no $WORKSPACE/docker-compose.yml tourneygen@$SERVER:$TOURNEYGENBACKLOCATION/'
        sh 'sshpass -p $TOURNEYGENPASSWORD scp -r -oStrictHostKeyChecking=no $WORKSPACE/package.json tourneygen@$SERVER:$TOURNEYGENBACKLOCATION/'
        sh 'sshpass -p $TOURNEYGENPASSWORD ssh -oStrictHostKeyChecking=no tourneygen@$SERVER "(cd $TOURNEYGENBACKLOCATION/ && docker-compose down)"'
        sh 'sshpass -p $TOURNEYGENPASSWORD ssh -oStrictHostKeyChecking=no tourneygen@$SERVER "(cd $TOURNEYGENBACKLOCATION/ && docker-compose build && docker-compose up -d)"'
      }
    }
  }
}
