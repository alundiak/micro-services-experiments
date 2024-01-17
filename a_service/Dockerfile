FROM node:21-alpine

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .
COPY .env.example ./.env

EXPOSE 3001

# CMD ["node", "serviceA.js"]
# CMD ["npm", "start"]
CMD ["npm", "run", "startWithRedis"]
