const express = require('express');
const router = express.Router();
const { ctrlUsers } = require('../../controller');
const { validateContact, validateUser } = require('../../middlewares/validator');
const { auth } = require('../../middlewares/auth');
const { upload } = require('../../middlewares/upload');
const { resizeImage } = require('../../middlewares/jimp');
const { mail } = require('../../utils/verificationMail');

router.post('/signup', validateContact, ctrlUsers.register);

router.post('/login', validateContact, ctrlUsers.login);

router.get('/logout', auth, ctrlUsers.logout);

router.get('/current', auth, ctrlUsers.current);

router.patch('/', validateUser, ctrlUsers.update);

router.patch('/avatars', auth, upload.single('avatar'), resizeImage, ctrlUsers.avatar);

router.get('/verify/:verificationToken', ctrlUsers.verify);

module.exports = router;
