import Joi from 'joi';

const noteValidation = {
  title: Joi.string().min(3).max(100).label('Title')
    .required(),
  content: Joi.string().min(3).label('Content')
    .required(),
};

export const noteSchema = Joi.object(noteValidation);
