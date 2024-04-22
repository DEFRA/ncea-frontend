import { IDateInputComponent } from '../interfaces/fieldsComponent.interface';

export const fromDate: IDateInputComponent = {
  id: 'from-date',
  name: 'from-date',
  namePrefix: 'from-date',
  fieldset: {
    legend: {
      text: 'You must enter a year, for example, 2007',
    },
  },
  hint: {
    text: 'You can choose to enter a day or month, for example, 27 3 2007',
  },
  items: [
    {
      id: 'day',
      name: 'day',
      attributes: { altName: 'fdd' },
      classes: 'govuk-input--width-2',
    },
    {
      id: 'month',
      name: 'month',
      attributes: { altName: 'fdm' },
      classes: 'govuk-input--width-2',
    },
    {
      id: 'year',
      name: 'year',
      attributes: { altName: 'fdy' },
      classes: 'govuk-input--width-4',
    },
  ],
};

export const toDate: IDateInputComponent = {
  id: 'to-date',
  name: 'to-date',
  namePrefix: 'to-date',
  fieldset: {
    legend: {
      text: 'You must enter a year, for example, 2007',
    },
  },
  hint: {
    text: 'You can choose to enter a day or month, for example, 27 3 2007',
  },
  items: [
    {
      id: 'day',
      name: 'day',
      attributes: { altName: 'tdd' },
      classes: 'govuk-input--width-2',
    },
    {
      id: 'month',
      name: 'month',
      attributes: { altName: 'tdm' },
      classes: 'govuk-input--width-2',
    },
    {
      id: 'year',
      name: 'year',
      attributes: { altName: 'tdy' },
      classes: 'govuk-input--width-4',
    },
  ],
};
