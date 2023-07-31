const { listContacts, getContactById } = require('../../models/contacts');
const express = require('express');

const router = express.Router();

router.get('/', async (req, res) => {
  const getContact = await listContacts();
  res.status(200).send(getContact);

  // res.send(req.body);
  // res.sendStatus(200);
  // res.json({ message: 'template message' });
});

router.get('/:contactId', async (req, res) => {
  const { contactId } = req.params;
  const getContact = await getContactById(contactId);
  if (getContact && getContact.id === contactId) {
    return res.status(200).send(getContact);
  }
  res.status(404).send(getContact);
  // res.json({ message: 'template message' });
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
