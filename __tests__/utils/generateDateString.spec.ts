import { generateDateString } from '../../src/utils/generateDateString';

describe('Generate Date string', () => {
  it('should generate a date string with default month and day', () => {
    const dateObject = { year: 2023 };
    expect(generateDateString(dateObject)).toBe('2023-01-01');
  });

  it('should generate a date string with provided month and day', () => {
    const dateObject = { year: 2023, month: 6, day: 15 };
    expect(generateDateString(dateObject)).toBe('2023-06-15');
  });

  it('should generate a date string with default month and provided day', () => {
    const dateObject = { year: 2023, day: 10 };
    expect(generateDateString(dateObject)).toBe('2023-01-10');
  });

  it('should generate a date string with default day and provided month', () => {
    const dateObject = { year: 2023, month: 10 };
    expect(generateDateString(dateObject)).toBe('2023-10-01');
  });
});
