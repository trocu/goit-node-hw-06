const express = require('express');
const app = express();
const fs = require('fs').promises;
const path = require('path');
const PORT = 3000;
const uploadDir = path.join(process.cwd(), 'tmp');
const storeImage = path.join(process.cwd(), '/public/avatars');

const logger = require('morgan');
const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

const cors = require('cors');
const db = require('./infrastructure/db');

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

require('./config/config-passport');
const router = require('./api');
app.use('/api', router);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});

const isFolderExist = async path => {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
};

const createFolder = async folder => {
  if (!(await isFolderExist(folder))) {
    await fs.mkdir(folder, { recursive: true });
  }
};

db.connect().then(() => {
  app.listen(PORT, async () => {
    createFolder(storeImage);
    createFolder(uploadDir);
    console.log(`Server running. Use our API on port: ${PORT}\nSuccessfully connected to MongoDB`);
  });
});
