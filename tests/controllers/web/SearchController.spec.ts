'use strict';

import * as errorTransformer from '../../../src/utils/transformErrors';
import { FormFieldError } from '../../../src/interfaces/guidedSearch';
import { Request, ResponseToolkit } from '@hapi/hapi';
import { SearchController } from '../../../src/controllers/web/SearchController';
import {
  sharedDataStructure,
  webRoutePaths,
} from '../../../src/utils/constants';
import {
  fromDate,
  toDate,
} from '../../../src/views/forms/dateQuestionnaireFields';
import {
  dateQuestionChronologicalError,
  dateQuestionnaireGovUKError,
} from '../../data/dateQuestionnaire';
import Joi from 'joi';

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

  describe('Deals with render guided date search handler', () => {
    it('should render the guided data search handler', async () => {
      const request: Request = {} as any;
      const response: ResponseToolkit = { view: jest.fn() } as any;
      await SearchController.renderGuidedSearchHandler(request, response);
      expect(response.view).toHaveBeenCalledWith(
        'screens/guided_search/date_questionnaire',
        {
          fromDate,
          toDate,
          guidedDateSearchPath: webRoutePaths.guidedDateSearch,
        }
      );
    });
  });

  describe('Deals with guided date search consume API handler', () => {
    it('should update shared data and redirect to results', async () => {
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
      expect(response.redirect).toHaveBeenCalledWith(webRoutePaths.results);
    });
  });

  describe('Deals with the guided date search fail action handler', () => {
    const request: Request = {} as any;
    const response: ResponseToolkit = {
      view: jest.fn().mockReturnValue({
        takeover: jest.fn(),
        code: jest.fn(),
      }) as any,
    } as any;

    const error = {} as Joi.ValidationError;
    jest
      .spyOn(errorTransformer, 'transformErrors')
      .mockReturnValue(dateQuestionChronologicalError as FormFieldError);
    beforeAll(() => {
      return SearchController.doDateSearchFailActionHandler(
        request,
        response,
        error
      );
    });

    it('should render the date questionnaire template with error messages', async () => {
      expect(response.view).toHaveBeenCalledWith(
        'screens/guided_search/date_questionnaire',
        dateQuestionnaireGovUKError
      );
    });
  });
});
