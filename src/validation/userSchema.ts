import Joi from 'joi';

const loginValidation = {
  email: Joi.string().email().label('E-mail')
    .required(),
  password: Joi.string().min(8).max(30).label('Password')
    .required(),
};

const registrationValidation = {
  ...loginValidation,
  name: Joi.string().min(3).max(30).label('Name')
    .required(),
  password2: Joi.string().valid(Joi.ref('password')).messages({ 'any.only': 'passwords must match' })
    .required(),
};

export const loginSchema = Joi.object(loginValidation);

export const registrationSchema = Joi.object(registrationValidation);
