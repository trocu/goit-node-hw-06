require('dotenv').config();

const uriDb = process.env.DB_HOST;
const mongoose = require('mongoose');
const connection = mongoose.connect(uriDb, {
  dbName: 'db-contacts',
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connect = async () => {
  await connection.catch(err => {
    console.log(`Server not running. Error message: ${err.message}`);
    process.exit(1);
  });
};

module.exports = { connect };
