const fs = require('fs/promises');
const { v4: uuidv4 } = require('uuid');
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

const addContact = async (name, email, phone) => {
  try {
    const parsedData = await listContacts();
    const newContacts = parsedData.concat({
      id: uuidv4(),
      name: name,
      email: email,
      phone: phone,
    });
    if (parsedData.some(contact => contact.name.toLowerCase() === name.toLowerCase())) {
      return { message: `${name} is already in contacts!` };
    }
    await fs.writeFile(contactsPath, JSON.stringify(newContacts, null, 2));
    return newContacts.find(contact => contact.name === name);
  } catch (err) {
    console.error(err.message);
  }
};

const removeContact = async contactId => {
  try {
    const parsedData = await listContacts();
    const getContact = parsedData.find(contact => contact.id === contactId);
    if (getContact && getContact.id === contactId) {
      const newContacts = parsedData.filter(contact => contact.id !== contactId);
      await fs.writeFile(contactsPath, JSON.stringify(newContacts, null, 2));
      return { message: `${getContact.name} deleted` };
    }
    return null;
  } catch (err) {
    console.error(err.message);
  }
};

const updateContact = async (id, name, email, phone) => {
  try {
    const parsedData = await listContacts();
    const index = parsedData.findIndex(contact => contact.id === id);
    if (index !== -1) {
      parsedData.splice(index, 1, { id, name, email, phone });
      await fs.writeFile(contactsPath, JSON.stringify(parsedData, null, 2));
      return parsedData[index];
    }
    return null;
  } catch (err) {
    console.error(err.message);
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
