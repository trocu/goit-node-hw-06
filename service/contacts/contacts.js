const Contact = require('../../models/contact');

const listContacts = async (pageNumber, pageSize, showFavorite) => {
  const query = showFavorite ? Contact.find({ favorite: showFavorite }) : {};
  try {
    const result = await Contact.paginate(query, { page: pageNumber, limit: pageSize });
    return result;
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};

const getContactById = async id => {
  try {
    const result = await Contact.findOne({ _id: id });
    return result;
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};

const addContact = async (name, email, phone) => {
  try {
    const result = await Contact.findOne({ name });
    if (!result) {
      const parsedData = await Contact.create({ name, email, phone });
      return parsedData;
    } else {
      return null;
    }
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};

const removeContact = async id => {
  try {
    const result = await Contact.findOneAndDelete({ _id: id });
    return result;
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};

const updateContact = async (id, name, email, phone) => {
  const opts = {
    new: true,
    runValidators: true,
  };
  try {
    const result = await Contact.findOneAndUpdate({ _id: id }, { name, email, phone }, opts);
    return result;
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};

const updateStatusContact = async (id, favorite) => {
  const opts = {
    new: true,
    runValidators: true,
  };
  try {
    if (favorite) {
      const result = await Contact.findOneAndUpdate({ _id: id }, { favorite }, opts);
      return result;
    } else {
      return { message: 'missing field favorite' };
    }
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};
module.exports = {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  updateStatusContact,
};
