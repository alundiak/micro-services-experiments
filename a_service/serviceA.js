const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
// const eventBus = require('../eventBus_via_EventEmitter/eventBus');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Get data from Service A
app.get('/getAData', (req, res) => {
  // Simulate getting data from ServiceA
  const responseData = { service: 'ServiceA', message: 'Data from ServiceA' };
  res.json(responseData);
});

// Create data for Service A
app.post('/createAData', (req, res) => {
  const data = req.body;
  // Handle data creation logic for ServiceA here (not implemented in this example)
  res.send('Data created for ServiceA');
});

app.listen(3001, () => {
  console.log('ServiceA listening on port 3001');
});
