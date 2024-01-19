FROM node:21-alpine

WORKDIR /app

COPY package.json ./

# RUN npm install
# Using cache mount for npm install, so unchanged packages aren’t downloaded every time
RUN --mount=type=cache,target=/root/.npm npm install

COPY . .
COPY .env.example ./.env

EXPOSE 3002

# CMD ["node", "serviceB.js"]
# CMD ["npm", "start"]
CMD ["npm", "run", "startWithRedis"]
