import Joi from 'joi';

const thisYear = new Date().getFullYear();

export const dateSchema = Joi.object({
  'from-date-day': Joi.number().allow('').min(1).max(31).optional().label('Day'),
  'from-date-month': Joi.number().allow('').min(1).max(12).optional().label('Month'),
  'from-date-year': Joi.number().required().max(thisYear).messages({
    'number.base': `The date must include a valid year`,
    'number.empty': `The date must include a year`,
    'any.required': `The date must include a year`,
    'number.max': `The date must be in the past`,
    'any.custom': `The dates must be in chronological order`,
  }),
  'to-date-day': Joi.number().allow('').min(1).max(31).optional().label('Day'),
  'to-date-month': Joi.number().allow('').min(1).max(12).optional().label('Month'),
  'to-date-year': Joi.number()
    .required()
    .max(thisYear)
    .min(Joi.ref('from-date-year'))
    .messages({
      'number.base': `The date must include a valid year`,
      'number.empty': `The date must include a year`,
      'any.required': `The date must include a year`,
      'number.max': `The date must be in the past`,
      'number.min': `The year must be in chronological order`,
      'any.custom': `The dates must be in chronological order`,
      'any.ref': `The from year is missing`,
    })
    .custom((value, helpers) => {
      const fields = helpers.state.ancestors[0];
      const anyEmptyField = Object.keys(fields).filter((key) => fields[key].toString().length === 0);
      if (anyEmptyField.length === 0) {
        const fromDate = new Date(
          `${fields['from-date-year']}-${fields['from-date-month']}-${fields['from-date-day']}`,
        );
        const toDate = new Date(`${fields['to-date-year']}-${fields['to-date-month']}-${fields['to-date-day']}`);
        console.log({ fromDate, toDate });
        if (fromDate > toDate) {
          return helpers.error('any.custom', {
            errors: [
              'to-date-day',
              'to-date-month',
              'to-date-year',
              'from-date-day',
              'from-date-month',
              'from-date-year',
            ],
          });
        }
        return true;
      }
    }, 'date-questionnaire-validation'),
}).options({ abortEarly: false });
