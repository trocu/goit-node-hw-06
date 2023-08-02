const express = require('express');
const router = express.Router();
const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
} = require('../../models/contacts');
const { validateContact } = require('../../helpers/validator.js');

router.get('/', async (req, res) => {
  const getContact = await listContacts();
  res.status(200).send(getContact);
});

router.get('/:contactId', async (req, res) => {
  const { contactId } = req.params;
  const getContact = await getContactById(contactId);
  if (getContact && getContact.id === contactId) {
    return res.status(200).send(getContact);
  }
  res.status(404).send(getContact);
});

router.post('/', validateContact, async (req, res) => {
  const { name, email, phone } = req.body;
  const pushContact = await addContact(name, email, phone);
  res.status(201).send(pushContact);
});

router.delete('/:contactId', async (req, res) => {
  const { contactId } = req.params;
  const deleteContact = await removeContact(contactId);
  if (deleteContact) {
    return res.status(200).send(deleteContact);
  }
  res.status(404).send({ message: 'Not found' });
});

router.put('/:contactId', validateContact, async (req, res) => {
  const { contactId } = req.params;
  const { name, email, phone } = req.body;
  const refreshContact = await updateContact(contactId, name, email, phone);
  if (refreshContact) {
    return res.status(200).send(refreshContact);
  }
  res.status(404).send({ message: 'Not found' });
});

module.exports = router;
