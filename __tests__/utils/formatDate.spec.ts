import { formatDate } from '../../src/utils/formatDate';

describe('Format the given date', () => {
  it('should format date without time correctly', () => {
    expect(formatDate('2012-03-29T00:00:00')).toBe('29 March 2012');
  });

  it('should format date with time correctly', () => {
    expect(formatDate('2012-03-29T06:00:00')).toBe('29 March 2012 at 6am');
    expect(formatDate('2012-03-29T14:30:00')).toBe('29 March 2012 at 14:30pm');
  });

  it('should format the partial date', () => {
    expect(formatDate('2012-03')).toBe('1 March 2012');
    expect(formatDate('2012-03-')).toBe('1 March 2012');
  });

  it('should format the date properly though day is not correct', async () => {
    expect(formatDate('2022-02-31T00:00:00')).toBe('3 March 2022');
    expect(formatDate('2022-04-31T00:00:00')).toBe('1 May 2022');
  });

  it('should format the next date if the hour is 24', async () => {
    expect(formatDate('2022-12-01T24:00:00')).toBe('2 December 2022');
  });

  it('should format the date with suffix and time correctly', async () => {
    expect(formatDate('2012-03-29T06:00:00', true, true)).toBe(
      '29th March 2012 at 6am',
    );
  });

  it('should format the date with suffix and without time correctly', async () => {
    expect(formatDate('2012-03-29T06:00:00', false, true)).toBe(
      '29th March 2012',
    );
    expect(formatDate('2012-03-11T06:00:00', false, true)).toBe(
      '11th March 2012',
    );
    expect(formatDate('2012-03-01T06:00:00', false, true)).toBe(
      '1st March 2012',
    );
    expect(formatDate('2012-03-02T06:00:00', false, true)).toBe(
      '2nd March 2012',
    );
    expect(formatDate('2012-03-03T06:00:00', false, true)).toBe(
      '3rd March 2012',
    );
  });

  it('should handle invalid date strings', () => {
    expect(formatDate('')).toBe('');
    expect(formatDate('invalid date')).toBe('');
    expect(formatDate('2022-13-01T00:00:00')).toBe('');
  });
});
