import { IGeographyQuestionnaireOptions } from '../interfaces/fieldsComponent.interface';

const geographyQuestionnaireOptions: IGeographyQuestionnaireOptions = {
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
  },
};

export { geographyQuestionnaireOptions };
