const express = require('express');
const router = express.Router();
const { ctrlUsers } = require('../../controller');
const { validateContact, validateUser } = require('../../middlewares/validator');
const { auth } = require('../../middlewares/auth');

router.post('/signup', validateContact, ctrlUsers.register);

router.post('/login', validateContact, ctrlUsers.login);

router.get('/logout', auth, ctrlUsers.logout);

router.get('/current', auth, ctrlUsers.current);

router.patch('/', validateUser, ctrlUsers.update);

module.exports = router;
