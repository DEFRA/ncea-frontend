import Joi from 'joi';
import { geographyQuestionnaireSchema } from '../../src/schema/geographyQuestionnaire.schema';

describe('Geography Coordinate schema validation', () => {
  describe('Check the scenarios have no errors', () => {
    test('should validate with no errors with all fields present', async () => {
      const data = {
        north: 10,
        south: -10,
        west: -5,
        east: 5,
        depth: 20,
      };

      const results = geographyQuestionnaireSchema.validate(data, {
        abortEarly: false,
      });
      expect(results.error).toBe(undefined);
    });

    test('should validate with no errors with no depth alone present', async () => {
      const data = {
        north: 10,
        south: -10,
        west: -5,
        east: 5,
        depth: '',
      };

      const results = geographyQuestionnaireSchema.validate(data, {
        abortEarly: false,
      });
      expect(results.error).toBe(undefined);
    });

    test('should validate with no errors with decimal coordinate and no depth', async () => {
      const data = {
        north: 4.23222,
        south: -10,
        west: -5,
        east: 5,
        depth: '',
      };

      const results = geographyQuestionnaireSchema.validate(data, {
        abortEarly: false,
      });
      expect(results.error).toBe(undefined);
    });

    test('should validate with no errors with decimal coordinate having depth', async () => {
      const data = {
        north: -4.23222,
        south: -10,
        west: -5,
        east: 5,
        depth: 5000,
      };

      const results = geographyQuestionnaireSchema.validate(data, {
        abortEarly: false,
      });
      expect(results.error).toBe(undefined);
    });

    test('should validate with depth field alone', async () => {
      const data = {
        north: '',
        south: '',
        west: '',
        east: '',
        depth: 5000,
      };

      const results = geographyQuestionnaireSchema.validate(data, {
        abortEarly: false,
      });
      expect(results.error).toBe(undefined);
    });
  });

  describe('Check the scenarios having error message for each field alone', () => {
    test('should return an error with depth field negative', async () => {
      const data = {
        north: '',
        south: '',
        west: '',
        east: '',
        depth: -5000,
      };

      const results = geographyQuestionnaireSchema.validate(data, {
        abortEarly: false,
      });
      expect(results.error).not.toBe(undefined);
      expect(results.error?.details[0].message).toEqual(
        'This is not a valid input'
      );
    });

    test('should return an error with depth field not a number', async () => {
      const data = {
        north: '',
        south: '',
        west: '',
        east: '',
        depth: 'test',
      };

      const results = geographyQuestionnaireSchema.validate(data, {
        abortEarly: false,
      });
      expect(results.error).not.toBe(undefined);
      expect(results.error?.details[0].message).toEqual(
        'This is not a valid input'
      );
    });

    test('should return an error with north field not a number and having depth field', async () => {
      const data = {
        north: 'test',
        south: -10,
        west: -5,
        east: 5,
        depth: 50,
      };

      const results = geographyQuestionnaireSchema.validate(data, {
        abortEarly: false,
      });
      expect(results.error).not.toBe(undefined);
      expect(results.error?.details[0].message).toEqual(
        'This is not a valid input'
      );
    });

    test('should return an error with south field not a number and having depth field', async () => {
      const data = {
        north: 50.99,
        south: 'test',
        west: -5,
        east: 5,
        depth: 50,
      };

      const results = geographyQuestionnaireSchema.validate(data, {
        abortEarly: false,
      });
      expect(results.error).not.toBe(undefined);
      expect(results.error?.details[0].message).toEqual(
        'This is not a valid input'
      );
    });

    test('should return an error with west field not a number and having depth field', async () => {
      const data = {
        north: 50.99,
        south: -10,
        west: 'test',
        east: 5,
        depth: 50,
      };

      const results = geographyQuestionnaireSchema.validate(data, {
        abortEarly: false,
      });
      expect(results.error).not.toBe(undefined);
      expect(results.error?.details[0].message).toEqual(
        'This is not a valid input'
      );
    });

    test('should return an error with east field not a number and having depth field', async () => {
      const data = {
        north: 50.99,
        south: -10,
        west: 5,
        east: 'test',
        depth: 50,
      };

      const results = geographyQuestionnaireSchema.validate(data, {
        abortEarly: false,
      });
      expect(results.error).not.toBe(undefined);
      expect(results.error?.details[0].message).toEqual(
        'This is not a valid input'
      );
    });

    test('should return an error with north field not a number and having no depth field', async () => {
      const data = {
        north: 'test',
        south: -10,
        west: -5,
        east: 5,
        depth: '',
      };

      const results = geographyQuestionnaireSchema.validate(data, {
        abortEarly: false,
      });
      expect(results.error).not.toBe(undefined);
      expect(results.error?.details[0].message).toEqual(
        'This is not a valid input'
      );
    });

    test('should return an error with south field not a number and having no depth field', async () => {
      const data = {
        north: 50.99,
        south: 'test',
        west: -5,
        east: 5,
        depth: '',
      };

      const results = geographyQuestionnaireSchema.validate(data, {
        abortEarly: false,
      });
      expect(results.error).not.toBe(undefined);
      expect(results.error?.details[0].message).toEqual(
        'This is not a valid input'
      );
    });

    test('should return an error with west field not a number and having no depth field', async () => {
      const data = {
        north: 50.99,
        south: -10,
        west: 'test',
        east: 5,
        depth: '',
      };

      const results = geographyQuestionnaireSchema.validate(data, {
        abortEarly: false,
      });
      expect(results.error).not.toBe(undefined);
      expect(results.error?.details[0].message).toEqual(
        'This is not a valid input'
      );
    });

    test('should return an error with east field not a number and having no depth field', async () => {
      const data = {
        north: 50.99,
        south: -10,
        west: 5,
        east: 'test',
        depth: '',
      };

      const results = geographyQuestionnaireSchema.validate(data, {
        abortEarly: false,
      });
      expect(results.error).not.toBe(undefined);
      expect(results.error?.details[0].message).toEqual(
        'This is not a valid input'
      );
    });

    test('should return an error when having depth and north coordinate field is missing', async () => {
      const data = {
        north: '',
        south: -10,
        west: 5,
        east: 56,
        depth: 10,
      };

      const results = geographyQuestionnaireSchema.validate(data, {
        abortEarly: false,
      });
      expect(results.error).not.toBe(undefined);
      expect(results.error?.details[0].message).toEqual(
        'You must enter all four coordinates'
      );
    });

    test('should return an error when having depth and south coordinate field is missing', async () => {
      const data = {
        north: -10,
        south: '',
        west: 5,
        east: 56,
        depth: 10,
      };

      const results = geographyQuestionnaireSchema.validate(data, {
        abortEarly: false,
      });
      expect(results.error).not.toBe(undefined);
      expect(results.error?.details[0].message).toEqual(
        'You must enter all four coordinates'
      );
    });

    test('should return an error when having depth and west coordinate field is missing', async () => {
      const data = {
        north: -10,
        south: 5,
        west: '',
        east: 56,
        depth: 10,
      };

      const results = geographyQuestionnaireSchema.validate(data, {
        abortEarly: false,
      });
      expect(results.error).not.toBe(undefined);
      expect(results.error?.details[0].message).toEqual(
        'You must enter all four coordinates'
      );
    });

    test('should return an error when having depth and east coordinate field is missing', async () => {
      const data = {
        north: -10,
        south: 5,
        west: 56,
        east: '',
        depth: 10,
      };

      const results = geographyQuestionnaireSchema.validate(data, {
        abortEarly: false,
      });
      expect(results.error).not.toBe(undefined);
      expect(results.error?.details[0].message).toEqual(
        'You must enter all four coordinates'
      );
    });

    test('should return an error when north coordinate field is missing and having no depth', async () => {
      const data = {
        north: '',
        south: -10,
        west: 5,
        east: 56,
        depth: '',
      };

      const results = geographyQuestionnaireSchema.validate(data, {
        abortEarly: false,
      });
      expect(results.error).not.toBe(undefined);
      expect(results.error?.details[0].message).toEqual(
        'You must enter all four coordinates'
      );
    });

    test('should return an error when south coordinate field is missing and having no depth', async () => {
      const data = {
        north: -10,
        south: '',
        west: 5,
        east: 56,
        depth: '',
      };

      const results = geographyQuestionnaireSchema.validate(data, {
        abortEarly: false,
      });
      expect(results.error).not.toBe(undefined);
      expect(results.error?.details[0].message).toEqual(
        'You must enter all four coordinates'
      );
    });

    test('should return an error when west coordinate field is missing and having no depth', async () => {
      const data = {
        north: -10,
        south: 5,
        west: '',
        east: 56,
        depth: '',
      };

      const results = geographyQuestionnaireSchema.validate(data, {
        abortEarly: false,
      });
      expect(results.error).not.toBe(undefined);
      expect(results.error?.details[0].message).toEqual(
        'You must enter all four coordinates'
      );
    });

    test('should return an error when east coordinate field is missing and having no depth', async () => {
      const data = {
        north: -10,
        south: 5,
        west: 56,
        east: '',
        depth: '',
      };

      const results = geographyQuestionnaireSchema.validate(data, {
        abortEarly: false,
      });
      expect(results.error).not.toBe(undefined);
      expect(results.error?.details[0].message).toEqual(
        'You must enter all four coordinates'
      );
    });
  });

  describe('Check the scenarios having error messages for multiple fields', () => {
    test('should return an error with depth field negative and north alone is missing', async () => {
      const data = {
        north: '',
        south: -10,
        west: 5,
        east: 5,
        depth: -50,
      };

      const results = geographyQuestionnaireSchema.validate(data, {
        abortEarly: false,
      });
      expect(results.error).not.toBe(undefined);
      console.log(results.error?.details);
      const errorMessages = results.error?.details.map(
        (detail) => detail.message
      );

      expect(errorMessages).toContain('This is not a valid input');
      expect(errorMessages).toContain('You must enter all four coordinates');
      expect(errorMessages?.length).toEqual(2);
    });

    test('should return an error when having depth, north coordinate field is missing and south is not a number', async () => {
      const data = {
        north: '',
        south: 'test',
        west: 5,
        east: 56,
        depth: 10,
      };

      const results = geographyQuestionnaireSchema.validate(data, {
        abortEarly: false,
      });
      expect(results.error).not.toBe(undefined);
      console.log(results.error?.details);
      const errorMessages = results.error?.details.map(
        (detail) => detail.message
      );

      expect(errorMessages).toContain('This is not a valid input');
      expect(errorMessages).toContain('You must enter all four coordinates');
      expect(errorMessages?.length).toEqual(2);
    });
  });
});
