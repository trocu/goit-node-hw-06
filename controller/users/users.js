const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();
const secret = process.env.SECRET;
const { v4: uuidv4 } = require('uuid');
const { userService } = require('../../service');
const User = require('../../models/user');
const { mailSg } = require('../../utils/verificationMail');

const register = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).lean();
  const avatarURL = gravatar.url(email, { s: '200', r: 'g', d: 'monsterid' }, false);
  if (user) {
    return res.status(409).send({
      status: 'error',
      code: 409,
      data: 'Conflict',
      message: 'Email is already in use',
    });
  }
  try {
    const hash = await bcrypt.hash(password, saltRounds);
    const verificationToken = uuidv4();
    const result = await userService.registerUser(avatarURL, email, hash, verificationToken);
    mailSg(result.email, result.verificationToken);
    res.status(201).send({
      status: 'success',
      code: 201,
      data: { user: { email: result.email, subscription: result.subscription } },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).lean();
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).send({
      status: 'error',
      code: 401,
      data: 'Unauthorized',
      message: 'Email or password is wrong',
    });
  } else if (!user.verify) {
    return res.status(403).send({
      status: 'error',
      code: 403,
      data: 'Forbidden',
      message: 'Email not verified',
    });
  }
  try {
    const payload = {
      id: user._id,
      email: user.email,
    };
    const token = jwt.sign(payload, secret, { expiresIn: '1h' });
    const result = await userService.loginUser(user, token);
    res.status(200).send({
      status: 'success',
      code: 200,
      token: result.token,
      data: { user: { email: result.email, subscription: result.subscription } },
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    await userService.logoutUser(req.body.id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

const current = async (req, res, next) => {
  try {
    res.status(200).send({
      status: 'success',
      code: 200,
      data: { email: req.user.email, subscription: req.user.subscription },
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  const { id, subscription } = req.body;
  const user = await User.findOne({ _id: id }).lean();
  if (!user) {
    return res.status(404).send({
      status: 'error',
      code: 404,
      data: 'Not Found',
      message: `Not found user id: ${id}`,
    });
  }
  try {
    const result = await userService.updateUserSubscription(id, subscription);
    res.status(200).send({
      status: 'success',
      code: 200,
      data: { email: result.email, subscription: result.subscription },
    });
  } catch (error) {
    next(error);
  }
};

const avatar = async (req, res, next) => {
  const { path: temporaryName, originalname } = req.file;
  const id = req.user._id.toString();
  const idFileName = id + path.extname(originalname);
  const storeImage = path.join(process.cwd(), 'public/avatars');
  const fileName = path.join(storeImage, idFileName);
  const avatarPath = path.join('/avatars', idFileName);
  try {
    await fs.rename(temporaryName, fileName);
    const result = await userService.updateUserAvatar(id, avatarPath);
    res.status(200).send({ avatarURL: result.avatarURL });
  } catch (error) {
    await fs.unlink(temporaryName);
    return next(error);
  }
};

const verify = async (req, res, next) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) {
    return res.status(404).send({
      status: 'error',
      code: 404,
      data: 'Not Found',
      message: 'User not found',
    });
  }
  try {
    await userService.updateVerificationStatus(verificationToken);
    res.status(200).send({
      status: 'success',
      code: 200,
      message: 'Verification successful',
    });
  } catch (error) {
    next(error);
  }
};

const resend = async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email }).lean();
  if (!user) {
    return res.status(404).send({
      status: 'error',
      code: 404,
      data: 'Not Found',
      message: 'User not found',
    });
  } else if (user.verify) {
    return res.status(403).send({
      status: 'error',
      code: 400,
      data: 'Bad Request',
      message: 'Verification has already been passed',
    });
  }
  try {
    mailSg(user.email, user.verificationToken);
    res.status(200).send({
      status: 'success',
      code: 200,
      message: 'Verification email sent',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, logout, current, update, avatar, verify, resend };
