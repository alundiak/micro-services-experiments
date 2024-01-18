const dotenv = require('dotenv');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Redis = require('ioredis');

dotenv.config();

const redis = new Redis({
  host: process.env.REDIS_SERVICE_HOST || 'localhost',
  port: 6379,
});

const app = express();
app.use(cors());
app.use(bodyParser.json());

const redisCollection = 'microservicesDataList';

app.post('/createBData', (req, res) => {
  const data = req.body;
  console.log('/createBData Service B (with Redis) received data', data);

  // Store data in Redis
  redis.rpush(redisCollection, JSON.stringify(data));
  res.send('Data created successfully.');
});

app.get('/getBData', async (req, res) => {
  // Retrieve data from Redis
  const dataList = await redis.lrange(redisCollection, 0, -1);

  const parsedData = dataList.map((data) => JSON.parse(data));
  console.log('/getBData ServiceB (with Redis) - parsedData', parsedData);

  const filteredData = parsedData.filter((item) => item.service === 'ServiceB');
  console.log('/getBData ServiceB (with Redis) - filteredData', filteredData);

  res.json(filteredData);
});

const port = 3002;
const server = app.listen(port, () => {
  const { address } = server.address();
  const host = address === '::' ? 'localhost' : address;
  console.log(`ServiceB (with Redis) listening http://${host}:${port}`);
});
