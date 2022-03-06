import Joi from 'joi';

export const noteSchema = Joi.object({
  title: Joi.string().min(3).max(50).required(),
  content: Joi.string().min(3).max(2000).required(),
});
