# Basic-Forum
A basic forum using Node.js, MongoDB and Vue as an experiment

## Setup
### Docker: (Recommended)
**Prerequisites:**
- [Docker](https://docs.docker.com/engine/install/)
### Start
```
git clone https://github.com/alive-hamster/Basic-Forum.git
cd Basic-Forum
sudo docker compose up -d
```
### Terminal:
**Prerequisites:**
- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/try/download/community-edition)
### Start
```
git clone https://github.com/alive-hamster/Basic-Forum.git
cd Basic-Forum
npm install
npm run build
node index.js
```
### Remember to create a .env file
**If using https through a reverse proxy https in .env may need to be set to false**
**Recommended way to genereate secret key**
```
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```