FROM node:alpine
WORKDIR /srv/app
COPY . /srv/app

RUN npm install

CMD ["npm", "run", "dev"]
