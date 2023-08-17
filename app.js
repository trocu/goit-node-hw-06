const express = require('express');
const app = express();
const PORT = 3000;

const logger = require('morgan');
const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

const cors = require('cors');
const db = require('./infrastructure/db');

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

require('./config/config-passport');
const router = require('./api');
app.use('/api', router);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

db.connect().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running. Use our API on port: ${PORT}\nSuccessfully connected to MongoDB`);
  });
});
