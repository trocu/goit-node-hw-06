const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
require('dotenv').config();
const secret = process.env.SECRET;
const { userService } = require('../../service');
const User = require('../../models/user');

const register = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).lean();
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
    const result = await userService.registerUser(email, hash);
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
  if (!user || !bcrypt.compare(password, user.password)) {
    return res.status(401).send({
      status: 'error',
      code: 401,
      data: 'Unauthorized',
      message: 'Email or password is wrong',
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
  const { id } = req.body;
  const user = await User.findOne({ _id: id }).lean();
  if (!user) {
    return res.status(401).send({
      status: 'error',
      code: 401,
      data: 'Unauthorized',
      message: 'Not authorized',
    });
  }
  try {
    await userService.logoutUser(id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

const current = async (req, res, next) => {
  const { id } = req.body;
  try {
    const result = await userService.currentUser(id);
    res.status(200).send({
      status: 'success',
      code: 200,
      data: { email: result.email, subscription: result.subscription },
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

module.exports = { register, login, logout, current, update };
