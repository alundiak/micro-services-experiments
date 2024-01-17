const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Redis = require('ioredis');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const redis = new Redis();

app.post('/createAData', (req, res) => {
  const data = req.body;
  console.log('ServiceA (with Redis) received data', data);

  // Store data in Redis
  redis.rpush('dataList', JSON.stringify(data));
  res.send('Data created successfully.');
});

app.get('/getAData', async (req, res) => {
  // Retrieve data from Redis
  const dataList = await redis.lrange('dataList', 0, -1);
  const parsedData = dataList.map((data) => JSON.parse(data));

  console.log('ServiceA (with Redis) parsed data from Redis', parsedData);

  res.json(parsedData);
});

app.listen(3001, () => {
  console.log('ServiceA (with Redis) listening on port 3001');
});
