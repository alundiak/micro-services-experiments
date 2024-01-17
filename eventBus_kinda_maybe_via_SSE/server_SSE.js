// server.js
const express = require('express');
const app = express();
const eventBus = require('./eventBus');

app.use(express.static('public'));

app.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  const sendEvent = (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  eventBus.on('dataReceived', sendEvent);

  req.on('close', () => {
    eventBus.off('dataReceived', sendEvent);
  });
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
