FROM node:carbon-jessie
RUN mkdir -p /usr/src/app/client
WORKDIR /usr/src/app
COPY package.json /usr/src/app
COPY client/package.json /usr/src/app/client
RUN npm install
RUN npm run postinstall
COPY . /usr/src/app
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]