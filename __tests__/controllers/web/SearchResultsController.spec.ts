'use strict';

import Joi from 'joi';
import { SearchResultsController } from '../../../src/controllers/web/SearchResultsController';
import { Request, ResponseToolkit } from '@hapi/hapi';

import { quickSearchJoiError } from '../../data/quickSearch';
import { formIds, webRoutePaths } from '../../../src/utils/constants';

jest.mock('../../../src/services/handlers/searchApi', () => ({
  getSearchResults: jest.fn(),
  getSearchResultsCount: jest.fn(),
}));
describe('Deals with search results controller', () => {
  describe('Deals with search results handler', () => {
    it('should return the rendered view with context', async () => {
      const request: Request = { headers: { referer: 'some_referer' } } as any;
      const response: ResponseToolkit = { view: jest.fn() } as any;

      const { results: quickSearchPath, getResults: getResultsPath } =
        webRoutePaths;
      const formId: string = formIds.quickSearch;
      await SearchResultsController.renderSearchResultsHandler(
        request,
        response,
      );
      expect(response.view).toHaveBeenCalledWith('screens/results/template', {
        quickSearchPath,
        getResultsPath,
        formId,
      });
    });

    it('should redirect to home if we access the search page directly', async () => {
      const request: Request = {} as any;
      const response: ResponseToolkit = { redirect: jest.fn() } as any;

      await SearchResultsController.renderSearchResultsHandler(
        request,
        response,
      );
      expect(response.redirect).toHaveBeenCalledWith(webRoutePaths.home);
    });

    it('should fetch the data and return the view', async () => {
      const request: Request = {} as any;
      const response: ResponseToolkit = { view: jest.fn() } as any;
      await SearchResultsController.getSearchResultsHandler(request, response);
      expect(response.view).toHaveBeenCalledWith('partials/results/template', {
        searchResults: undefined,
      });
    });
  });

  describe('Deals with search results count handler', () => {
    it('should fetch the total results count', async () => {
      const request: Request = {} as any;
      const response: ResponseToolkit = {
        response: jest.fn().mockReturnThis(),
      } as any;
      await SearchResultsController.getResultsCountHandler(request, response);
      expect(response.response).toHaveBeenCalledTimes(1);
    });
  });

  describe('Deals with quickSearchFailActionHandler > home page', () => {
    const response: ResponseToolkit = {
      view: jest.fn().mockReturnValue({
        code: jest.fn().mockReturnThis(),
        takeover: jest.fn(),
      }),
    } as any;
    const request: Request = {
      payload: {
        pageName: 'home',
      },
    } as any;
    beforeAll(() => {
      return SearchResultsController.quickSearchFailActionHandler(
        request,
        response,
        quickSearchJoiError,
      );
    });

    it('should render the home page with error messages', async () => {
      const {
        results: quickSearchPath,
        guidedDateSearch: dateSearchPath,
        getResults: getResultsPath,
      } = webRoutePaths;
      const formId: string = formIds.quickSearch;
      const searchInputError = {
        text: 'Please enter keywords into the search field.',
      };
      const context = {
        quickSearchPath,
        formId,
        dateSearchPath,
        getResultsPath,
        searchInputError,
      };
      expect(response.view).toHaveBeenCalledWith(
        'screens/home/template',
        context,
      );
    });
  });

  describe('Deals with quickSearchFailActionHandler > results page', () => {
    const response: ResponseToolkit = {
      view: jest.fn().mockReturnValue({
        code: jest.fn().mockReturnThis(),
        takeover: jest.fn(),
      }),
    } as any;
    const request: Request = {
      payload: {
        pageName: 'results',
      },
    } as any;
    beforeAll(() => {
      return SearchResultsController.quickSearchFailActionHandler(
        request,
        response,
        quickSearchJoiError,
      );
    });

    it('should render the results page with error messages', async () => {
      const {
        results: quickSearchPath,
        guidedDateSearch: dateSearchPath,
        getResults: getResultsPath,
      } = webRoutePaths;
      const formId: string = formIds.quickSearch;
      const searchInputError = {
        text: 'Please enter keywords into the search field.',
      };
      const context = {
        quickSearchPath,
        formId,
        dateSearchPath,
        getResultsPath,
        searchInputError,
      };
      expect(response.view).toHaveBeenCalledWith(
        'screens/results/template',
        context,
      );
    });
  });

  describe('Deals with quickSearchFailActionHandler > no error', () => {
    const response: ResponseToolkit = {
      view: jest.fn().mockReturnValue({
        code: jest.fn().mockReturnThis(),
        takeover: jest.fn(),
      }),
    } as any;
    const request: Request = {
      payload: {
        pageName: 'home',
      },
    } as any;
    beforeAll(() => {
      return SearchResultsController.quickSearchFailActionHandler(
        request,
        response,
        undefined as unknown as Joi.ValidationError,
      );
    });

    it('should render the home page with error messages', async () => {
      const {
        results: quickSearchPath,
        guidedDateSearch: dateSearchPath,
        getResults: getResultsPath,
      } = webRoutePaths;
      const formId: string = formIds.quickSearch;
      const searchInputError = undefined;
      const context = {
        quickSearchPath,
        formId,
        dateSearchPath,
        getResultsPath,
        searchInputError,
      };
      expect(response.view).toHaveBeenCalledWith(
        'screens/home/template',
        context,
      );
    });
  });
});
