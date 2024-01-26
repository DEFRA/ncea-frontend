import Joi from 'joi';

const thisYear = new Date().getFullYear();
export const dateSchema = Joi.object()
  .options({ abortEarly: false })
  .keys({
    'from-date-day': Joi.number().allow('').min(1).max(31).optional(),
    'from-date-month': Joi.number().allow('').min(1).max(12).optional(),
    'from-date-year': Joi.number().required().max(thisYear).messages({
      'number.base': `The date must include a year`,
      'number.empty': `The date must include a year`,
      'any.required': `The date must include a year`,
      'number.max': `The date must be in the past`
    }),
    'to-date-day': Joi.number().allow('').min(1).max(31).optional(),
    'to-date-month': Joi.number().allow('').min(1).max(12).optional(),
    'to-date-year': Joi.number().required().max(thisYear).messages({
      'number.base': `The date must include a year`,
      'number.empty': `The date must include a year`,
      'any.required': `The date must include a year`,
      'number.max': `The date must be in the past`
    }),
  });
