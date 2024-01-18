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

app.post('/createAData', (req, res) => {
  const data = req.body;
  console.log('/createAData ServiceA (with Redis) received data', data);

  // Store data in Redis
  redis.rpush(redisCollection, JSON.stringify(data));
  res.send('Data created successfully.');
});

app.get('/getAData', async (req, res) => {
  // Retrieve data from Redis
  const dataList = await redis.lrange(redisCollection, 0, -1);

  const parsedData = dataList.map((data) => JSON.parse(data));
  console.log('/getAData ServiceA (with Redis) - parsedData', parsedData);

  const filteredData = parsedData.filter((item) => item.service === 'ServiceA');
  console.log('/getAData ServiceA (with Redis) - filteredData', filteredData);

  res.json(filteredData);
});

const port = 3001;
const server = app.listen(port, () => {
  const { address } = server.address();
  const host = address === '::' ? 'localhost' : address;
  console.log(`ServiceA (with Redis) listening http://${host}:${port}`);
});
