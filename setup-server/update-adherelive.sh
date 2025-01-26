#!/bin/bash

# Usage: ./script.sh dev|prod
MODE=$1
BRANCH=$2
AUTO_YES=$3

# Check if a mode (dev or prod) and git branch-name are provided
if [ -z "$MODE" ] || [ -z "$BRANCH" ]; then
  echo "Usage: $0 dev|prod git-branch-name [--auto-yes]"
  exit 1
fi

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
    if [ "$folder" = "be" ]; then
      env_file=".node_env_$MODE"
    else
      env_file=".env_$MODE"
    fi
  elif [ "$MODE" = "dev" ]; then
    docker_file="DockerfileDemo"
    if [ "$folder" = "be" ]; then
      env_file=".node_env_demo"
    else
      env_file=".env_demo"
    fi
  fi

  # Copy the determined env and Dockerfile
  cp "./env_files/$env_file" .env || { echo "Failed to copy .env file!"; exit 1; }
  cp "./docker/$docker_file" Dockerfile || { echo "Failed to copy Dockerfile!"; exit 1; }

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

# NodeJS deployment
git_common_steps "be"
# Check if auto-yes option is enabled
if [ "$AUTO_YES" == "--auto-yes" ]; then
  next_steps_node="yes"
else
  # Prompt user for confirmation for NodeJS steps
  read -r -p "Do you want to continue with the NodeJS deployment? (yes/no): " next_steps_node
fi
if [ "$next_steps_node" = "yes" ]; then
  build_common_steps "be"
  deploy_common_steps "be"
fi

# React UI deployment
git_common_steps "fe"
# Check if auto-yes option is enabled
if [ "$AUTO_YES" == "--auto-yes" ]; then
  next_steps_react="yes"
else
  # Prompt user for confirmation for React UI steps
  read -r -p "Do you want to continue with the React UI deployment? (yes/no): " next_steps_react
fi
if [ "$next_steps_react" = "yes" ]; then
  build_common_steps "fe"
  deploy_common_steps "fe"
fi

# Handle docker stack for 'dev' mode
if [ "$MODE" = "dev" ]; then
  # Clear current running docker stack
  cd .. || exit
  docker stack rm ald || { echo "Failed to remove Docker stack!"; exit 1; }

  # Wait for 10 seconds
  sleep 10

  # Create docker stack
  docker stack deploy -c docker-stack.yml ald --detach=false || { echo "Failed to deploy Docker stack!"; exit 1; }

  # Wait for 20 seconds
  sleep 20

  # Display logs from container named 'ald_backend'
  display_docker_logs "ald_backend"

# Handle docker service for 'prod' mode
elif [ "$MODE" = "prod" ]; then
  # Update docker service for both built images
  docker service update --image adherelive-be:prod wnx89lt1t7o0
  docker service update --image adherelive-fe:prod 5dk4g65pch2k

  # Wait for 5 seconds
  sleep 5

  # Display logs from container named 'sweet_ramanujan'
  display_docker_logs "sweet_ramanujan"
  echo "Deployment completed successfully! Remember to restart the server to apply changes."
fi

# Purge all the previous Docker files and images
sleep 15
docker system prune -af --volumes

# Display all docker containers
docker ps -a || { echo "Failed to list Docker containers!"; exit 1; }
