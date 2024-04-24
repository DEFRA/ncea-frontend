import { IDateInputComponent } from '../interfaces/fieldsComponent.interface';

const fieldset: { [key: string]: Record<string, string> } = {
  legend: {
    text: 'You must enter a year, for example, 2007',
  },
};
const hint: Record<string, string> = {
  text: 'You can choose to enter a day or month, for example, 27 3 2007',
};

export const returnItemOptions = (id: string, classes: string) => ({
  id,
  name: id,
  classes,
});

export const fromDate: IDateInputComponent = {
  id: 'from-date',
  name: 'from-date',
  namePrefix: 'from-date',
  fieldset,
  hint,
  items: [
    {
      ...returnItemOptions('day', 'govuk-input--width-2'),
      attributes: { altName: 'fdd' },
    },
    {
      ...returnItemOptions('month', 'govuk-input--width-2'),
      attributes: { altName: 'fdm' },
    },
    {
      ...returnItemOptions('year', 'govuk-input--width-4'),
      attributes: { altName: 'fdy' },
    },
  ],
};

export const toDate: IDateInputComponent = {
  id: 'to-date',
  name: 'to-date',
  namePrefix: 'to-date',
  fieldset,
  hint,
  items: [
    {
      ...returnItemOptions('day', 'govuk-input--width-2'),
      attributes: { altName: 'tdd' },
    },
    {
      ...returnItemOptions('month', 'govuk-input--width-2'),
      attributes: { altName: 'tdm' },
    },
    {
      ...returnItemOptions('year', 'govuk-input--width-4'),
      attributes: { altName: 'tdy' },
      classes: 'govuk-input--width-4',
    },
  ],
};
