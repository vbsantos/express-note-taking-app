import Joi from 'joi';

export const registrationSchema = Joi.object({
  name: Joi.string().min(3).max(30).label('Name')
    .required(),
  email: Joi.string().email().label('E-mail')
    .required(),
  password: Joi.string().min(8).max(30).label('Password')
    .required(),
  password2: Joi.string().valid(Joi.ref('password')).messages({ 'any.only': 'passwords must match' })
    .required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().label('E-mail')
    .required(),
  password: Joi.string().min(8).max(30).label('Password')
    .required(),
});
