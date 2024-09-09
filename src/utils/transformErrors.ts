import Joi from 'joi';
import { formKeys } from './constants';
import { FormFieldError, GovUKItems } from '../interfaces/guidedSearch.interface';
import { IFormFieldOptions, ITextInputComponent } from '../interfaces/fieldsComponent.interface';

const transformErrors = (error: Joi.ValidationError, formName: string): FormFieldError | undefined => {
  if (formName === formKeys.dateQuestionnaire) {
    return dateErrorHandler(error);
  }
};

const transformTextInputError = async (
  formOptions: IFormFieldOptions,
  error: Joi.ValidationError,
): Promise<IFormFieldOptions> => {
  const newFormOptions = { ...formOptions };
  Object.keys(error._original).forEach((field) => {
    let fieldOptions: ITextInputComponent = { ...newFormOptions[field] };
    fieldOptions = {
      ...fieldOptions,
      value: error._original[field],
    };
    let errorMessage = '';
    const hasError = error.details.filter((item) => {
      if (item?.context?.errors) {
        return item.context.errors.includes(field);
      } else {
        return item.path.includes(field);
      }
    });

    if (hasError && hasError.length > 0 && hasError[0]?.message) {
      errorMessage = `${hasError[0].message}.`;
      const updatedClasses = fieldOptions.classes ? `${fieldOptions.classes} govuk-input--error` : 'govuk-input--error';
      fieldOptions = {
        ...fieldOptions,
        classes: updatedClasses,
        errorMessage: {
          ...fieldOptions.errorMessage,
          text: errorMessage,
        },
      };
    }
    newFormOptions[field] = { ...fieldOptions };
  });
  return newFormOptions;
};

const dateErrorHandler = (error: Joi.ValidationError): FormFieldError | undefined => {
  let fromError: string = '';
  const fromItems: GovUKItems[] = [];
  const altNameMatrix: Record<string, string> = {
    'from-date-day': 'fdd',
    'from-date-month': 'fdm',
    'from-date-year': 'fdy',
    'to-date-day': 'tdd',
    'to-date-month': 'tdm',
    'to-date-year': 'tdy',
  };
  let toError: string = '';
  const toItems: GovUKItems[] = [];

  if (error._original && 'today-date' in error._original) {
    delete error._original['today-date'];
  }
  Object.keys(error._original).forEach((field) => {
    const item = {
      classes: `${field.includes('-year') ? 'govuk-input--width-4' : 'govuk-input--width-2'}`,
      name: field.toString().replace('from-date-', '').replace('to-date-', ''),
      attributes: { altName: altNameMatrix[field.toString()] },
      value: error._original[field],
    };
    let errorMessage = '';
    const hasError = error.details.filter((ed) => {
      if (ed?.context?.errors) {
        return ed.context.errors.includes(field);
      } else {
        return ed.path[0] === field;
      }
    });
    if (hasError && hasError.length > 0 && hasError[0]?.message) {
      errorMessage = `${hasError[0].message}.`;
      if (hasError[0].type === 'any.custom' && field !== 'to-date-year' && field !== 'from-date-year') {
        errorMessage = '';
      }
      item.classes = `${item.classes} govuk-input--error`;
    }

    if (field.includes('from-')) {
      fromError = `${fromError} ${errorMessage}`;
      fromItems.push(item);
    } else {
      toError = `${toError} ${errorMessage}`;
      toItems.push(item);
    }
  });

  return {
    fromError,
    fromItems,
    toError,
    toItems,
  };
};

export { transformErrors, transformTextInputError, dateErrorHandler };
