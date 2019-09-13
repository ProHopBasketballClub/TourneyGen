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
        sh 'cp web/frontend/src web/frontend/html -r'
        sh 'rm -r web/frontend/src'
        sh 'sshpass -p $TOURNEYGENPASSWORD scp -r -oStrictHostKeyChecking=no $WORKSPACE/web/frontend/html tourneygen@$SERVER:$TOURNEYGENFRONTLOCATION'
        sh 'sshpass -p $TOURNEYGENPASSWORD scp -r -oStrictHostKeyChecking=no $WORKSPACE/web/backend/ tourneygen@$SERVER:$TOURNEYGENBACKLOCATION'
      }
    }
  }
}
