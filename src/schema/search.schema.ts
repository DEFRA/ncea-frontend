import Joi from 'joi';

export const searchSchema = Joi.object({
  search_term: Joi.string().required().min(4).label('Search text').messages({
    'string.empty': `Please enter keywords into the search field.`,
  }),
  pageName: Joi.string(),
}).options({ abortEarly: false, errors: { wrap: { label: false } } });
