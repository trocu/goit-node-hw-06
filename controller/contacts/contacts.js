const { contactService } = require('../../service');

const get = async (req, res, next) => {
  const pageNumber = req.query.page || 1;
  const pageSize = req.query.limit || 20;
  const showFavorite = req.query.favorite;
  try {
    const result = await contactService.listContacts(pageNumber, pageSize, showFavorite);
    const { docs, total, limit, page, pages } = result;
    res.send({
      status: 'success',
      code: 200,
      data: { contacts: docs, total, limit, page, pages },
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const getById = async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const result = await contactService.getContactById(contactId);
    if (result) {
      res.send({
        status: 'success',
        code: 200,
        data: { result },
      });
    } else {
      res.status(404).send({
        status: 'error',
        code: 404,
        data: 'Not Found',
        message: `Not found contact id: ${contactId}`,
      });
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const add = async (req, res, next) => {
  const { name, email, phone } = req.body;
  try {
    const result = await contactService.addContact(name, email, phone);
    if (result) {
      res.status(201).send({
        status: 'success',
        code: 201,
        data: { result },
      });
    } else {
      res.status(409).send({
        status: 'error',
        code: 409,
        data: 'Conflict',
        message: `${name} is already in contacts!`,
      });
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const remove = async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const result = await contactService.removeContact(contactId);
    if (result) {
      res.status(200).send({
        status: 'success',
        code: 200,
        message: `${result.name} deleted`,
      });
    } else {
      res.status(404).send({
        status: 'error',
        code: 404,
        data: 'Not Found',
        message: `Not found contact id: ${contactId}`,
      });
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const update = async (req, res, next) => {
  const { contactId } = req.params;
  const { name, email, phone } = req.body;
  try {
    const result = await contactService.updateContact(contactId, name, email, phone);
    if (result) {
      res.status(200).send({
        status: 'success',
        code: 200,
        message: `${result.name} updated`,
      });
    } else {
      res.status(404).send({
        status: 'error',
        code: 404,
        data: 'Not Found',
        message: `Not found contact id: ${contactId}`,
      });
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const updateStatus = async (req, res, next) => {
  const { contactId } = req.params;
  const { favorite } = req.body;
  try {
    const result = await contactService.updateStatusContact(contactId, favorite);
    if (result) {
      res.status(200).send({
        status: 'success',
        code: 200,
        data: { result },
      });
    } else {
      res.status(404).send({
        status: 'error',
        code: 404,
        data: 'Not Found',
        message: `Not found contact id: ${contactId}`,
      });
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};

module.exports = { get, getById, add, remove, update, updateStatus };
