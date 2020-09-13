FROM node:carbon-jessie
RUN mkdir -p /usr/src/app/client
RUN mkdir -p /usr/src/app/public
WORKDIR /usr/src/app
COPY package.json /usr/src/app
COPY client/package.json /usr/src/app/client
RUN npm run postinstall && npm cache clean --force --loglevel=error
COPY ./client/. /usr/src/app/client/
RUN npm run build
RUN npm install && npm cache clean --force --loglevel=error
COPY . /usr/src/app
RUN rm -rf client
EXPOSE 5000
CMD ["npm", "start"]