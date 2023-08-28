const Jimp = require('jimp');
const path = require('path');
const uploadDir = path.join(process.cwd(), 'tmp');

const resizeImage = async (req, res, next) => {
  const { originalname } = req.file;
  const imagePath = path.join(uploadDir, originalname);
  const image = await Jimp.read(imagePath);
  try {
    await image.resize(250, 250).write(path.join(uploadDir, originalname));
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { resizeImage };
