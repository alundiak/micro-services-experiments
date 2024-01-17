const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const Redis = require('ioredis');

const app = express();
const redis = new Redis();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// TBD refactor for scale 100 services. Potentially Pub/Sub or Saga pattern.

app.post('/postData', async (req, res) => {
  const data = req.body; // { message: "Hello" }
  console.log('Server (with Redis) received data:', data);
  // TBD DIFF data 

  // Forward data to ServiceA
  // await axios.post('http://serviceA:3001/createAData', data);
  await axios.post('http://localhost:3001/createAData', data);

  // Forward data to ServiceB
  // await axios.post('http://serviceB:3002/createBData', data);
  await axios.post('http://localhost:3002/createBData', data);

  // res.send('Data forwarded successfully.'); // IF plain-text is OK
  res.json({ status: 'success', message: 'Data received and forwarded successfully' });
});

app.get('/getData', async (req, res) => {
  // Retrieve data from ServiceA
  // const dataA = await axios.get('http://ServiceA:3001/getAData');
  const dataA = await axios.get('http://localhost:3001/getAData');

  // Retrieve data from ServiceB
  // const dataB = await axios.get('http://serviceB:3002/getBData');
  const dataB = await axios.get('http://localhost:3002/getBData');

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

app.listen(3000, () => {
  console.log('Server App (with Redis) listening on port 3000');
});
