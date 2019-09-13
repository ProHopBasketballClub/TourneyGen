pipeline {
  agent any
  environment {
    CI = 'true'
  }
  stages {
    stage('Build') {
      steps {
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
        sh 'sshpass -p $TOURNEYGENPASSWORD scp -r -oStrictHostKeyChecking=no $WORKSPACE/web/frontend/src/ tourneygen@$SERVER:$TOURNEYGENFRONTLOCATION'
        sh 'sshpass -p $TOURNEYGENPASSWORD scp -r -oStringHostKeyChecking=no $WORKSPACE/web/backend/ tourneygen@$SERVER:$TOURNEYGENBACKLOCATION'
      }
    }
  }
}
