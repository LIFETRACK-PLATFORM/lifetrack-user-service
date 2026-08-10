pipeline {
  agent any

  options {
    disableConcurrentBuilds()
  }

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
        sh "docker buildx build --builder lifetrack-builder --provenance=false --sbom=false -t user-service:latest --load ."
      }
    }
  }

  post {
    always {
      sh 'docker image prune -af || true'
      sh 'docker buildx prune -af --builder lifetrack-builder || true'
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
