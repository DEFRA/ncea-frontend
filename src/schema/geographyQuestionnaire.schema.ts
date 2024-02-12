import Joi from 'joi';
import { isEmpty } from '../utils/isEmpty';

const geographyQuestionnaireSchema = Joi.object({
  north: Joi.string()
    .optional()
    .allow('')
    .pattern(/^[-]?([0-9]|[1-8][0-9]|90)(\.\d+)?$/)
    .messages({
      'string.base': 'This is not a valid input',
      'string.pattern.base': 'This is not a valid input',
    }),
  south: Joi.string()
    .optional()
    .allow('')
    .pattern(/^[-]?([0-9]|[1-8][0-9]|90)(\.\d+)?$/)
    .messages({
      'string.base': 'This is not a valid input',
      'string.pattern.base': 'This is not a valid input',
    }),
  west: Joi.string()
    .optional()
    .allow('')
    .pattern(/^[-]?((1[0-7][0-9])|([0-9]{1,2}))(\.\d+)?|180(\.0+)?$/)
    .messages({
      'string.base': 'This is not a valid input',
      'string.pattern.base': 'This is not a valid input',
    }),
  east: Joi.string()
    .optional()
    .allow('')
    .pattern(/^[-]?((1[0-7][0-9])|([0-9]{1,2}))(\.\d+)?|180(\.0+)?$/)
    .messages({
      'string.base': 'This is not a valid input',
      'string.pattern.base': 'This is not a valid input',
    }),
  depth: Joi.string()
    .optional()
    .allow('')
    .pattern(/^[0-9]+$/)
    .messages({
      'string.base': 'This is not a valid input',
      'string.pattern.base': 'This is not a valid input',
    }),
})
  .and('north', 'south', 'east', 'west')
  .custom((value, helpers) => {
    const { north, south, east, west } = value;
    const coordinateFiledKeys: string[] = ['north', 'south', 'east', 'west'];

    const hasSomeCoordinates: boolean = !isEmpty(north) || !isEmpty(south) || !isEmpty(east) || !isEmpty(west);

    if (hasSomeCoordinates) {
      const missingCoordinates = coordinateFiledKeys.filter((point) => isEmpty(value[point]));
      if (missingCoordinates.length > 0) {
        return helpers.error('coordinates.all_required', {
          errors: missingCoordinates,
        });
      }
    }

    return value;
  })
  .messages({
    'coordinates.all_required': 'You must enter all four coordinates',
  })
  .options({ abortEarly: false });

export { geographyQuestionnaireSchema };
