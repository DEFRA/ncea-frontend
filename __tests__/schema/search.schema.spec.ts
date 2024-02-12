import { searchSchema } from '../../src/schema/search.schema';

describe('Quick search schema', () => {
  describe('Check the data passed', () => {
    it('should keep provided values for fields if available', () => {
      const validData = {
        search_term: 'north sea fish',
      };

      const { value } = searchSchema.validate(validData);
      expect(value['search_term']).toEqual('north sea fish');
    });
  });

  describe('Check the Validation', () => {
    it('should validate a valid search text', () => {
      const validData = {
        search_term: 'north sea fish',
      };

      const { error } = searchSchema.validate(validData);
      expect(error).toBeUndefined();
    });

    it('should invalidate with invalid search term', () => {
      const invalidData = {
        search_term: 'q',
      };

      const { error } = searchSchema.validate(invalidData);
      expect(error).toBeDefined();
      expect(error?.details[0]?.message).toContain(
        '"Search Text" length must be at least 4 characters long',
      );
    });

    it('should invalidate with empty search text', () => {
      const invalidData = {
        search_term: '',
      };

      const { error } = searchSchema.validate(invalidData);
      expect(error).toBeDefined();
      expect(error?.details[0]?.message).toContain(
        'Please enter keywords into the search field.',
      );
    });
  });
});
