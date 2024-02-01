import Joi from 'joi';
import { isEmpty } from '../utils/isEmpty';

const geographyQuestionnaireSchema = Joi.object({
  north: Joi.number().optional().allow('').messages({
    'number.base': 'This is not a valid input',
  }),
  south: Joi.number().optional().allow('').allow('').messages({
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

    const hasSomeCoordinates: boolean =
      !isEmpty(north) || !isEmpty(south) || !isEmpty(east) || !isEmpty(west);

    const missingCoordinate: string[] = [];

    if (hasSomeCoordinates) {
      if (isEmpty(north)) missingCoordinate.push('north');
      if (isEmpty(south)) missingCoordinate.push('south');
      if (isEmpty(east)) missingCoordinate.push('east');
      if (isEmpty(west)) missingCoordinate.push('west');
    }

    if (missingCoordinate.length > 0) {
      return helpers.error('coordinates.all_required', {
        errors: missingCoordinate,
      });
    }

    return value;
  })
  .messages({
    'coordinates.all_required': 'You must enter all four coordinates',
  })
  .options({ abortEarly: false });

export { geographyQuestionnaireSchema };
