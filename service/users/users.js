const User = require('../../models/user');

const registerUser = async (avatarURL, email, password) => {
  try {
    const parsedData = await User.create({ avatarURL, email, password });
    console.log(parsedData);
    return parsedData;
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};

const loginUser = async (user, token) => {
  const opts = {
    new: true,
  };
  try {
    const result = await User.findOneAndUpdate({ _id: user._id }, { token: token }, opts);
    return result;
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};

const logoutUser = async id => {
  const opts = {
    new: true,
  };
  try {
    const result = await User.findOneAndUpdate({ _id: id }, { token: null }, opts);
    return result;
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};

const updateUserSubscription = async (id, subscription) => {
  const opts = {
    new: true,
    runValidators: true,
  };
  try {
    const result = await User.findOneAndUpdate({ _id: id }, { subscription }, opts);
    return result;
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};

const updateUserAvatar = async (id, avatarURL) => {
  try {
    const result = await User.findOneAndUpdate({ _id: id }, { avatarURL });
    return result;
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};

module.exports = { registerUser, loginUser, logoutUser, updateUserSubscription, updateUserAvatar };
