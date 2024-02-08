import { searchSchema } from '../../src/schema/search.schema';

describe('Quick search schema', () => {
  describe('Check the data passed', () => {
    it('should keep provided values for fields if available', () => {
      const validData = {
        q: 'north sea fish'
      };

      const { value } = searchSchema.validate(validData);
      expect(value['q']).toEqual('north sea fish');
    });
  });

  describe('Check the Validation', () => {
    it('should validate a valid search text', () => {
      const validData = {
        q: 'north sea fish',
      };

      const { error } = searchSchema.validate(validData);
      expect(error).toBeUndefined();
    });

    it('should invalidate with invalid search term', () => {
      const invalidData = {
        q: 'q',
      };

      const { error } = searchSchema.validate(invalidData);
      expect(error).toBeDefined();
      expect(error?.details[0].message).toContain('"Search Text" length must be at least 4 characters long');
    });

    it('should invalidate with empty search text', () => {
      const invalidData = {
        q: '',
      };

      const { error } = searchSchema.validate(invalidData);
      expect(error).toBeDefined();
      expect(error?.details[0].message).toContain(
        'Please enter keywords into the search field.'
      );
    });
  });
});