FROM node:22
# Create app directory
WORKDIR /usr/src/app

COPY ./ ./

RUN npm install
RUN npm run build

CMD [ "node", "./index.js", "Docker" ]