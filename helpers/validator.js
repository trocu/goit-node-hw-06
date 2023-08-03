const Joi = require('joi');

const schema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email({ minDomainSegments: 2 }).required(),
  phone: Joi.string().required(),
});

const validateContact = (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .send({ message: `missing required ${error.details[0].context.label} field` });
  }
  next();
};

module.exports = { validateContact };
