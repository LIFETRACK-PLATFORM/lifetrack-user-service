pipeline {
  agent any

  tools {
    nodejs "NodeJS-20"
  }

  stages {
    stage("Install") {
      steps {
        sh "npm install -g pnpm@10.21.0"
        sh "pnpm install --frozen-lockfile"
      }
    }

    stage("Lint") {
      steps {
        sh "pnpm run lint"
      }
    }

    stage("Test") {
      steps {
        sh "pnpm run test:cov"
      }
    }

    stage("Build") {
      steps {
        sh "pnpm run build"
      }
    }

    stage("Docker Build") {
      steps {
        sh "docker build -t user-service:${env.BUILD_NUMBER} ."
      }
    }

    stage("Deploy") {
      steps {
        sh "docker network create lifetrack-net || true"
        sh "docker stop user-service || true"
        sh "docker rm user-service || true"
        sh """
          docker run -d --name user-service \
            --network lifetrack-net \
            --restart unless-stopped \
            user-service:${env.BUILD_NUMBER}
        """
      }
    }
  }

  post {
    success {
      echo "Pipeline OK - user-service #${env.BUILD_NUMBER}"
    }
    failure {
      echo "Pipeline FAILED - user-service #${env.BUILD_NUMBER}"
    }
  }
}
