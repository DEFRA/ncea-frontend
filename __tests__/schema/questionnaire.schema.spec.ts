import { dateSchema } from '../../src/schema/questionnaire.schema';

describe('Date Questionnaire Schema', () => {
  describe('Check the data passed', () => {
    it('should keep provided values for fields if available', () => {
      const validData = {
        'from-date-day': 1,
        'from-date-month': 5,
        'from-date-year': 2021,
        'to-date-day': 1,
        'to-date-month': 1,
        'to-date-year': 2023,
      };

      const { value } = dateSchema.validate(validData);
      expect(value['from-date-day']).toEqual(1);
      expect(value['from-date-month']).toEqual(5);
      expect(value['from-date-year']).toEqual(2021);
      expect(value['to-date-day']).toEqual(1);
      expect(value['to-date-month']).toEqual(1);
      expect(value['to-date-year']).toEqual(2023);
    });
  });

  describe('Check the Validation', () => {
    it('should validate a valid date questionnaire', () => {
      const validData = {
        'from-date-day': '',
        'from-date-month': 5,
        'from-date-year': 2023,
        'to-date-day': 1,
        'to-date-month': '',
        'to-date-year': 2024,
      };

      const { error } = dateSchema.validate(validData);
      expect(error).toBeUndefined();
    });

    it('should invalidate with invalid chronological order', () => {
      const invalidData = {
        'from-date-day': 1,
        'from-date-month': 5,
        'from-date-year': 2023,
        'to-date-day': 1,
        'to-date-month': 1,
        'to-date-year': 2023,
      };

      const { error } = dateSchema.validate(invalidData);
      expect(error).toBeDefined();
      expect(error?.details[0]?.message).toContain(
        'The dates must be in chronological order',
      );
    });

    it('should invalidate with invalid year', () => {
      const invalidData = {
        'from-date-day': 1,
        'from-date-month': 5,
        'from-date-year': 2023,
        'to-date-day': 1,
        'to-date-month': 1,
        'to-date-year': 'sdsdsdf',
      };

      const { error } = dateSchema.validate(invalidData);
      expect(error).toBeDefined();
      expect(error?.details[0]?.message).toContain(
        'The date must include a valid year',
      );
    });

    it('should invalidate with future date', () => {
      const invalidData = {
        'from-date-day': 1,
        'from-date-month': 5,
        'from-date-year': 2023,
        'to-date-day': 1,
        'to-date-month': 1,
        'to-date-year': 2030,
      };

      const { error } = dateSchema.validate(invalidData);
      expect(error).toBeDefined();
      expect(error?.details[0]?.message).toContain(
        'The date must be in the past',
      );
    });

    it('should invalidate with empty year', () => {
      const invalidData = {
        'from-date-day': 1,
        'from-date-month': 5,
        'from-date-year': 2023,
        'to-date-day': 1,
        'to-date-month': 1,
        'to-date-year': '',
      };

      const { error } = dateSchema.validate(invalidData);
      expect(error).toBeDefined();
      expect(error?.details[0]?.message).toContain(
        'The date must include a valid year',
      );
    });

    it('should invalidate with invalid day in from-date', () => {
      const invalidData = {
        'from-date-day': 32,
        'from-date-month': 5,
        'from-date-year': 2023,
        'to-date-day': 1,
        'to-date-month': 6,
        'to-date-year': 2024,
      };

      const { error } = dateSchema.validate(invalidData);
      expect(error).toBeDefined();
      expect(error?.details[0]?.message).toContain('"Day" must be less than or equal to 31');
    });


  it('should invalidate when from-date is not a valid date', () => {
    const invalidData = {
      'from-date-day': 31,
      'from-date-month': 2,
      'from-date-year': 2023,
      'to-date-day': 1,
      'to-date-month': 3,
      'to-date-year': 2024,
    };

    const { error } = dateSchema.validate(invalidData);
    expect(error).toBeDefined();
    expect(error?.details[0]?.message).toContain('The date must be a valid date');
  });

  it('should invalidate when to-date is not a valid date', () => {
    const invalidData = {
      'from-date-day': 1,
      'from-date-month': 3,
      'from-date-year': 2023,
      'to-date-day': 31,
      'to-date-month': 2,
      'to-date-year': 2024,
    };

    const { error } = dateSchema.validate(invalidData);
    expect(error).toBeDefined();
    expect(error?.details[0]?.message).toContain('The date must be a valid date');
  });

  it('should invalidate when all fields are empty', () => {
    const invalidData = {
      'from-date-day': '',
      'from-date-month': '',
      'from-date-year': '',
      'to-date-day': '',
      'to-date-month': '',
      'to-date-year': '',
    };

    const { error } = dateSchema.validate(invalidData);
    expect(error).toBeDefined();
    expect(error?.details[0]?.message).toContain('The date must include a valid year');
  });

    it('should invalidate with invalid day in to-date', () => {
      const invalidData = {
        'from-date-day': 1,
        'from-date-month': 5,
        'from-date-year': 2023,
        'to-date-day': 32,
        'to-date-month': 6,
        'to-date-year': 2024,
      };

      const { error } = dateSchema.validate(invalidData);
      expect(error).toBeDefined();
      expect(error?.details[0]?.message).toContain('"Day" must be less than or equal to 31');
    });

    it('should invalidate with wrong month', () => {
      const invalidData = {
        'from-date-day': 1,
        'from-date-month': 15,
        'from-date-year': 2023,
        'to-date-day': 1,
        'to-date-month': 1,
        'to-date-year': 2024,
      };

      const { error } = dateSchema.validate(invalidData);
      expect(error).toBeDefined();
      expect(error?.details[0]?.message).toContain(
        '"Month" must be less than or equal to 12',
      );
    });
  });
});
