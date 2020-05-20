# For Development build
---

## Steps to build for Development

1. Build image
2. Run the image
3. Make sure .node_env is complete

**_Note: -If you have volume mounted see the "If you have volume mounted" section below_**

## 1. Build image

Start off by running docker-compose.yml using the command.

`docker-compose build node`

This will start building the docker image for the project. For a no cache build :-

`docker-compose build --no-cache node`

## 2. Run the image

After the image is build, we need to run the image by

`docker-compose up`

This will start the project along with Mysql and Minio stacks.

## 3. Make sure .node_env is complete

Compare .node_env with .node_env.example and .env with .env.example. If any key-value pair is missing in .node_env, copy it in from the .node_env.example.


---

### If you have volume mounted

If you're running the project first time. Run the following command

1. `docker-compose run node npm install`
2. `docker-compose run node npm run postinstall`
3. `docker-compose run node npm run build`
4. `dokcer-compose run node npm run migrate`
