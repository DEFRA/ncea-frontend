import Joi from 'joi';

export const dateSchema = Joi.object()
  .options({ abortEarly: false })
  .keys({
    'from-date-day': Joi.number().allow('').optional(),
    'from-date-month': Joi.number().allow('').optional(),
    'from-date-year': Joi.number().required().messages({
      'number.base': `The date must include a year`,
      'number.empty': `The date must include a year`,
      'any.required': `The date must include a year`,
    }),
    'to-date-day': Joi.number().allow('').optional(),
    'to-date-month': Joi.number().allow('').optional(),
    'to-date-year': Joi.number().required().messages({
      'number.base': `The date must include a year`,
      'number.empty': `The date must include a year`,
      'any.required': `The date must include a year`,
    }),
  });
