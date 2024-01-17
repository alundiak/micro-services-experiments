FROM node:21-alpine

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .
COPY .env.example ./.env

EXPOSE 3002

# CMD ["node", "serviceB.js"]
# CMD ["npm", "start"]
CMD ["npm", "run", "startWithRedis"]
