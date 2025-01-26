#!/bin/bash

# Usage: ./script.sh dev|prod git-branch-name [--auto-yes]
MODE=$1
BRANCH=$2
AUTO_YES=$3

# Validate input parameters
if [ -z "$MODE" ] || [ -z "$BRANCH" ]; then
  echo "Usage: $0 dev|prod git-branch-name [--auto-yes]"
  exit 1
fi

# Define paths and variables
ENV_FILES_DIR="./env_files"
DOCKER_FILES_DIR="./docker"
DOCKER_STACK_NAME="ald"
DOCKER_SERVICE_BE="wnx89lt1t7o0"
DOCKER_SERVICE_FE="5dk4g65pch2k"

# Define a function to handle common git steps
git_common_steps() {
  local folder=$1
  cd adherelive-"$folder" || cd ../adherelive-"$folder" || { echo "$folder code folder not found!"; exit 1; }

  # Pull latest changes from git
  git restore .
  git checkout "$BRANCH"
  git status
}

# Define a function to handle common build steps
build_common_steps() {
  local folder=$1
  local env_file
  local docker_file

  # If user goes ahead with the build, then pull the latest changes
  git pull origin "$BRANCH" || { echo "Failed to pull latest changes!"; exit 1; }

  # Determine the appropriate env and Dockerfile based on the folder and mode
  if [ "$MODE" = "prod" ]; then
    docker_file="DockerfileProd"
    [ "$folder" = "be" ] && env_file=".node_env_$MODE" || env_file=".env_$MODE"
  else
    docker_file="DockerfileDemo"
    [ "$folder" = "be" ] && env_file=".node_env_demo" || env_file=".env_demo"
  fi

  # Copy the determined env and Dockerfile
  cp "$ENV_FILES_DIR/$env_file" .env || { echo "Failed to copy .env file!"; exit 1; }
  cp "$DOCKER_FILES_DIR/$docker_file" Dockerfile || { echo "Failed to copy Dockerfile!"; exit 1; }

  # Create a shell variable and pass the value of 'git rev-parse HEAD'
  COMMIT_HASH=$(git rev-parse HEAD)

  # Display the value of the variable
  echo "Current git revision: $COMMIT_HASH"
}

# Define a function to handle common deploy steps
deploy_common_steps() {
  local folder=$1

  # Build docker image
  docker image build --no-cache -f Dockerfile -t adherelive-"$folder:$MODE" --build-arg COMMIT_HASH="$COMMIT_HASH" . || { echo "Failed to build Docker image for $folder!"; exit 1; }
  docker inspect adherelive-"$folder:$MODE" | grep commit_hash
}

# Define a function to handle Docker logs
display_docker_logs() {
  local container_name=$1
  CONTAINER_ID=$(docker ps -qf "name=$container_name")
  docker logs "$CONTAINER_ID" || { echo "Failed to display logs for container named $container_name!"; exit 1; }
}

# Define a function to prompt user for confirmation
prompt_user() {
  local folder=$1
  if [ "$AUTO_YES" == "--auto-yes" ]; then
    echo "yes"
  else
    # Prompt user for confirmation for running the deployment
    read -r -p "Do you want to continue with the $folder deployment? (yes/no): " response
    echo "$response"
  fi
}

# Deploy NodeJS and React UI
for folder in "be" "fe"; do
  git_common_steps "$folder"
  if [ "$(prompt_user "$folder")" = "yes" ]; then
    build_common_steps "$folder"
    deploy_common_steps "$folder"
  fi
done

# Handle Docker stack or service based on mode
if [ "$MODE" = "dev" ]; then
  # Clear current running docker stack
  cd .. || exit
  docker stack rm "$DOCKER_STACK_NAME" || { echo "Failed to remove Docker stack!"; exit 1; }

  # Wait for 10 seconds
  sleep 10

  # Create docker stack
  docker stack deploy -c docker-stack.yml "$DOCKER_STACK_NAME" --detach=false || { echo "Failed to deploy Docker stack!"; exit 1; }

  # Wait for 20 seconds
  sleep 20

  # Display logs from container named 'ald_backend'
  display_docker_logs "ald_backend"

  # Clean up Docker system
  sleep 15
  docker system prune -af --volumes

# Handle docker service for 'prod' mode
elif [ "$MODE" = "prod" ]; then
  # Update docker service for both built images
  docker service update --image adherelive-be:prod "$DOCKER_SERVICE_BE"
  docker service update --image adherelive-fe:prod "$DOCKER_SERVICE_FE"

  # Wait for 5 seconds
  sleep 5

  # Display logs from container named 'sweet_ramanujan'
  display_docker_logs "sweet_ramanujan"

  # Clean up Docker system, but not the images
  sleep 15
  docker system prune -f --volumes

  echo "Deployment completed successfully! Remember to restart the server to apply changes."
fi

# Display all Docker containers
docker ps -a || { echo "Failed to list Docker containers!"; exit 1; }
