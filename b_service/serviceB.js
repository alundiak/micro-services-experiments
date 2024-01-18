const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
// const eventBus = require('../eventBus_via_EventEmitter/eventBus');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/createBData', (req, res) => {
  const data = req.body;
  console.log('Service B v1 received data', data);
  // Handle data creation logic for ServiceB here (not implemented in this example)
  res.send('Data created for ServiceB v1');
});

app.get('/getBData', (req, res) => {
  // Simulate getting data from ServiceB
  const responseData = { service: 'ServiceB v1', message: 'Data from ServiceB v1' };
  res.json(responseData);
});

app.listen(3002, () => {
  console.log('ServiceB v1 listening on port 3002');
});
