#!/bin/bash

# Usage: ./script.sh dev|prod
MODE=$1
BRANCH=$2

# Check if a mode (dev or prod) and git branch-name are provided
if [ -z "$MODE" ] || [ -z "$BRANCH" ]; then
  echo "Usage: $0 dev|prod git-branch-name"
  exit 1
fi

# Change directory to the NodeJS code folder
cd adherelive-be || { echo "NodeJS code folder not found!"; exit 1; }

# Pull latest changes from git
git restore .
git checkout "$BRANCH"
git status
git pull origin "$BRANCH"

# Prompt user for confirmation
read -r -p "Do you want to continue with the deployment? (yes/no): " confirmation
if [ "$confirmation" != "yes" ]; then
  echo "Deployment cancelled."
  exit 0
fi

# Copy file from FolderA to root and rename to .env
if [ "$MODE" = "prod" ]; then
  cp env_files/.node_env_prod .env || { echo "Failed to copy .env file!"; exit 1; }
  cp docker/DockerfileProd Dockerfile || { echo "Failed to copy Dockerfile!"; exit 1; }
fi

# Copy file from FolderB to root and rename to Dockerfile (overwrite)
if [ "$MODE" = "dev" ]; then
  cp env_files/.node_env_demo .env
  cp docker/DockerfileDemo Dockerfile
fi

# Create a shell variable and pass the value of 'git rev-parse HEAD'
COMMIT_HASH=$(git rev-parse HEAD)

# Display the value of the variable
echo "Current git revision: $COMMIT_HASH"

# Change value in package.json if mode is 'prod'
if [ "$MODE" = "prod" ]; then
  sed -i 's/4096/8192/' package.json || { echo "Failed to update package.json!"; exit 1; }
fi

# Build docker image for Production mode
if [ "$MODE" = "prod" ]; then
  docker image build --no-cache -f Dockerfile -t adherelive-be:prod --build-arg COMMIT_HASH=$COMMIT_HASH . || { echo "Failed to build Docker image for NodeJS!"; exit 1; }
  docker inspect adherelive-be:prod | grep commit_hash
fi

# Build docker image for Development mode
if [ "$MODE" = "dev" ]; then
  docker image build -f Dockerfile -t adherelive-be:dev --build-arg COMMIT_HASH=$COMMIT_HASH . || { echo "Failed to build Docker image for NodeJS!"; exit 1; }
  docker inspect adherelive-be:dev | grep commit_hash
fi

# Change directory to the React UI folder and repeat steps
cd ../adherelive-fe || { echo "React code folder not found!"; exit 1; }

# Repeat Steps for building the React UI image
# Pull latest changes from git
git restore .
git checkout "$BRANCH"
git status
git pull origin "$BRANCH"

# Prompt user for confirmation
read -r -p "Do you want to continue with the deployment? (yes/no): " confirmation
if [ "$confirmation" != "yes" ]; then
  echo "Deployment cancelled."
  exit 0
fi

# Copy file from FolderA to root and rename to .env
if [ "$MODE" = "prod" ]; then
  cp env_files/.env_prod .env
  cp docker/DockerfileProd Dockerfile
fi

# Copy file from FolderB to root and rename to Dockerfile (overwrite)
if [ "$MODE" = "dev" ]; then
  cp env_files/.env_demo .env
  cp docker/DockerfileDemo Dockerfile
fi

# Create a shell variable and pass the value of 'git rev-parse HEAD'
COMMIT_HASH=$(git rev-parse HEAD)

# Display the value of the variable
echo "Current git revision: $COMMIT_HASH"

# Build docker image for Production mode
if [ "$MODE" = "prod" ]; then
  docker image build --no-cache -f Dockerfile -t adherelive-fe:prod --build-arg COMMIT_HASH=$COMMIT_HASH . || { echo "Failed to build Docker image for React UI!"; exit 1; }
  docker inspect adherelive-fe:prod | grep commit_hash
fi

# Build docker image for Development mode
if [ "$MODE" = "dev" ]; then
  docker image build -f Dockerfile -t adherelive-fe:dev --build-arg COMMIT_HASH=$COMMIT_HASH . || { echo "Failed to build Docker image for React UI!"; exit 1; }
  docker inspect adherelive-fe:dev | grep commit_hash
fi

# Handle docker stack for 'dev' mode
if [ "$MODE" = "dev" ]; then
  # Clear current running docker stack
  cd .. || exit
  docker stack rm ald
  
  # Wait for 10 seconds
  sleep 10
  
  # Create docker stack
  docker stack deploy -c docker-stack.yml ald --detach=false
  
  # Wait for 20 seconds
  sleep 20

  # Display logs from container named 'be:dev'
  CONTAINER_ID=$(docker ps -qf "name=ald_backend")
  docker logs "$CONTAINER_ID"

# Handle docker service for 'prod' mode
elif [ "$MODE" = "prod" ]; then
  # Update docker service for both built images
  docker service update --image adherelive-be:prod wnx89lt1t7o0
  docker service update --image adherelive-fe:prod 5dk4g65pch2k
  
  # Wait for 5 seconds
  sleep 5
  
  # Display logs from container named 'be:dev'
  CONTAINER_ID=$(docker ps -qf "name=sweet_ramanujan")
  docker logs "$CONTAINER_ID"
fi

# Display all docker containers
docker ps -a