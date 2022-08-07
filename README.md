# adherelive-web

Web Portal for AdhereLive. Currently, the Doctor's and Admin's login portal on the web application

# For Production Build

---

## Steps to build for Production

1. Build image
2. Run the image
3. Make sure .node_env is complete
4. Run seeders

**_Note:- If you have volume mounted see the "If you have volume mounted" section below_**

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

Compare .node_env with .node_env.example and .env with .env.example. If any key-value pair is missing in .node_env, copy
it in from the .node_env.example.

## 4. Run seeders

For testing, seeders are needed to be run.

docker ps will list all the running processes. Copy the container ID with the process marked "adhere_node".

Now run these command in this particular order,

1. `docker exec -it <conatainerId> bash`
2. `npm run seeder`

# For Development build

---

## Steps to build for Development

1. Edit docker-compose.yml
2. Build image
3. Run the image
4. Make sure .node_env is complete
5. Run seeders

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

Compare .node_env with .node_env.example and .env with .env.example. If any key-value pair is missing in .node_env, copy
it in from the .node_env.example.

## 4. Running migrations

To run migrations for setup,

1. `docker-compose exec node bash`
2. `npm run migrate`

## 5. Running seeders

Now for testing, seeders are needed to be run.

`docker ps` will list all the running processes. Copy the container ID with the process marked "adhere_node".

Now,

1. `docker-compose exec node bash`
2. `npm run seed`

---

### If you have volume mounted

If you're running the project first time. Run the following command

1. `docker-compose run node npm install`
2. `docker-compose run node npm run postinstall`
3. `docker-compose run node npm run build`
4. `docker-compose run node npm run migrate`
5. `docker-compose run node npm run seed`


## Packages for Server and Client with versions

### Server Dependencies

  npm install @hapi/joi, agora-access-token, algoliasearch, atob, aws-sdk, axios, base64-img, bcrypt, chalk, concurrently, cookie-parser, cookie-session, cors, crypto-js, date-fns, db-migrate, db-migrate-mysql, dotenv, ejs, express, express-validator, faker, getstream, google-auth-library, joi, js-base64, js-md5, jsonwebtoken, lodash, minio, moment, multer, mysql2, node-fetch, node-schedule, node-xlsx, nodemailer, nodemailer-sendgrid-transport, papaparse, pdfkit, razorpay, react-chartjs-2, react-markdown, request, rrule, sequelize, sequelize-cli, twilio, uuid

### Server Dev Dependencies

  npm install --save-dev @babel/cli, @babel/core, @babel/node, @babel/plugin-proposal-class-properties, @babel/plugin-transform-arrow-functions, @babel/preset-env, css-loader, husky, jest, less, less-loader, lint-staged, nodemon, prettier, react-intl-translations-manager, style-loader

### Client Dependencies

  npm install @ant-design/icons@4.7.0,agora-rtc-sdk,agora-rtc-sdk-ng,algoliasearch,antd@3.26.20,axios,babel-plugin-import,chart.js,classnames,date-fns,firebase,fullcalendar-reactwrapper,getstream,install,js-base64,js-cookie,less,less-loader,lodash-es,moment,moment-timezone,nodemailer,nodemailer-sendgrid-transport,npm,prop-types,rc-slider@9.5.3,react@16.13.1,react-app-rewire-less,react-app-rewire-react-intl,react-app-rewired,react-audio-player,react-chartjs-2@2.11.1,react-chat-widget@2.1.5,react-datepicker@2.8.0,react-dom@16.13.1,react-facebook-login,react-google-login,react-google-places-autocomplete@2.3.2,react-highlight-words,react-instantsearch-dom,react-intl@5.25.1,react-markdown,react-mde@11.4.0,react-onclickoutside,react-otp-input,react-places-autocomplete,react-popper@1.3.7,react-redux@5.1.2,react-router-dom@5.3.3,react-scripts@1.0.4,react-slider,react-spring,react-timekeeper@1.1.0,react-uuid,react-year-picker,redux,redux-devtools-extension,redux-thunk,reselect,showdown,twilio-chat,twilio-video

### Client Dev Dependencies

  npm install --save-dev @babel/cli, @babel/core, @babel/plugin-transform-arrow-functions, @babel/preset-env, babel-plugin-react-intl, babel-preset-react-app, prettier
