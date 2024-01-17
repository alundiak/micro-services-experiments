FROM node:21-alpine

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .
COPY .env.example ./.env

EXPOSE 3000

# CMD ["node", "server.js"]
# CMD ["npm", "start"]
CMD ["npm", "run", "startWithRedis"]
