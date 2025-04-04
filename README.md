# adherelive-backend

Web Portal backend code + API for AdhereLive.

- Currently, the Doctor and Admin login portal on the web application
  - [AdhereLive Portal](https://portal.adhere.live)
- While for the Patient, we have a iOS and Android Mobile App

# Build & Deploy

## For Development Builds

### Creating and working with AdhereLive using Dev Builds

We have shifted to using 'docker swarm' and creating 'service' containers to execute the docker containers inside a
docker network. <br />

Some good steps, before we run the build are to check the following commands return no data/output:

```shell
docker service ls
docker volume ls
docker ps -a
```

These ideally should not contain anything related to the AdhereLive application running:

- mysql
- mongoDB
- adherelive-web (for nodejs backend services)
- adherelive-fe (for react frontend services)

#### Commands to initiate and setup Swarm

```shell
docker swarm init
docker info --format '{{.Swarm.ControlAvailable}}'
read manager_ip _ <<<$(IFS=':'; echo $(docker info --format "{{ (index .Swarm.RemoteManagers 0).Addr }}"))
echo "${manager_ip}"
```

The above will provide the details of the swarm and where the swarm manager resides

#### Build and verify the Node.js and React docker images

You will need to fetch both the `adherelive-web` & `adherelive-fe` repository codes from GitHub.
(Check with the team for permissions and access).
Once you have them on your local, run the following to copy the relevant files & build the docker images:
[make sure that you check and change the version in the build tage accordingly]

```shell
cd adherelive-web
cp env_files/.env_demo .env
cp env_files/.node_env_demo .node_env
cp docker/DockerfileDemo Dockerfile
vi .node_env
--- make changes to the URL to apply your own DNS or use `localhost`
docker image build --no-cache -f Dockerfile -t adherelive-be:d3.1.2 .
```

Once the image has been built for the node (backend) container, build for the React (frontend) one:

```shell
cd ../adherelive-fe
cp env_files/.env_demo .env
cp env_files/.node_env_demo .node_env
cp docker/DockerfileDemo Dockerfile
docker image build --no-cache -f Dockerfile -t adherelive-fe:d3.1.2 .
```

#### Setup and build the service stack and populate the DB's

##### Create Docker secrets

```shell
echo "password" | docker secret create mysql_root_password -
echo "password" | docker secret create mysql_user_password -
echo "password" | docker secret create mongodb_password -
```

Then you need to copy and change the `docker-stack.yml` file, which builds the services and the network for your local
setup

```shell
cd ..
cp adherelive-web/setup-server/docker-stack-demo.yml docker-stack.yml
cp adherelive-web/.node_env .env
vi docker-stack.yml
--- make the required changes to the image names as used above
docker stack deploy -c docker-stack.yml ald
```

The above last command should create the required services in the swarm and start the containers for the following:

- adherelive-be (node services which connect to mysql & mongodb)
- adherelive-fe (the React based UI of the application)
- mysql (the database which contains all the data for the application)
- mongodb (local DB for specific fields like Diagnosis)

Once the above is set up, you need to `seed` data to the MySQL & MongoDB:

```shell
docker ps -a
docker exec -it <mysql-container-id> mysql -u root -p
- Enter password: [use 'password', as created above]
> CREATE DATABASE adhere;
> CREATE USER 'user'@'localhost' IDENTIFIED BY 'password';
> GRANT ALL PRIVILEGES ON adhere.* TO 'user'@'localhost';
> FLUSH PRIVILEGES;

docker exec -it <mongodb-container-id> mongosh -u mongouser -p password --authenticationDatabase admin
[OR docker exec -it 374d0cf14437 mongosh "mongodb://mongouser:password@localhost:27017/adhere?authSource=admin"]
> use adhere;
```

##### For Windows Systems

You might need to do the following, as the network for Docker is not same as Linux:
Follow these steps to log in and create the password & users:

```shell

> docker stop <mysql-container-id>
> docker run --name temp-mysql-secure -e MYSQL_ROOT_PASSWORD=password -d mysql
> docker exec -it temp-mysql-secure mysql -u root -p
> docker exec -it temp-mysql-secure mysql -u root -p
mysql> ALTER USER 'root'@'localhost' IDENTIFIED BY 'password';
mysql> FLUSH PRIVILEGES;

> docker stop temp-mysql-secure
> docker rm temp-mysql-secure

> docker start <mysql-container-id>

```

```shell
> ALTER USER 'user'@'%' IDENTIFIED BY 'password';
> GRANT ALL PRIVILEGES ON adhere.* TO 'user'@'%';
```

##### Setup `seed` data

```shell
docker exec -it <adherelive-be-container-id> bash
npm run migrate
npm run seed
```

You can check the logs for any container, by running:

```shell
docker logs -f <container-id>
```

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

1. `docker exec -it <containerId> bash`
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

`app/apiWrapper/mobile/medicine/index.js` and `webwrapper` also.

```
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

### Clinical notes and follow-up changes

- careplan-template
- careplan update and create api.
- update bar code.
- and add followup advise in update patient careplan's validator

# New Method To Deploy Backend & Frontend on Dev Server

## For a new DB (Azure MySQL DB Flexi Server)

https://learn.microsoft.com/en-us/azure/mysql/flexible-server/how-to-connect-tls-ssl#disable-ssl-enforcement-on-your-flexible-server

## Install CertBot

### Install nginx

https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-20-04

https://www.linode.com/docs/guides/how-to-install-and-use-nginx-on-ubuntu-20-04/

Use this as the initial setup file for NGINX

```
server {
    if ($host = portal.adhere.live) {
        return 301 https://$host$request_uri;
    } # managed by Certbot

        listen 80;
        listen [::]:80;

        server_name portal.adhere.live;
    return 404; # managed by Certbot
}
```

### Install LetsEncrypt certificate

- nginx with LetsEncrypt and Certbot as a Docker container

https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-20-04

Use the following to update the file

- /etc/nginx/sites-enabled/portal.adhere.live

```
server {
        client_max_body_size 10M;
        server_name portal.adhere.live;
        location /api {
                proxy_read_timeout 500;
                proxy_pass http://127.0.0.1:5000;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header Host $host;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-NginX-Proxy true;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection "upgrade";
        }
        location /m-api {
                # proxy_read_timeout 500;
                proxy_pass http://127.0.0.1:5000;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header Host $host;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-NginX-Proxy true;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection "upgrade";
        }
        location / {
                proxy_read_timeout 500;
                proxy_pass http://127.0.0.1:3000;
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header Host $host;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-NginX-Proxy true;
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection "upgrade";
        }


    listen [::]:443 ssl ipv6only=on; # managed by Certbot
    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/portal.adhere.live/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/portal.adhere.live/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot

}
server {
    if ($host = portal.adhere.live) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


        listen 80;
        listen [::]:80;

        server_name portal.adhere.live;
    return 404; # managed by Certbot


}
```

## Install Docker

https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-20-04

### Using Swarm

https://www.linuxtechi.com/how-to-deploy-docker-swarm-on-ubuntu/

https://www.dataquest.io/blog/install-and-configure-docker-swarm-on-ubuntu/

Use the following command to join the swarm or initialize it:

```sh
$ docker swarm init
$ docker swarm join --token SWMTKN-1-0ze0jjcqdey3kihgctz5c4ftcus5i8wchdz4oinz6uumo6sbpt-csamsodj5uu7nepysq12kjrzl 10.2.0.5:2377
$ docker swarm join-token manager
```

## Backend

Build the image using below commands

```sh
$ cd ~/adherelive-web/
$ git pull --all
$ docker image build -t adherelive-be .
$ cd ~/docker_env
$ docker-compose up -d backend
```

## Frontend

```sh
$ cd /adherelive-fe
$ git pull
$ docker image build -t adherelive-fe .
```

### For local run

```shell
$ docker-compose up -d backend
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
COPY package.json /usr/src/app/
COPY package-lock.json /usr/src/app/
RUN npm install && npm cache clean --force --loglevel=error
COPY .node_env /usr/src/app/.env
COPY . /usr/src/app
EXPOSE 5000
CMD ["npm", "start"]
HEALTHCHECK NONE

$ docker image build --no-cache -f Dockerfile -t adherelive:portal-be .
```

### Frontend

```shell
$ cd ./adherelive-fe

$ vi Dockerfile
FROM node:16.10.0 as builder
LABEL application="adherelive-frontend"
LABEL owner="AdhereLive Pvt Ltd"
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

$ docker image build --no-cache -f Dockerfile -t adherelive:portal-fe .
```

### Final steps to update the existing builds

```shell
#$ docker service ls
#ID             NAME              MODE         REPLICAS   IMAGE                  PORTS
#y4568darcj1j   awesome_bose      replicated   1/1        adherelive:portal-fe   *:3000->80/tcp
#ogpoiobdkjto   blissful_edison   replicated   1/1        adherelive:portal      *:5000->5000/tcp

#$ docker service update --image=adherelive:portal-be blissful_edison
#$ docker service update --image=adherelive:portal-fe awesome_bose

adherelive@adherelive-nprod:~$ docker service ls
ID             NAME            MODE         REPLICAS   IMAGE             PORTS
2paz1v61fr3j   loving_yonath   replicated   1/1        adherelive-be:1   *:5000->5000/tcp
kd6gf0vvaumz   stoic_lehmann   replicated   1/1        adherelive-fe:1   *:3000->80/tcp

$ docker service update --image=adherelive:portal-be loving_yonath
$ docker service update --image=adherelive:portal-fe stoic_lehmann
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
$ # npm run migrate
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
