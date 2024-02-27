'use strict';

import { ISearchPayload } from '../../interfaces/queryBuilder.interface';
import Joi from 'joi';
import { IAggregationOptions, ISearchResults } from '../../interfaces/searchResponse.interface';
import { Request, ResponseObject, ResponseToolkit } from '@hapi/hapi';

import { formIds, resourceTypeOptions, webRoutePaths } from '../../utils/constants';
import { getResourceTypeOptions, getSearchResults, getSearchResultsCount } from '../../services/handlers/searchApi';

const SearchResultsController = {
  renderSearchResultsHandler: async (request: Request, response: ResponseToolkit): Promise<ResponseObject> => {
    const formId: string = formIds.quickSearch;
    if (request?.headers?.referer) {
      return response.view('screens/results/template', {
        formId,
      });
    } else {
      return response.redirect(webRoutePaths.home);
    }
  },
  quickSearchFailActionHandler: (request, response, error) => {
    const formId: string = formIds.quickSearch;
    const searchError: string | undefined = error?.details?.[0]?.message ?? undefined;
    const payload = request.payload as Record<string, string>;
    const searchInputError = searchError
      ? {
          text: searchError,
        }
      : (undefined as unknown as Joi.ValidationError);
    const context = {
      formId,
      searchInputError,
    };
    const view: string = payload?.pageName === 'home' ? 'screens/home/template' : 'screens/results/template';
    return response.view(view, context).code(400).takeover();
  },
  getSearchResultsHandler: async (request: Request, response: ResponseToolkit): Promise<ResponseObject> => {
    const payload: ISearchPayload = request.payload as ISearchPayload;
    const { fields } = payload;
    const isQuickSearchJourney = Object.prototype.hasOwnProperty.call(fields, 'quick-search');
    try {
      const searchResults: ISearchResults = await getSearchResults(payload);
      return response.view('partials/results/summary', {
        searchResults,
        hasError: false,
        isQuickSearchJourney,
      });
    } catch (error) {
      return response.view('partials/results/summary', {
        error,
        hasError: true,
        isQuickSearchJourney,
      });
    }
  },
  getResultsCountHandler: async (request: Request, response: ResponseToolkit): Promise<ResponseObject> => {
    const payload: ISearchPayload = request.payload as ISearchPayload;
    try {
      const searchResultsCount: { totalResults: number } = await getSearchResultsCount(payload);
      if (searchResultsCount.totalResults > 0) {
        return response.response(searchResultsCount);
      } else {
        return response.redirect(webRoutePaths.results);
      }
    } catch (error) {
      return response.redirect(webRoutePaths.results);
    }
  },
  getSearchFiltersHandler: async (request: Request, response: ResponseToolkit): Promise<ResponseObject> => {
    const payload: ISearchPayload = request.payload as ISearchPayload;
    try {
      const resourceTypeOptionsData: IAggregationOptions = await getResourceTypeOptions(payload);
      return response.view('partials/results/filters', {
        resourceTypeOptions: resourceTypeOptionsData,
      });
    } catch (error) {
      return response.view('partials/results/filters', {
        error,
        resourceTypeOptions,
      });
    }
  },
};

export { SearchResultsController };
