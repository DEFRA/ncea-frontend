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
    type: 'text',
    attributes: {
      altName: 'nth',
    },
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
    type: 'text',
    attributes: {
      altName: 'sth',
    },
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
    type: 'text',
    attributes: {
      altName: 'est',
    },
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
    type: 'text',
    attributes: {
      altName: 'wst',
    },
  },
};

export { geographyQuestionnaireOptions };
