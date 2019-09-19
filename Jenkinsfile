pipeline {
  agent any
  environment {
    CI = 'true'
  }
  stages {
    stage('Build') {
      steps {
        sh 'npm install'
        sh 'npm run build:frontend'
        sh 'npm run build:backend'
      }
    }
    stage('Test') {
      steps {
        echo 'Test'
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
        sh 'sshpass -p $TOURNEYGENPASSWORD scp -r -oStrictHostKeyChecking=no $WORKSPACE/Dockerfile tourneygen@$SERVER:$TOURNEYGENBACKLOCATION'
        sh 'sshpass -p $TOURNEYGENPASSWORD scp -r -oStrictHostKeyChecking=no $WORKSPACE/docker-compose.yml tourneygen@$SERVER:$TOURNEYGENBACKLOCATION'
        sh 'sshpass -p $TOURNEYGENPASSWORD scp -r -oStrictHostKeyChecking=no $WORKSPACE/package.json tourneygen@$SERVER:$TOURNEYGENBACKLOCATION'
      }
    }
  }
}
