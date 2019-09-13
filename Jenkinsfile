pipeline {
  agent any
  environment {
    CI = 'true'
  }
  stages {
    stage('Build') {
      steps {
        sh 'tsc'
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
        sh 'sshpass -p $TOURNEYGENPASSWORD scp -r -oStrictHostKeyChecking=no $WORKSPACE/dist/ tourneygen@$SERVER:$TOURNEYGENFRONTLOCATION'
        sh 'sshpass -p $TOURNEYGENPASSWORD scp -r -oStringHostKeyChecking=no $WORKSPACE/backend/ tourneygen@$SERVER:$TOURNEYGENBACKLOCATION'
      }
    }
  }
}
