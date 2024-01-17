const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Redis = require('ioredis');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const redis = new Redis({
  // host: 'localhost', // when other on MacOS
  host: 'redis-service', // when other on Docker 
  port: 6379,
});

app.post('/createBData', (req, res) => {
  const data = req.body;
  console.log('Service B (with Redis) received data', data);

  // Store data in Redis
  redis.rpush('dataList', JSON.stringify(data));
  res.send('Data created successfully.');
});

app.get('/getBData', async (req, res) => {
  // Retrieve data from Redis
  const dataList = await redis.lrange('dataList', 0, -1);
  const parsedData = dataList.map((data) => JSON.parse(data));

  console.log('ServiceB (with Redis) parsed data from Redis', parsedData);

  res.json(parsedData);
});

const port = 3002;
const server = app.listen(port, () => {
  const { address, port } = server.address();
  const host = address === '::' ? 'localhost' : address;
  console.log(`ServiceB (with Redis) listening http://${host}:${port}`);
});
