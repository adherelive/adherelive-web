FROM node:16.15.1
RUN useradd -d /home/azureuser -m -s /bin/bash azureuser
RUN mkdir -p /usr/src/app/client && mkdir -p /usr/src/app/public
WORKDIR /usr/src/app
COPY package.json /usr/src/app
COPY package-lock.json /usr/src/app
COPY client/package.json /usr/src/app/client
COPY client/package-lock.json /usr/src/app/client
# COPY .node_env /usr/src/app/.env
RUN npm run postinstall && npm cache clean --force --loglevel=error
COPY ./client/. /usr/src/app/client/
# RUN npm run build && rm -rf client
RUN npm run build
RUN npm install && npm cache clean --force --loglevel=error
COPY . /usr/src/app
EXPOSE 5000
CMD ["npm", "start"]
HEALTHCHECK NONE
