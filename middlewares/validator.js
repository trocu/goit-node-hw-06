const Joi = require('joi');

const schema = Joi.object({
  email: Joi.string().email({ minDomainSegments: 2 }).required(),
  password: Joi.string().required(),
});

const userSubscriptionSchema = Joi.object({
  id: Joi.string().required(),
  subscription: Joi.string().valid('starter', 'pro', 'business').required(),
});

const validateContact = (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).send({
      status: 'error',
      code: 400,
      data: 'Bad Request',
      message: `ValidationError: ${error.details[0].context.label} is required`,
    });
  }
  next();
};

const validateUser = (req, res, next) => {
  const { error } = userSubscriptionSchema.validate(req.body);
  if (error) {
    return res.status(400).send({
      status: 'error',
      code: 400,
      data: 'Bad Request',
      message: `ValidationError: ${error.details[0].context.label} is required`,
    });
  }
  next();
};

module.exports = { validateContact, validateUser };
