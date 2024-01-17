const dotenv = require('dotenv');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const Redis = require('ioredis');

dotenv.config();

// 'redis-service' (see docker-compose.yml) when other services on Docker 
// 'localhost' when other services on MacOS
const redisHost = process.env.REDIS_SERVICE_HOST || 'localhost';

const redis = new Redis({
  host: redisHost,
  port: 6379,
});

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// TBD refactor for scale 100 services. Potentially Pub/Sub or Saga pattern.

// const serviceAHost = 'http://localhost:3001';
const serviceAHost = 'http://service-a:3001';
// const serviceBHost = 'http://localhost:3002';
const serviceBHost = 'http://service-b:3002';

app.post('/postData', async (req, res) => {
  const data = req.body; // { message: "Hello" }
  console.log('Server (with Redis) received data:', data);
  // TBD DIFF data 

  // Forward data to ServiceA
  await axios.post(serviceAHost + '/createAData', data);

  // Forward data to ServiceB
  await axios.post(serviceBHost + '/createBData', data);

  // res.send('Data forwarded successfully.'); // IF plain-text is OK
  res.json({ status: 'success', message: 'Data received and forwarded successfully' });
});

app.get('/getData', async (req, res) => {
  // Retrieve data from ServiceA
  const dataA = await axios.get(serviceAHost + '/getAData');

  // Retrieve data from ServiceB
  const dataB = await axios.get(serviceBHost + '/getBData');

  const combinedData = [...dataA.data, ...dataB.data];

  console.log('combinedData', combinedData);

  // Store combined data in Redis
  redis.rpush('combinedDataList', JSON.stringify(combinedData));

  res.json(combinedData);
});

app.post('/login', (req, res) => {
  // Handle login logic here (not implemented in this example)
  res.send('Login successful');
});

const port = 3000;
const server = app.listen(port, () => {
  const { address, port } = server.address();
  const host = address === '::' ? 'localhost' : address;
  console.log(`Server App (with Redis) listening http://${host}:${port}`);
});
