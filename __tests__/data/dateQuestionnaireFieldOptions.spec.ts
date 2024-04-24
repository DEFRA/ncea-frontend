import { returnItemOptions } from '../../src/data/dateQuestionnaireFieldOptions';
describe('returnItemOptions functions', () => {
  it('should return the item properties', () => {
    expect(returnItemOptions('day', 'govuk-input--width-2')).toEqual({
      id: 'day',
      name: 'day',
      classes: 'govuk-input--width-2',
    });
    expect(returnItemOptions('year', 'govuk-input--width-4')).toEqual({
      id: 'year',
      name: 'year',
      classes: 'govuk-input--width-4',
    });
  });
});
