import Joi from 'joi';

import { formKeys } from './constants';
import { FormFieldError, GovUKItems } from '../models/interfaces/guidedSearch';

export const transformErrors = (error: Joi.ValidationError, formName: string): FormFieldError | undefined => {
  if (formName === formKeys.dateQuestionnaire) {
    return dateErrorHandler(error);
  }
};

const dateErrorHandler = (error: Joi.ValidationError): FormFieldError | undefined => {
  let fromError: string = '';
  const fromItems: GovUKItems[] = [];
  let toError: string = '';
  const toItems: GovUKItems[] = [];
  console.log(error);

  Object.keys(error._original).forEach((field) => {
    const item = {
      classes: `${field.includes('-year') ? 'govuk-input--width-4' : 'govuk-input--width-2'}`,
      name: field.toString().replace('from-date-', '').replace('to-date-', ''),
      value: error._original[field],
    };
    let errorMessage = '';
    const hasError = error.details.filter((ed) => ed.path[0] === field);
    if (hasError && hasError.length > 0) {
      errorMessage = `${hasError[0].message}.`;
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
