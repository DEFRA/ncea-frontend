'use strict';

import { ISearchPayload } from '../../../src/interfaces/queryBuilder.interface';
import Joi from 'joi';
import { SearchResultsController } from '../../../src/controllers/web/SearchResultsController';
import { Request, ResponseToolkit } from '@hapi/hapi';

import {
  getSearchResults,
  getSearchResultsCount,
  getResourceTypeOptions,
} from '../../../src/services/handlers/searchApi';
import { quickSearchJoiError } from '../../data/quickSearch';
import { formIds, webRoutePaths } from '../../../src/utils/constants';
import { IAggregationOption } from '../../../src/interfaces/searchResponse.interface';

jest.mock('../../../src/services/handlers/searchApi', () => ({
  getSearchResults: jest.fn(),
  getSearchResultsCount: jest.fn(),
  getResourceTypeOptions: jest.fn(),
}));
describe('Deals with search results controller', () => {
  describe('Deals with search results handler', () => {
    it('should return the rendered view with context', async () => {
      const request: Request = { headers: { referer: 'some_referer' } } as any;
      const response: ResponseToolkit = { view: jest.fn() } as any;

      const formId: string = formIds.quickSearch;
      await SearchResultsController.renderSearchResultsHandler(
        request,
        response,
      );
      expect(response.view).toHaveBeenCalledWith('screens/results/template', {
        formId,
        hasError: false,
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
      const request: Request = { payload: { fields: {} } } as any;
      const response: ResponseToolkit = { view: jest.fn() } as any;
      (getSearchResults as jest.Mock).mockResolvedValue({
        total: 10,
        items: [],
      });
      await SearchResultsController.getSearchResultsHandler(request, response);
      expect(response.view).toHaveBeenCalledWith('partials/results/summary', {
        hasError: false,
        isQuickSearchJourney: false,
        searchResults: {
          total: 10,
          items: [],
        },
      });
    });

    it('should redirect to quick search no results page', async () => {
      const request: Request = {
        payload: { fields: { 'quick-search': { search_term: 'test' } } },
      } as any;
      const response: ResponseToolkit = { redirect: jest.fn() } as any;
      (getSearchResults as jest.Mock).mockResolvedValue({
        total: 0,
        items: [],
      });
      await SearchResultsController.getSearchResultsHandler(request, response);
      expect(response.redirect).toHaveBeenCalledWith(
        webRoutePaths.emptyQuickSearch,
      );
    });

    it('should redirect to guided search no results page', async () => {
      const request: Request = {
        payload: {
          fields: {
            'date-search': { 'from-date-year': '2022', 'to-date-year': '2022' },
          },
        },
      } as any;
      const response: ResponseToolkit = { redirect: jest.fn() } as any;
      (getSearchResults as jest.Mock).mockResolvedValue({
        total: 0,
        items: [],
      });
      await SearchResultsController.getSearchResultsHandler(request, response);
      expect(response.redirect).toHaveBeenCalledWith(
        webRoutePaths.emptyGuidedSearch,
      );
    });

    it('should show an error when something fails at API layer', async () => {
      const request: Request = { payload: { fields: {} } } as any;
      const response: ResponseToolkit = { redirect: jest.fn() } as any;
      const error = new Error('Mocked error');
      (getSearchResults as jest.Mock).mockRejectedValue(error);
      await SearchResultsController.getSearchResultsHandler(request, response);
      expect(response.redirect).toHaveBeenCalledWith(webRoutePaths.searchError);
    });
  });

  describe('Deals with search results count handler', () => {
    it('should fetch the total results count', async () => {
      const request: Request = { payload: { fields: {} } } as any;
      const response: ResponseToolkit = {
        response: jest.fn().mockReturnThis(),
      } as any;
      (getSearchResultsCount as jest.Mock).mockResolvedValue({
        totalResults: 10,
      });
      await SearchResultsController.getResultsCountHandler(request, response);
      expect(response.response).toHaveBeenCalledTimes(1);
    });

    it('should redirect to quick search no results page', async () => {
      const request: Request = {
        payload: { fields: { 'quick-search': { search_term: 'test' } } },
      } as any;
      const response: ResponseToolkit = { redirect: jest.fn() } as any;
      (getSearchResultsCount as jest.Mock).mockResolvedValue({
        totalResults: 0,
      });
      await SearchResultsController.getResultsCountHandler(request, response);
      expect(response.redirect).toHaveBeenCalledWith(
        webRoutePaths.emptyQuickSearch,
      );
    });

    it('should redirect to guided search no results page', async () => {
      const request: Request = {
        payload: {
          fields: {
            'date-search': { 'from-date-year': '2022', 'to-date-year': '2022' },
          },
        },
      } as any;
      const response: ResponseToolkit = { redirect: jest.fn() } as any;
      (getSearchResultsCount as jest.Mock).mockResolvedValue({
        totalResults: 0,
      });
      await SearchResultsController.getResultsCountHandler(request, response);
      expect(response.redirect).toHaveBeenCalledWith(
        webRoutePaths.emptyGuidedSearch,
      );
    });

    it('should show an error when something fails at API layer', async () => {
      const request: Request = { payload: { fields: {} } } as any;
      const response: ResponseToolkit = { redirect: jest.fn() } as any;
      const error = new Error('Mocked error');
      (getSearchResultsCount as jest.Mock).mockRejectedValue(error);
      await SearchResultsController.getResultsCountHandler(request, response);
      expect(response.redirect).toHaveBeenCalledWith(webRoutePaths.searchError);
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
        getFilters: getFiltersPath,
      } = webRoutePaths;
      const formId: string = formIds.quickSearch;
      const searchInputError = {
        text: 'Please enter keywords into the search field.',
      };
      const context = {
        formId,
        searchInputError,
        hasError: false,
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
        getFilters: getFiltersPath,
      } = webRoutePaths;
      const formId: string = formIds.quickSearch;
      const searchInputError = {
        text: 'Please enter keywords into the search field.',
      };
      const context = {
        formId,
        searchInputError,
        hasError: false,
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
        getFilters: getFiltersPath,
      } = webRoutePaths;
      const formId: string = formIds.quickSearch;
      const searchInputError = undefined;
      const context = {
        formId,
        searchInputError,
        hasError: false,
      };
      expect(response.view).toHaveBeenCalledWith(
        'screens/home/template',
        context,
      );
    });
  });

  describe('Deals with search filters handler', () => {
    it('should fetch the data and return the view', async () => {
      const request: Request = { payload: { fields: {} } } as any;
      const response: ResponseToolkit = { view: jest.fn() } as any;
      const expectedResourceTypeOptions: IAggregationOption[] = [
        { value: 'filter1', text: 'Filter1' },
        { value: 'filter2', text: 'Filter2' },
      ];
      (getResourceTypeOptions as jest.Mock).mockResolvedValue(
        expectedResourceTypeOptions,
      );
      await SearchResultsController.getSearchFiltersHandler(request, response);
      expect(response.view).toHaveBeenCalledWith('partials/results/filters', {
        resourceTypeOptions: expectedResourceTypeOptions,
      });
    });

    it('should show an error when something fails at API layer', async () => {
      const request: Request = { payload: { fields: {} } } as any;
      const response: ResponseToolkit = { view: jest.fn() } as any;
      const error = new Error('Mocked error');
      (getResourceTypeOptions as jest.Mock).mockRejectedValue(error);
      await SearchResultsController.getSearchFiltersHandler(request, response);
      expect(response.view).toHaveBeenCalledWith('partials/results/filters', {
        error,
        resourceTypeOptions: [
          {
            value: 'all',
            text: 'All',
          },
        ],
      });
    });
  });

  describe('Deals with no search results handler', () => {
    it('should return the rendered view with context', async () => {
      const request: Request = {
        url: { pathname: webRoutePaths.emptyQuickSearch },
        headers: { referer: 'some_referer' },
      } as any;
      const response: ResponseToolkit = { view: jest.fn() } as any;

      const formId: string = formIds.quickSearch;
      await SearchResultsController.getNoResultsHandler(request, response);
      expect(response.view).toHaveBeenCalledWith('screens/results/no_results', {
        isQuickSearchJourney: true,
        formId,
        hasError: false,
      });
    });

    it('should redirect to home if we access the search page directly', async () => {
      const request: Request = {} as any;
      const response: ResponseToolkit = { redirect: jest.fn() } as any;

      await SearchResultsController.getNoResultsHandler(request, response);
      expect(response.redirect).toHaveBeenCalledWith(webRoutePaths.home);
    });
  });

  describe('Deals with search error handler', () => {
    it('should return the rendered view with context', async () => {
      const request: Request = { headers: { referer: 'some_referer' } } as any;
      const response: ResponseToolkit = { view: jest.fn() } as any;

      const formId: string = formIds.quickSearch;
      await SearchResultsController.getSearchErrorHandler(request, response);
      expect(response.view).toHaveBeenCalledWith('screens/results/error', {
        formId,
        hasError: true,
      });
    });

    it('should redirect to home if we access the search page directly', async () => {
      const request: Request = {} as any;
      const response: ResponseToolkit = { redirect: jest.fn() } as any;

      await SearchResultsController.getSearchErrorHandler(request, response);
      expect(response.redirect).toHaveBeenCalledWith(webRoutePaths.home);
    });
  });
});
