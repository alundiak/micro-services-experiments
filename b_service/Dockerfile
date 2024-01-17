FROM node:21-alpine

WORKDIR /app

COPY package.json ./

RUN npm install

# COPY serviceB.js ./
COPY . .

EXPOSE 3002

CMD ["node", "serviceB.js"]
