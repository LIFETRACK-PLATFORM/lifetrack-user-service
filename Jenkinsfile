pipeline {
  agent any

  tools {
    nodejs "NodeJS-20"
  }

  stages {
    stage("Install") {
      steps {
        sh '''
          set -e
          corepack enable
          corepack prepare pnpm@10.21.0 --activate
          pnpm --version
          pnpm install --frozen-lockfile
        '''
      }
    }

    stage("Lint") {
      steps {
        sh '''
          set -e
          corepack enable
          pnpm run lint
        '''
      }
    }

    stage("Test") {
      steps {
        sh '''
          set -e
          corepack enable
          pnpm run test:cov
        '''
      }
    }

    stage("Build") {
      steps {
        sh '''
          set -e
          corepack enable
          pnpm run build
        '''
      }
    }

    stage("Docker Build") {
      steps {
        sh "docker build -t user-service:latest ."
      }
    }
  }

  post {
    always {
      sh 'docker image prune -f'
    }
    success {
      echo "Pipeline OK - user-service #${env.BUILD_NUMBER}"
      githubNotify credentialsId: 'github-token-userpass', status: 'SUCCESS', context: 'jenkins-ci', description: 'CI passed'
    }
    failure {
      echo "Pipeline FAILED - user-service #${env.BUILD_NUMBER}"
      githubNotify credentialsId: 'github-token-userpass', status: 'FAILURE', context: 'jenkins-ci', description: 'CI failed'
    }
  }
}
