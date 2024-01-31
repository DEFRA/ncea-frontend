import { isEmpty } from '../../src/utils/isEmpty';

describe('Check the isEmpty function', () => {
  it('should return true for empty string', async () => {
    expect(isEmpty('')).toBe(true);
  });

  it('should return false for non-empty string', async () => {
    expect(isEmpty('hello')).toBe(false);
  });

  it('should return true for null', async () => {
    expect(isEmpty(null)).toBe(true);
  });

  it('should return true for undefined', async () => {
    expect(isEmpty(undefined)).toBe(true);
  });

  it('should return false for numbers', async () => {
    expect(isEmpty(2)).toBe(false);
  });
});
