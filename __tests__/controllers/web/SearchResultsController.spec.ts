'use strict';

import Joi from 'joi';
import {
  IAggregationOption,
  ISearchItem,
} from '../../../src/interfaces/searchResponse.interface';
import { SearchResultsController } from '../../../src/controllers/web/SearchResultsController';
import { Request, ResponseToolkit } from '@hapi/hapi';

import { formattedDetailsResponse } from '../../data/documentDetailsResponse';
import { processDetailsTabData } from '../../../src/utils/processDetailsTabData';
import { quickSearchJoiError } from '../../data/quickSearch';
import {
  getDocumentDetails,
  getSearchResults,
  getSearchResultsCount,
  getResourceTypeOptions,
} from '../../../src/services/handlers/searchApi';
import {
  formIds,
  queryParamKeys,
  webRoutePaths,
} from '../../../src/utils/constants';
import { getPaginationItems } from '../../../src/utils/paginationBuilder';
import { upsertQueryParams } from '../../../src/utils/queryStringHelper';

jest.mock('../../../src/services/handlers/searchApi', () => ({
  getSearchResults: jest.fn(),
  getSearchResultsCount: jest.fn(),
  getResourceTypeOptions: jest.fn(),
  getDocumentDetails: jest.fn(),
}));

describe('Deals with search results controller', () => {
  describe('Deals with search results handler', () => {
    it('should return the results and rendered search items for quick search', async () => {
      const queryObject = {
        q: 'marine',
        jry: 'qs',
        pg: '1',
        rpp: '20',
        srt: 'best_match',
        rty: 'all',
      };
      const request: Request = { query: { ...queryObject } } as any;
      const response: ResponseToolkit = { view: jest.fn() } as any;
      const searchResults = {
        total: 0,
        items: [],
      };
      const formId: string = formIds.quickSearch;
      (getSearchResults as jest.Mock).mockResolvedValue(searchResults);
      const expectedResourceTypeOptions: IAggregationOption[] = [
        { value: 'filter1', text: 'Filter1' },
        { value: 'filter2', text: 'Filter2' },
      ];
      (getResourceTypeOptions as jest.Mock).mockResolvedValue(
        expectedResourceTypeOptions,
      );
      const paginationItems = getPaginationItems(1, 0, 10);
      await SearchResultsController.renderSearchResultsHandler(
        request,
        response,
      );
      expect(response.view).toHaveBeenCalledWith('screens/results/template', {
        formId,
        searchResults,
        hasError: false,
        isQuickSearchJourney: true,
        paginationItems,
        searchMapResults: searchResults,
        resourceTypeOptions: expectedResourceTypeOptions,
        dateSearchPath: webRoutePaths.guidedDateSearch,
      });
    });

    it('should return the results and rendered search items for guided search', async () => {
      const queryObject = {
        fdy: '2000',
        tdy: '2023',
        jry: 'gs',
        pg: '1',
        rpp: '20',
        srt: 'best_match',
        rty: 'all',
      };
      const request: Request = { query: { ...queryObject } } as any;
      const response: ResponseToolkit = { view: jest.fn() } as any;
      const searchResults = {
        total: 0,
        items: [],
      };
      const formId: string = formIds.quickSearch;
      (getSearchResults as jest.Mock).mockResolvedValue(searchResults);
      const expectedResourceTypeOptions: IAggregationOption[] = [
        { value: 'filter1', text: 'Filter1' },
        { value: 'filter2', text: 'Filter2' },
      ];
      (getResourceTypeOptions as jest.Mock).mockResolvedValue(
        expectedResourceTypeOptions,
      );
      const paginationItems = getPaginationItems(1, 0, 10);
      await SearchResultsController.renderSearchResultsHandler(
        request,
        response,
      );
      expect(response.view).toHaveBeenCalledWith('screens/results/template', {
        formId,
        searchResults,
        hasError: false,
        isQuickSearchJourney: false,
        paginationItems,
        searchMapResults: searchResults,
        resourceTypeOptions: expectedResourceTypeOptions,
        dateSearchPath: webRoutePaths.guidedDateSearch,
      });
    });

    it('should show an error when something fails at API layer', async () => {
      const queryObject = {
        fdy: '2000',
        tdy: '2023',
        jry: 'gs',
        pg: '1',
        rpp: '20',
        srt: 'best_match',
        rty: 'all',
      };
      const formId: string = formIds.quickSearch;
      const request: Request = { query: { ...queryObject } } as any;
      const response: ResponseToolkit = { view: jest.fn() } as any;
      const error = new Error('Mocked error');
      (getSearchResults as jest.Mock).mockRejectedValue(error);
      await SearchResultsController.renderSearchResultsHandler(
        request,
        response,
      );
      expect(response.view).toHaveBeenCalledWith('screens/results/template', {
        formId,
        error,
        hasError: true,
        isQuickSearchJourney: false,
      });
    });
  });

  describe('Deals with quick search submit handler', () => {
    it('should build the query params and navigate to results page', async () => {
      const request: Request = {
        payload: { search_term: 'search term' },
      } as any;
      const response: ResponseToolkit = { redirect: jest.fn() } as any;

      const queryParamsObject: Record<string, string> = {
        [queryParamKeys.quickSearch]: 'search term',
        [queryParamKeys.journey]: 'qs',
      };
      const queryString: string = upsertQueryParams(
        request.query,
        queryParamsObject,
      );
      await SearchResultsController.quickSearchSubmitHandler(request, response);
      expect(response.redirect).toHaveBeenCalledWith(
        `${webRoutePaths.results}?${queryString}`,
      );
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
      const formId: string = formIds.quickSearch;
      const searchInputError = {
        text: 'Please enter keywords into the search field.',
      };
      const context = {
        formId,
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
      const formId: string = formIds.quickSearch;
      const searchInputError = {
        text: 'Please enter keywords into the search field.',
      };
      const context = {
        formId,
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
      const formId: string = formIds.quickSearch;
      const searchInputError = undefined;
      const context = {
        formId,
        searchInputError,
      };
      expect(response.view).toHaveBeenCalledWith(
        'screens/home/template',
        context,
      );
    });
  });

  describe('Deals with document details handler', () => {
    it('should fetch the data and return the view', async () => {
      const request: Request = { params: { id: '123' } } as any;
      const response: ResponseToolkit = { view: jest.fn() } as any;
      const expectedResponse: ISearchItem = formattedDetailsResponse
        ?.items?.[0] as ISearchItem;
      (getDocumentDetails as jest.Mock).mockResolvedValue(expectedResponse);
      await SearchResultsController.renderSearchDetailsHandler(
        request,
        response,
      );
      expect(response.view).toHaveBeenCalledWith('screens/details/template', {
        docDetails: expectedResponse,
        detailsTabOptions: await processDetailsTabData(expectedResponse),
      });
    });
    it('should fetch the data as empty object when the API does not found the document and return the view', async () => {
      const request: Request = { params: { id: '123' } } as any;
      const response: ResponseToolkit = { view: jest.fn() } as any;
      (getDocumentDetails as jest.Mock).mockResolvedValue({});
      await SearchResultsController.renderSearchDetailsHandler(
        request,
        response,
      );
      expect(response.view).toHaveBeenCalledWith('screens/details/template', {
        docDetails: {},
        detailsTabOptions: await processDetailsTabData({}),
      });
    });

    it('should show an error when something fails at API layer', async () => {
      const request: Request = { params: { id: '123' } } as any;
      const response: ResponseToolkit = { view: jest.fn() } as any;
      const error = new Error('Mocked error');
      (getDocumentDetails as jest.Mock).mockRejectedValue(error);
      await SearchResultsController.renderSearchDetailsHandler(
        request,
        response,
      );
      expect(response.view).toHaveBeenCalledWith('screens/details/template', {
        error,
        docDetails: undefined,
      });
    });
  });
});
