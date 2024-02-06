'use strict';

import * as errorTransformer from '../../../src/utils/transformErrors';
import {
  FormFieldError,
  IFormValidatorOptions,
} from '../../../src/interfaces/guidedSearch.interface';
import { Request, ResponseToolkit } from '@hapi/hapi';
import { SearchController } from '../../../src/controllers/web/SearchController';
import {
  formValidatorOptions,
  sharedDataStructure,
  webRoutePaths,
} from '../../../src/utils/constants';
import {
  fromDate,
  toDate,
} from '../../../src/data/dateQuestionnaireFieldOptions';
import {
  dateQuestionChronologicalError,
  dateQuestionnaireGovUKError,
} from '../../data/dateQuestionnaire';
import Joi from 'joi';
import { injectDynamicEnablingScript } from '../../../src/utils/enableSubmitButton';
import { geographyQuestionnaireOptions } from '../../../src/data/geographyQuestionnaireOptions';
import { geographyFormOptionWithDepthError } from '../../data/geographyQuestionnaire';
import { IFormFieldOptions } from '../../../src/interfaces/fieldsComponent.interface';

jest.mock('../../../src/services/handlers/searchApi', () => ({
  getSearchResults: jest.fn(),
}));

describe('Search Results Controller > deals with handlers', () => {
  describe('Deals with the quick search handler', () => {
    it('should update shared data and redirect to results', async () => {
      const request: Request = {
        payload: { search_term: 'example' },
        server: { updateSharedData: jest.fn() },
      } as any;
      const response: ResponseToolkit = { redirect: jest.fn() } as any;
      await SearchController.doQuickSearchHandler(request, response);
      expect(request.server.updateSharedData).toHaveBeenCalledWith(
        sharedDataStructure.searchTerm,
        'example'
      );
      expect(response.redirect).toHaveBeenCalledWith(webRoutePaths.results);
    });
  });

  describe('Deals with search results handler', () => {
    it('should return the rendered view with shared data', async () => {
      const request: Request = {
        server: {
          getSharedData: jest.fn().mockReturnValue({
            [sharedDataStructure.searchTerm]: 'example term',
            [sharedDataStructure.searchResults]: [
              { id: 1, title: 'Result 1' },
              { id: 2, title: 'Result 2' },
            ],
          }),
        },
      } as any;
      const response: ResponseToolkit = { view: jest.fn() } as any;
      await SearchController.renderSearchResultsHandler(request, response);
      expect(response.view).toHaveBeenCalledWith('screens/results/template', {
        searchTerm: 'example term',
        quickSearchPath: webRoutePaths.quickSearch,
        searchResults: [
          { id: 1, title: 'Result 1' },
          { id: 2, title: 'Result 2' },
        ],
      });
    });
  });

  describe('Deals with guided date search handler', () => {
    it('should render the guided data search handler', async () => {
      const request: Request = {} as any;
      const response: ResponseToolkit = { view: jest.fn() } as any;

      const {
        guidedDateSearch: guidedDateSearchPath,
        geographySearch: skipPath,
      } = webRoutePaths;
      const dateFormOptions: IFormValidatorOptions = {
        formId: formValidatorOptions.dateQuestionnaire.formId,
        submitButtonId: formValidatorOptions.dateQuestionnaire.submitButtonId,
      };
      const dynamicSubmitScript = injectDynamicEnablingScript(dateFormOptions);

      await SearchController.renderGuidedSearchHandler(request, response);
      expect(response.view).toHaveBeenCalledWith(
        'screens/guided_search/date_questionnaire',
        {
          fromDate,
          toDate,
          guidedDateSearchPath,
          dateFormOptions,
          dynamicSubmitScript,
          skipPath,
        }
      );
    });

    it('should update shared data, consume API and redirect to next route', async () => {
      const request: Request = {
        payload: { 'from-date-year': 2022, 'to-date-year': 2023 },
        server: { updateSharedData: jest.fn(), purgeSharedData: jest.fn() },
      } as any;
      const response: ResponseToolkit = { redirect: jest.fn() } as any;
      await SearchController.doDateSearchHandler(request, response);
      expect(request.server.updateSharedData).toHaveBeenCalledWith(
        sharedDataStructure.searchResults,
        undefined
      );
      expect(request.server.purgeSharedData).toHaveBeenCalledWith(
        sharedDataStructure.searchTerm
      );
      expect(response.redirect).toHaveBeenCalledWith(
        webRoutePaths.geographySearch
      );
    });

    it('should validate the date questionnaire form', async () => {
      const request: Request = {} as any;
      const response: ResponseToolkit = {
        view: jest.fn().mockReturnValue({
          code: jest.fn().mockReturnThis(),
          takeover: jest.fn(),
        }),
      } as any;
      const error = {
        details: [
          {
            path: ['from-date-year'],
            type: 'any.required',
            message: '"from-date-year" is required',
            context: { errors: ['from-date-year'] },
          },
        ],
      } as unknown as Joi.ValidationError;
      jest
        .spyOn(errorTransformer, 'transformErrors')
        .mockReturnValue(dateQuestionChronologicalError as FormFieldError);

      const {
        guidedDateSearch: guidedDateSearchPath,
        geographySearch: skipPath,
      } = webRoutePaths;
      const dateFormOptions: IFormValidatorOptions = {
        formId: formValidatorOptions.dateQuestionnaire.formId,
        submitButtonId: formValidatorOptions.dateQuestionnaire.submitButtonId,
      };
      const dynamicSubmitScript = injectDynamicEnablingScript(dateFormOptions);

      await SearchController.doDateSearchFailActionHandler(
        request,
        response,
        error
      );
      expect(response.view).toHaveBeenCalledWith(
        'screens/guided_search/date_questionnaire',
        {
          fromDate: dateQuestionnaireGovUKError.fromDate,
          toDate: dateQuestionnaireGovUKError.toDate,
          guidedDateSearchPath,
          dateFormOptions,
          dynamicSubmitScript,
          skipPath,
        }
      );
    });
  });

  describe('Deals with guided geography search handler', () => {
    it('should render the guided geography search handler', async () => {
      const request: Request = {} as any;
      const response: ResponseToolkit = { view: jest.fn() } as any;

      const formFields = { ...geographyQuestionnaireOptions };
      const {
        geographySearch: geographySearchPath,
        guidedDateSearch: guidedDateSearchPath,
      } = webRoutePaths;
      const dateFormOptions: IFormValidatorOptions = {
        formId: formValidatorOptions.geographyQuestionnaire.formId,
        submitButtonId:
          formValidatorOptions.geographyQuestionnaire.submitButtonId,
      };
      const dynamicSubmitScript = injectDynamicEnablingScript(dateFormOptions);

      await SearchController.renderGeographySearchHandler(request, response);
      expect(response.view).toHaveBeenCalledWith(
        'screens/guided_search/geography_questionnaire',
        {
          guidedDateSearchPath,
          geographySearchPath,
          dateFormOptions,
          formFields,
          dynamicSubmitScript,
        }
      );
    });

    it('should update shared data, consume API and redirect to next route', async () => {
      const request: Request = {} as any;
      const response: ResponseToolkit = { redirect: jest.fn() } as any;
      await SearchController.doGeographySearchHandler(request, response);
      expect(response.redirect).toHaveBeenCalledWith(
        webRoutePaths.geographySearch
      );
    });

    it('should validate the geography questionnaire form', async () => {
      const request: Request = {} as any;
      const response: ResponseToolkit = {
        view: jest.fn().mockReturnValue({
          code: jest.fn().mockReturnThis(),
          takeover: jest.fn(),
        }),
      } as any;
      const error = {
        details: [
          {
            path: ['depth'],
            type: 'number.positive',
            message: 'This is not a valid input',
            context: { errors: ['depth'] },
          },
        ],
      } as unknown as Joi.ValidationError;
      jest
        .spyOn(errorTransformer, 'transformTextInputError')
        .mockResolvedValue(
          geographyFormOptionWithDepthError as IFormFieldOptions
        );

      const {
        geographySearch: geographySearchPath,
        guidedDateSearch: guidedDateSearchPath,
      } = webRoutePaths;
      const dateFormOptions: IFormValidatorOptions = {
        formId: formValidatorOptions.geographyQuestionnaire.formId,
        submitButtonId:
          formValidatorOptions.geographyQuestionnaire.submitButtonId,
      };
      const dynamicSubmitScript = injectDynamicEnablingScript(dateFormOptions);

      await SearchController.doGeographySearchFailActionHandler(
        request,
        response,
        error
      );
      expect(response.view).toHaveBeenCalledWith(
        'screens/guided_search/geography_questionnaire',
        {
          guidedDateSearchPath,
          geographySearchPath,
          dateFormOptions,
          formFields: geographyFormOptionWithDepthError,
          dynamicSubmitScript,
        }
      );
    });
  });
});
