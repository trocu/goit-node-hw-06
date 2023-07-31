const express = require('express');
const router = express.Router();
const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
} = require('../../models/contacts');

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

router.post('/', async (req, res) => {
  const { name, email, phone } = req.body;
  if (name && email && phone) {
    const pushContact = await addContact(name, email, phone);
    return res.status(201).send(pushContact);
  }
  res.status(400).send({ message: 'missing required name - field' });
  // res.json({ message: 'template message' });
});

router.delete('/:contactId', async (req, res) => {
  const { contactId } = req.params;
  const deleteContact = await removeContact(contactId);
  if (deleteContact) {
    return res.status(200).json(deleteContact);
  }
  return res.status(404).json({ message: 'Not found' });
  // res.json({ message: 'template message' });
});

router.put('/:contactId', async (req, res, next) => {
  res.json({ message: 'template message' });
});

module.exports = router;
