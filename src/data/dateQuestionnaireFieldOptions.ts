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
};
