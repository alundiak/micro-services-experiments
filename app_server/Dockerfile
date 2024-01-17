FROM node:21-alpine

WORKDIR /app

COPY package.json ./

RUN npm install

COPY .env.example ./.env

# COPY server.js ./
COPY . .

EXPOSE 3000

# CMD ["node", "server.js"]
# CMD ["npm", "start"]
CMD ["npm", "run", "startWithRedis"]
