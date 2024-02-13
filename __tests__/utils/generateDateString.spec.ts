import { generateDateString } from '../../src/utils/generateDateString';

describe('Generate Date string', () => {
  describe('If the requested date string is for the FROM Date', () => {
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

  describe('If the requested date string is for the TO Date', () => {
    it('should generate a date string with default month and day', () => {
      const dateObject = { year: 2023 };
      expect(generateDateString(dateObject, true)).toBe('2023-01-31');
    });

    it('should generate a date string with provided month and day', () => {
      const dateObject = { year: 2023, month: 6, day: 15 };
      expect(generateDateString(dateObject, true)).toBe('2023-06-15');
    });

    it('should generate a date string with default month and provided day', () => {
      const dateObject = { year: 2023, day: 10 };
      expect(generateDateString(dateObject, true)).toBe('2023-01-10');
    });

    it('should generate a date string with default day and provided month', () => {
      const dateObject = { year: 2023, month: 10 };
      expect(generateDateString(dateObject, true)).toBe('2023-10-31');
    });

    it('should generate a date string when day is empty then with last month of the day if the provided month is current month', () => {
      const currentDate = new Date();
      const month = currentDate.getMonth() + 1;
      const day = currentDate.getDate();
      const dateObject = { year: 2023, month };
      const expectedMonth = month.toString().length === 1 ? `0${month}` : month;
      const expectedDay = day.toString().length === 1 ? `0${day}` : day;
      expect(generateDateString(dateObject, true)).toBe(
        `2023-${expectedMonth}-${expectedDay}`,
      );
    });
  });
});
