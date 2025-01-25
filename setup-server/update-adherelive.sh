#!/bin/bash

# Usage: ./script.sh dev|prod
MODE=$1

# Check if a mode (dev or prod) is provided
if [ -z "$MODE" ]; then
  echo "Usage: $0 dev|prod"
  exit 1
fi

# Change directory to FolderBE
cd adherelive-be || exit

# Step 1: Pull latest changes from git
git restore .
git checkout development
git status
git pull origin development

# Prompt user for confirmation
read -p "Do you want to continue with the deployment? (yes/no): " confirmation
if [ "$confirmation" != "yes" ]; then
  echo "Deployment cancelled."
  exit 0
fi

# Step 2: Copy file from FolderA to root and rename to .env
if [ "$MODE" = "prod" ]; then
  cp env_files/.node_env_prod .env
  cp docker/DockerfileProd Dockerfile
fi

# Step 3: Copy file from FolderB to root and rename to Dockerfile (overwrite)
if [ "$MODE" = "dev" ]; then
  cp env_files/.node_env_demo .env
  cp docker/DockerfileDemo Dockerfile
fi

# Step 4: Create a shell variable and pass the value of 'git rev-parse HEAD'
COMMIT_HASH=$(git rev-parse HEAD)

# Step 5: Display the value of the variable
echo "Current git revision: $COMMIT_HASH"

# Step 6: Change value in package.json if mode is 'prod'
if [ "$MODE" = "prod" ]; then
  sed -i 's/4096/8192/' package.json
fi

# Step 7: Build docker image for Production mode
if [ "$MODE" = "prod" ]; then
  docker image build --no-cache -f Dockerfile -t adherelive-be:prod --build-arg COMMIT_HASH=$COMMIT_HASH .
fi

# Step 7: Build docker image for Development mode
if [ "$MODE" = "dev" ]; then
  docker image build -f Dockerfile -t adherelive-be:dev --build-arg COMMIT_HASH=$COMMIT_HASH .
fi

# Step 8: Change directory to FolderFE and repeat steps
cd ../adherelive-fe || exit

# Repeat Steps 1-5 & Step 7
# Step 1: Pull latest changes from git
git restore .
git checkout development
git status
git pull origin development

# Prompt user for confirmation
read -p "Do you want to continue with the deployment? (yes/no): " confirmation
if [ "$confirmation" != "yes" ]; then
  echo "Deployment cancelled."
  exit 0
fi

# Step 2: Copy file from FolderA to root and rename to .env
if [ "$MODE" = "prod" ]; then
  cp env_files/.env_prod .env
  cp docker/DockerfileProd Dockerfile
fi

# Step 3: Copy file from FolderB to root and rename to Dockerfile (overwrite)
if [ "$MODE" = "dev" ]; then
  cp env_files/.env_demo .env
  cp docker/DockerfileDemo Dockerfile
fi

# Step 4: Create a shell variable and pass the value of 'git rev-parse HEAD'
COMMIT_HASH=$(git rev-parse HEAD)

# Step 5: Display the value of the variable
echo "Current git revision: $COMMIT_HASH"

# Step 7: Build docker image for Production mode
if [ "$MODE" = "prod" ]; then
  docker image build --no-cache -f Dockerfile -t adherelive-fe:prod --build-arg COMMIT_HASH=$COMMIT_HASH .
fi

# Step 7: Build docker image for Development mode
if [ "$MODE" = "dev" ]; then
  docker image build -f Dockerfile -t adherelive-fe:dev --build-arg COMMIT_HASH=$COMMIT_HASH .
fi

# Step 9 and Step 12: Handle docker stack for 'dev' mode
if [ "$MODE" = "dev" ]; then
  # Clear current running docker stack
  cd .. || exit
  docker stack rm ald
  
  # Wait for 10 seconds
  sleep 10
  
  # Create docker stack
  docker stack deploy -c docker-stack.yml ald --detach=false
  
  # Wait for 5 seconds
  sleep 5
  
  # Step 13: Display all docker containers
  docker ps -a

  # Display logs from container named 'be:dev'
  CONTAINER_ID=$(docker ps -qf "name=ald_backend")
  docker logs $CONTAINER_ID

# Step 10 and Step 14: Handle docker service for 'prod' mode
elif [ "$MODE" = "prod" ]; then
  # Update docker service for both built images
  docker service update --image adherelive-be:prod wnx89lt1t7o0
  docker service update --image adherelive-fe:prod 5dk4g65pch2k
  
  # Wait for 10 seconds
  sleep 10

  # Step 13: Display all docker containers
  docker ps -a
  
  # Display logs from container named 'be:dev'
  CONTAINER_ID=$(docker ps -qf "name=sweet_ramanujan")
  docker logs $CONTAINER_ID
fi
