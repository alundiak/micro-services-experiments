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

const serviceAHost = process.env.SERVICE_A_HOST || 'localhost';
const serviceBHost = process.env.SERVICE_B_HOST || 'localhost';
const serviceAUrl = `http://${serviceAHost}:3001`;
const serviceBUrl = `http://${serviceBHost}:3002`;

app.post('/postData', async (req, res) => {
  const data = req.body; // { message: "Hello" }
  console.log('/postData Server App (with Redis) received data:', data);
  // TBD DIFF data 

  if (data?.service === 'ServiceA') {
    // Forward data to ServiceA
    await axios.post(serviceAUrl + '/createAData', data);
  } else if (data?.service === 'ServiceB') {
    // Forward data to ServiceB
    await axios.post(serviceBUrl + '/createBData', data);
  }

  // res.send('Data forwarded successfully.'); // IF plain-text is OK
  res.json({ status: 'success', message: `Data received and forwarded to '${data?.service}' successfully` });
});

app.get('/getData', async (req, res) => {
  console.log('/getData Server App (with Redis)');

  // Retrieve data from ServiceA
  const dataA = await axios.get(serviceAUrl + '/getAData');
  console.log('dataA', dataA.data);

  // Retrieve data from ServiceB
  const dataB = await axios.get(serviceBUrl + '/getBData');
  console.log('dataB', dataB.data);

  let combinedData = [];
  if (dataA) {
    combinedData.push(dataA.data);
  }

  if (dataB) {
    combinedData.push(dataB.data);
  }

  console.log('combinedData', combinedData);

  // Store combined data in Redis
  // redis.rpush('combinedDataList', JSON.stringify(combinedData));

  res.json(combinedData);
});

app.post('/login', (req, res) => {
  // Handle login logic here (not implemented in this example)
  res.send('Login successful');
});

const port = 3000;
const server = app.listen(port, () => {
  const { address } = server.address();
  const host = address === '::' ? 'localhost' : address;
  console.log(`Server App (with Redis) listening http://${host}:${port}`);
});
