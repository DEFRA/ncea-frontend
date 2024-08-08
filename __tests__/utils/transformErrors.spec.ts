'use strict';

import Joi from 'joi';
import {
  dateQuestionChronologicalError,
  dateQuestionChronologicalJoiError,
} from '../data/dateQuestionnaire';
import {
  transformErrors,
  transformTextInputError,
  dateErrorHandler
} from '../../src/utils/transformErrors';
import { formKeys } from '../../src/utils/constants';
import { IFormFieldOptions } from '../../src/interfaces/fieldsComponent.interface';

describe('Transform Errors utilities', () => {
  it('should transform Joi error to GovUK error message and items', async () => {
    expect(
      transformErrors(
        dateQuestionChronologicalJoiError,
        formKeys.dateQuestionnaire
      )
    ).toStrictEqual(dateQuestionChronologicalError);
  });

  describe('Check Text input transform errors utility', () => {
    it('should transform the default input error correctly', async () => {
      const formOptions: IFormFieldOptions = {
        field: {
          id: 'field',
          name: 'field',
          value: '',
          classes: '',
          errorMessage: {
            text: '',
          },
        },
      };

      const error = new Joi.ValidationError(
        'Validation failed',
        [
          {
            path: ['field'],
            type: 'any.required',
            message: 'Field is required',
            context: { errors: ['field'] },
          },
        ],
        {
          field: '',
        }
      );
      const transformedOptions = await transformTextInputError(
        formOptions,
        error
      );

      expect(transformedOptions).toHaveProperty('field');
      expect(transformedOptions.field).toHaveProperty('value');
      expect(transformedOptions.field).toHaveProperty(
        'classes',
        'govuk-input--error'
      );
      expect(transformedOptions.field).toHaveProperty(
        'errorMessage.text',
        'Field is required.'
      );
    });

    it('should transform the input error correctly with classes', async () => {
      const formOptions: IFormFieldOptions = {
        field: {
          id: 'field',
          name: 'field',
          value: '',
          classes: 'test-class',
          errorMessage: {
            text: '',
          },
        },
      };

      const error = new Joi.ValidationError(
        'Validation failed',
        [
          {
            path: ['field'],
            type: 'any.required',
            message: 'Field is required',
            context: { errors: ['field'] },
          },
        ],
        {
          field: '',
        }
      );
      const transformedOptions = await transformTextInputError(
        formOptions,
        error
      );

      expect(transformedOptions).toHaveProperty('field');
      expect(transformedOptions.field).toHaveProperty('value');
      expect(transformedOptions.field).toHaveProperty(
        'classes',
        'test-class govuk-input--error'
      );
      expect(transformedOptions.field).toHaveProperty(
        'errorMessage.text',
        'Field is required.'
      );
    });

    it('should transform the input error correctly with path alone', async () => {
      const formOptions: IFormFieldOptions = {
        field: {
          id: 'field',
          name: 'field',
          value: '',
          classes: 'test-class',
          errorMessage: {
            text: '',
          },
        },
      };

      const error = new Joi.ValidationError(
        'Validation failed',
        [
          {
            path: ['field'],
            type: 'any.required',
            message: 'Field is required',
          },
        ],
        {
          field: '',
        }
      );
      const transformedOptions = await transformTextInputError(
        formOptions,
        error
      );

      expect(transformedOptions).toHaveProperty('field');
      expect(transformedOptions.field).toHaveProperty('value');
      expect(transformedOptions.field).toHaveProperty(
        'classes',
        'test-class govuk-input--error'
      );
      expect(transformedOptions.field).toHaveProperty(
        'errorMessage.text',
        'Field is required.'
      );
    });
  });

  describe('Date error handler utility', () => {
    it('should delete today-date key from error._original if it exists', () => {
      const error = new Joi.ValidationError(
        'Validation failed',
        [],
        {
          'today-date': '2024-08-08',
          'from-date-day': '01',
          'from-date-month': '01',
          'from-date-year': '2020'
        }
      );
      const result = dateErrorHandler(error);
      expect(error._original).not.toHaveProperty('today-date');
      expect(result).toHaveProperty('fromItems');
      if (result?.fromItems) {
        expect(result?.fromItems.length).toBeGreaterThan(0);
      } else {
        fail('fromItems is undefined');
      }
    });
    it('should handle errors without today-date key correctly', () => {
      const error = new Joi.ValidationError(
        'Validation failed',
        [],
        {
          'from-date-day': '01',
          'from-date-month': '01',
          'from-date-year': '2020'
        }
      );
      const result = dateErrorHandler(error);
      expect(result).toHaveProperty('fromItems');
      if (result?.fromItems) {
        expect(result.fromItems.length).toBeGreaterThan(0);
      } else {
        fail('fromItems is undefined');
      }
    });

   });
});
