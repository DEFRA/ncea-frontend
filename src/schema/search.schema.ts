import Joi from 'joi';

export const searchSchema = Joi.object({
  q: Joi.string().required().min(4).label('Search Field').messages({
    'string.empty': `Please enter keywords into the search field.`,
  }),
  pageName: Joi.string(),
}).options({ abortEarly: false });
