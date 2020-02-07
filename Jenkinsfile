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
        sh 'echo $SWAGGER_USER'
        sh 'docker-compose build'
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
      }
    }
    stage('Master-Deploy') {
      when {
        expression { env.BRANCH_NAME == 'master' }
      }
      steps {
        sh 'sshpass -p $TOURNEYGENPASSWORD scp -r -oStrictHostKeyChecking=no $WORKSPACE/* tourneygen@$SERVER:$TOURNEYGENLOCATION/'
        sh 'sshpass -p $TOURNEYGENPASSWORD ssh -oStrictHostKeyChecking=no tourneygen@$SERVER "(cd $TOURNEYGENLOCATION/ && docker-compose down)"'
        // Build the whole app, then rebuild the frontend with the correct args. Its gross, required by version on server.
        sh 'sshpass -p $TOURNEYGENPASSWORD ssh -oStrictHostKeyChecking=no tourneygen@$SERVER "(cd $TOURNEYGENLOCATION/ && docker-compose build && docker-compose build --build-arg ENVIRONMENT=prod app_frontend && docker-compose up -d)"'
      }
    }
  }
}
