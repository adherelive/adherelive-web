FROM gagneet/ubuntulibs
# Install build-essential
RUN apt-get update && apt-get install -y build-essential && rm -rf /var/lib/apt/lists/*
RUN useradd -d /home/azureuser -m -s /bin/bash azureuser
LABEL application="adherelive-backend"
LABEL owner="AdhereLive Pvt Ltd"
RUN mkdir -p /usr/src/app && mkdir -p /usr/src/app/public
WORKDIR /usr/src/app
COPY package.json /usr/src/app
COPY package-lock.json /usr/src/app
RUN npm config set registry https://registry.npmmirror.com/ --global
RUN npm install && npm cache clean --force --loglevel=error
COPY . /usr/src/app
COPY env_files/.node_env_prod /usr/src/app/.env
EXPOSE 5000
CMD ["npm", "start"]
HEALTHCHECK NONE