import { IFormFieldOptions } from '../interfaces/fieldsComponent.interface';

const geographyQuestionnaireOptions: IFormFieldOptions = {
  north: {
    id: 'north',
    name: 'north',
    label: {
      text: 'North',
    },
    hint: {
      text: 'For example, -4.351',
    },
    formGroup: {
      classes: 'govuk-!-margin-0',
    },
    type: 'number',
  },
  south: {
    id: 'south',
    name: 'south',
    label: {
      text: 'South',
    },
    hint: {
      text: 'For example, -4.351',
    },
    formGroup: {
      classes: 'govuk-!-margin-0',
    },
    type: 'number',
  },
  east: {
    id: 'east',
    name: 'east',
    label: {
      text: 'East',
    },
    hint: {
      text: 'For example, -4.351',
    },
    formGroup: {
      classes: 'govuk-!-margin-0',
    },
    type: 'number',
  },
  west: {
    id: 'west',
    name: 'west',
    label: {
      text: 'West',
    },
    hint: {
      text: 'For example, -4.351',
    },
    formGroup: {
      classes: 'govuk-!-margin-0',
    },
    type: 'number',
  },
  depth: {
    id: 'depth',
    name: 'depth',
    label: {
      text: 'Depth or vertical extent in metres (m)',
    },
    hint: {
      text: 'For example, 21',
    },
    formGroup: {
      classes: 'govuk-!-margin-0',
    },
    type: 'number',
  },
};

export { geographyQuestionnaireOptions };
