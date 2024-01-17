const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/login', (req, res) => {
  // Handle login logic here (not implemented in this example)
  res.send('Login successful');
});

app.listen(3000, () => {
  console.log('Server App listening on port 3000');
});
