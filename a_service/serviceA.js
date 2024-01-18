const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
// const eventBus = require('../eventBus_via_EventEmitter/eventBus');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/createAData', (req, res) => {
  const data = req.body;
  console.log('Service A v1 received data', data);
  // Handle data creation logic for ServiceA here (not implemented in this example)
  res.send('Data created for ServiceA v1');
});

app.get('/getAData', (req, res) => {
  // Simulate getting data from ServiceA
  const responseData = { service: 'ServiceA v1', message: 'Data from ServiceA v1' };
  res.json(responseData);
});

app.listen(3001, () => {
  console.log('ServiceA v1 listening on port 3001');
});
