const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
// const eventBus = require('../eventBus_via_EventEmitter/eventBus');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Get data from Service B
app.get('/getBData', (req, res) => {
  // Simulate getting data from ServiceB
  const responseData = { service: 'ServiceB', message: 'Data from ServiceB' };
  res.json(responseData);
});

// Create data for Service B
app.post('/createBData', (req, res) => {
  const data = req.body;
  // Handle data creation logic for ServiceB here (not implemented in this example)
  res.send('Data created for ServiceB');
});

app.listen(3002, () => {
  console.log('ServiceB listening on port 3002');
});
