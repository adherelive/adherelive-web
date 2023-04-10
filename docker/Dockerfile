FROM node:14.15.0
RUN useradd -d /home/azureuser -m -s /bin/bash azureuser
RUN mkdir -p /usr/src/app && mkdir -p /usr/src/app/public
WORKDIR /usr/src/app
COPY package.json /usr/src/app
COPY package-lock.json /usr/src/app
RUN npm install && npm cache clean --force --loglevel=error
COPY ./env-files/.node_env_prod /usr/src/app/.env
COPY . /usr/src/app
ENV NEW_RELIC_NO_CONFIG_FILE=true
ENV NEW_RELIC_DISTRIBUTED_TRACING_ENABLED=true
# NEW_RELIC_LOG=stdout
# etc.
EXPOSE 5000
CMD ["npm", "start"]
HEALTHCHECK NONE