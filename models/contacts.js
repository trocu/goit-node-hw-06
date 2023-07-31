const fs = require('fs/promises');
const path = require('path');
const contactsPath = path.resolve('models', 'contacts.json');

const listContacts = async () => {
  try {
    const getContacts = await fs.readFile(contactsPath);
    return JSON.parse(getContacts);
  } catch (err) {
    console.error(err.message);
  }
};

const getContactById = async contactId => {
  try {
    const parsedData = await listContacts();
    const getContact = parsedData.find(contact => contact.id === contactId);
    return getContact ?? { message: 'Not found' };
  } catch (err) {
    console.error(err.message);
  }
};

const removeContact = async contactId => {};

const addContact = async body => {};

const updateContact = async (contactId, body) => {};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
