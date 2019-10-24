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
        sh 'npm install'
        sh 'npm run generate_coverage'
        sh './node_modules/.bin/codecov -t $CODECOVTOKEN'
      }
    }
    stage('Cleanup') {
      steps {
        sh 'npm run clean:frontend'
        sh 'npm run clean:backend'
      }
    }
    stage('Master-Deploy') {
      when {
        expression { env.BRANCH_NAME == 'master' }
      }
      steps {
        sh 'sshpass -p $TOURNEYGENPASSWORD scp -r -oStrictHostKeyChecking=no $WORKSPACE/* tourneygen@$SERVER:$TOURNEYGENLOCATION/'
        sh 'sshpass -p $TOURNEYGENPASSWORD ssh -oStrictHostKeyChecking=no tourneygen@$SERVER "(cd $TOURNEYGENLOCATION/ && docker-compose down)"'
        sh 'sshpass -p $TOURNEYGENPASSWORD ssh -oStrictHostKeyChecking=no tourneygen@$SERVER "(cd $TOURNEYGENLOCATION/ && docker-compose build --build-arg ENVIRONMENT=prod app_frontend && docker-compose up -d)"'
      }
    }
  }
}
