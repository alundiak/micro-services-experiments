FROM node:21-alpine

WORKDIR /app

COPY package.json ./

RUN npm install

# COPY serviceA.js ./
COPY . .

EXPOSE 3001

CMD ["node", "serviceA.js"]
