import Joi from 'joi';

export const noteSchema = Joi.object({
  title: Joi.string().min(3).max(100).label('Title')
    .required(),
  content: Joi.string().min(3).label('Content')
    .required(),
});
