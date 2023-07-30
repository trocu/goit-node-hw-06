const { listContacts } = require('../../models/contacts');
const express = require('express');

const router = express.Router();

router.get('/', async (req, res) => {
  const list = await listContacts();
  res.send(list);

  // res.send(req.body);
  // res.sendStatus(200);
  // res.json({ message: 'template message' });
});

router.get('/:contactId', async (req, res, next) => {
  res.json({ message: 'template message' });
});

router.post('/', async (req, res, next) => {
  res.json({ message: 'template message' });
});

router.delete('/:contactId', async (req, res, next) => {
  res.json({ message: 'template message' });
});

router.put('/:contactId', async (req, res, next) => {
  res.json({ message: 'template message' });
});

module.exports = router;
