# adherelive-backend

Web Portal backend code + API for AdhereLive.

- Currently, the Doctor and Admin login portal on the web application
  - [AdhereLive Portal](https://portal.adhere.live)
- While for the Patient, we have a iOS and Android Mobile App

# Build & Deploy

## For Production Build

---

### Pre-requisite steps for PROD

Some files need to be copied to the root folder, if they do not exist:

```shell
$ cp ./env_files/.env_prod .env
$ cp ./env_files/.node_env_prod .node_env
$ cp ./docker/docker-compose.prod.yml docker-compose.yml
```

### Steps to build for Production

Note: Check the steps at the bottom for detailed PROD deploy

1. Build image
2. Run the image
3. Make sure **_.node_env_** is complete
4. Run seeders

**_Note: If you have a mounted volume, see the "If you have volume mounted" section below_**

### 1. Build image

Start off by running docker-compose.yml using the command.

`docker-compose build node -f ./docker/DockerfileLocal`

This will start building the docker image for the project. For a no cache build :-

`docker-compose build --no-cache node -f ./docker/DockerfileLocal`

### 2. Run the image

After the image is build, we need to run the image by

`docker-compose up`

This will start the project along with Mysql and Minio stacks.

### 3. Make sure .node_env is complete

Compare .node_env with .node_env.example and .env with .env.example. If any key-value pair is missing in .node_env, copy
it in from the .node_env.example.

### 4. Run seeders

For testing, seeders are needed to be run.

- `docker ps` will list all the running processes.
- Copy the container ID with the process marked "adhere_node".

Now run these command in this particular order,

1. `docker exec -it <conatainerId> bash`
2. `npm run seeder`

## For Development build

---

### Pre-requisite steps for LOCAL

Some files need to be copied to the root folder, if they do not exist:

```shell
$ cp ./env_files/.env_demo .env
$ cp ./env_files/.node_env_demo .node_env
$ cp ./docker/docker-compose.demo.yml docker-compose.yml
```

### Steps to build for Development

1. Edit docker-compose.yml
2. Build image
3. Run the image
4. Make sure .node_env is complete
5. Run seeders

**_Note: If you have mounted volume, see the "If you have volume mounted" section below_**

### 1. Build image

Start off by running docker-compose.yml using the command.

`docker-compose build node`

This will start building the docker image for the project. For a no cache build :-

`docker-compose build --no-cache node`

Use the image create to start the server

```shell
$ docker image ls
$ docker tag <ID> gagneet/adherelive:portal
$ docker push gagneet/adherelive:portal
```

### 2. Run the image

After the image is build, we need to run the image by

`docker-compose up`

This will start the project along with Mysql and Minio stacks.

### 3. Make sure .node_env is complete

Compare .node_env with .node_env.example and .env with .env.example. If any key-value pair is missing in .node_env, copy
it in from the .node_env.example.

### 4. Running migrations

To run migrations for setup,

1. `docker-compose exec node bash`
2. `npm run migrate`

### 5. Running seeders

Now for testing, seeders are needed to be run.

`docker ps` will list all the running processes. Copy the container ID with the process marked "adhere_node".

Now,

1. `docker-compose exec node bash`
2. `npm run seed`

---

## If you have volume mounted

If you're running the project first time. Run the following command

1. `docker-compose run node npm install`
2. `docker-compose run node npm run postinstall`
3. `docker-compose run node npm run build`
4. `docker-compose run node npm run migrate`
5. `docker-compose run node npm run seed`

## Other Items for Prod

### prescription changes - helper/genpdf/index.js->413

```
 .add(330, "minutes")
```

`app/ApiWrapper/mobile/medicine/index.js` and `webwrapper` also.

```json
id,
name,
treatment_id,
severity_id,
condition_id,
user_id,
details = {},
createdAt = null, (in get basic info.)
```

in feature details table add new json data `app/services/featureDetails/appontmentdetails.json`

### Updated at in care_plan_template wrapper

in gen prescription -> added followup and change gen and cons test.

### Clinical notes and flollow-up changes

- careplan-template
- careplan update and create api.
- update bar code.
- and add followup advise in update patient careplan's validator

# New Method To Deploy Backend & Frontend on Dev Server

## Using Swarm

Use the following command to join the swarm or initialize it:

```sh
docker swarm init

docker swarm join --token SWMTKN-1-0ze0jjcqdey3kihgctz5c4ftcus5i8wchdz4oinz6uumo6sbpt-csamsodj5uu7nepysq12kjrzl 10.2.0.5:2377

docker swarm join-token manager
```

## Backend

Build the image using below commands

```sh
cd ~/akshay/adherelive-web/
git pull
docker image build -t adhere-backend-9 .
cd ~/akshay/docker_env
docker-compose up -d backend
```

## Frontend

```sh
$ cd /home/azureuser/akshay/adherelive-fe
$ git pull
$ docker image build -t adhere-frontend-11 .
$ docker-compose  up -d frontend
```

<!-- TODO: https://demo.adhere.live/api/servicesubtx/activity -->

## Complete steps to build and deploy the PROD server code

### Pre-requisite steps for PROD

Some files need to be copied to the root folder, if they do not exist:

```shell
$ cp ./env_files/.env_prod .env
$ cp ./env_files/.node_env_prod .node_env
$ cp ./docker/docker-compose.prod.yml docker-compose.yml
```

### Backend

```shell
$ cd ./adherelive-web

$ vi Dockerfile
FROM node:16.10.0
RUN useradd -d /home/azureuser -m -s /bin/bash azureuser
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app
COPY package-lock.json /usr/src/app
RUN npm install && npm cache clean --force --loglevel=error
COPY .env_prod_new /usr/src/app/.env
COPY . /usr/src/app
EXPOSE 5000
CMD ["npm", "start"]
HEALTHCHECK NONE

$ docker image build --no-cache -f ./docker/Dockerfile -t adherelive:portal-be .


```

### Frontend

```shell
$ cd ./adherelive-fe

$ vi Dockerfile
FROM node:16.10.0 as builder
LABEL application="adhere-live-frontend"
LABEL owner="Akshay Nagargoje"
RUN mkdir /code
WORKDIR /code
COPY package*.json ./
RUN npm install
COPY . .
RUN cp .env_prod .env
RUN npm run build
# stage 2
FROM nginx
EXPOSE 80
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /code/build/ /usr/share/nginx/html

$ docker image build -t adherelive:portal-fe .
```

### Final steps to update the existing builds

```shell
$ docker service ls
ID             NAME              MODE         REPLICAS   IMAGE                  PORTS
y4568darcj1j   awesome_bose      replicated   1/1        adherelive:portal-fe   *:3000->80/tcp
ogpoiobdkjto   blissful_edison   replicated   1/1        adherelive:portal      *:5000->5000/tcp

$ docker service update --image=adherelive:portal-be blissful_edison
$ docker service update --image=adherelive:portal-fe awesome_bose
```

### Run Migrations, if required

```shell
$ docker ps
CONTAINER ID   IMAGE                    COMMAND                  CREATED             STATUS             PORTS                                           NAMES
13582d7d4daf   adherelive:portal        "docker-entrypoint.s�"   15 minutes ago      Up 15 minutes      5000/tcp                                        blissful_edison.1.7o9utloca9362t84ohvoccrzc
85bbed7267ac   adherelive:portal-fe     "/docker-entrypoint.�"   About an hour ago   Up About an hour   80/tcp                                          awesome_bose.1.dhcmm7gghw1ft5rwqrhf4j3oa
d7d0f37ac9ae   minio/minio              "/usr/bin/docker-ent�"   9 hours ago         Up 2 hours         0.0.0.0:9003->9000/tcp, :::9003->9000/tcp       adherelive-web_minio3_1
ac666db74338   mongo:latest             "docker-entrypoint.s�"   9 hours ago         Up 3 hours         0.0.0.0:27017->27017/tcp, :::27017->27017/tcp   adherelive-web_mongo_1
906e52a68536   minio/minio              "/usr/bin/docker-ent�"   9 hours ago         Up 2 hours         0.0.0.0:9002->9000/tcp, :::9002->9000/tcp       adherelive-web_minio2_1
27f71e03d600   minio/minio              "/usr/bin/docker-ent�"   9 hours ago         Up 2 hours         0.0.0.0:9004->9000/tcp, :::9004->9000/tcp       adherelive-web_minio4_1
23674bab2a97   minio/minio              "/usr/bin/docker-ent�"   9 hours ago         Up 2 hours         0.0.0.0:9001->9000/tcp, :::9001->9000/tcp       adherelive-web_minio1_1
eaf587a93742   certbot/certbot:latest   "/bin/sh -c 'trap ex�"   7 months ago        Up 3 hours         80/tcp, 443/tcp                                 adhere_certbot_1

$ docker exec -it 85bbed7267ac bash
/# npm run migrate
```

### Run Seeders, if required

For testing purposes, we have created a set of seed data that can be populated.

Seeders are needed to be run for the data to be uploaded to the DB.

`docker ps` will list all the running processes.
Copy the container ID with the process marked "adhere_node".

Now

```shell
$ docker-compose exec node bash
/# npm run seed
```

---
