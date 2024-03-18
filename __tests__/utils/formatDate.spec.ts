import { formatDate } from '../../src/utils/formatDate';

describe('Format the given date', () => {
  it('should format date without time correctly', () => {
    expect(formatDate('2012-03-29T00:00:00')).toBe('29 Mar 2012');
  });

  it('should format date with time correctly', () => {
    expect(formatDate('2012-03-29T06:00:00')).toBe('29 Mar 2012 @0600');
    expect(formatDate('2012-03-29T14:30:00')).toBe('29 Mar 2012 @1430');
  });

  it('should format the partial date', () => {
    expect(formatDate('2012-03')).toBe('01 Mar 2012');
    expect(formatDate('2012-03-')).toBe('01 Mar 2012');
  });

  it('should format the date properly though day is not correct', async () => {
    expect(formatDate('2022-02-31T00:00:00')).toBe('03 Mar 2022');
    expect(formatDate('2022-04-31T00:00:00')).toBe('01 May 2022');
  });

  it('should format the next date if the hour is 24', async () => {
    expect(formatDate('2022-12-01T24:00:00')).toBe('02 Dec 2022');
  });

  it('should format the date with suffix and time correctly', async () => {
    expect(formatDate('2012-03-29T06:00:00', true, true)).toBe(
      '29th Mar 2012 @0600',
    );
  });

  it('should format the date with suffix and without time correctly', async () => {
    expect(formatDate('2012-03-29T06:00:00', false, true)).toBe(
      '29th Mar 2012',
    );
    expect(formatDate('2012-03-11T06:00:00', false, true)).toBe(
      '11th Mar 2012',
    );
    expect(formatDate('2012-03-01T06:00:00', false, true)).toBe(
      '01st Mar 2012',
    );
    expect(formatDate('2012-03-02T06:00:00', false, true)).toBe(
      '02nd Mar 2012',
    );
    expect(formatDate('2012-03-03T06:00:00', false, true)).toBe(
      '03rd Mar 2012',
    );
  });

  it('should handle invalid date strings', () => {
    expect(formatDate('')).toBe('');
    expect(formatDate('invalid date')).toBe('');
    expect(formatDate('2022-13-01T00:00:00')).toBe('');
  });
});
