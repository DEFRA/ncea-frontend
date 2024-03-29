import { geographyQuestionnaireOptions } from '../../src/data/geographyQuestionnaireOptions';
import {
  IFormFieldOptions,
  ITextInputComponent,
} from '../../src/interfaces/fieldsComponent.interface';

const fieldOptions = { ...geographyQuestionnaireOptions };
const depthFieldOptions = fieldOptions['depth'];
const depthFieldClasses = depthFieldOptions?.classes ?? '';
const depthFieldWithError: ITextInputComponent = {
  ...depthFieldOptions,
  classes: `${depthFieldClasses} govuk-input--error`,
  value: '-34',
  errorMessage: {
    text: 'This is not a valid input',
  },
};

const geographyFormOptionWithDepthError: IFormFieldOptions = {
  ...fieldOptions,
  depth: depthFieldWithError,
};

export { geographyFormOptionWithDepthError };
