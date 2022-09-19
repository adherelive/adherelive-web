FROM node:14.15.0
RUN useradd -d /home/azureuser -m -s /bin/bash azureuser
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app
COPY package-lock.json /usr/src/app
COPY .env_demo_new /usr/src/app/.env
RUN npm install && npm cache clean --force --loglevel=error
COPY . /usr/src/app
EXPOSE 5000
CMD ["npm", "start"]
HEALTHCHECK NONE
