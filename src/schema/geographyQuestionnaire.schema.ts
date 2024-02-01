import Joi from 'joi';
import { isEmpty } from '../utils/isEmpty';

const geographyQuestionnaireSchema = Joi.object({
  north: Joi.number().optional().allow('').messages({
    'number.base': 'This is not a valid input',
  }),
  south: Joi.number().optional().allow('').messages({
    'number.base': 'This is not a valid input',
  }),
  west: Joi.number().optional().allow('').messages({
    'number.base': 'This is not a valid input',
  }),
  east: Joi.number().optional().allow('').messages({
    'number.base': 'This is not a valid input',
  }),
  depth: Joi.number().optional().allow('').positive().messages({
    'number.base': 'This is not a valid input',
    'number.positive': 'This is not a valid input',
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
