const express = require('express');
const app = express();
const PORT = 3000;

const logger = require('morgan');
const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

const cors = require('cors');

require('dotenv').config();
const uriDb = process.env.DB_HOST;
const mongoose = require('mongoose');
const connection = mongoose.connect(uriDb, {
  dbName: 'db-contacts',
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

const contactsRouter = require('./api');
app.use('/api/contacts', contactsRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

connection
  .then(() => {
    app.listen(PORT, function () {
      console.log(
        `Server running. Use our API on port: ${PORT}\nSuccessfully connected to MongoDB`
      );
    });
  })
  .catch(err => {
    console.log(`Server not running. Error message: ${err.message}`);
    process.exit(1);
  });
