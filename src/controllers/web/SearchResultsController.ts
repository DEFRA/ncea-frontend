'use strict';

import { ISearchFieldsObject } from '../../interfaces/queryBuilder.interface';
import { ISearchResults } from '../../interfaces/searchResponse.interface';
import Joi from 'joi';
import { Request, ResponseObject, ResponseToolkit } from '@hapi/hapi';

import { formIds, webRoutePaths } from '../../utils/constants';
import { getSearchResults, getSearchResultsCount } from '../../services/handlers/searchApi';

const SearchResultsController = {
  renderSearchResultsHandler: async (request: Request, response: ResponseToolkit): Promise<ResponseObject> => {
    const { results: quickSearchPath, getResults: getResultsPath } = webRoutePaths;
    const formId: string = formIds.quickSearch;
    if (request?.headers?.referer) {
      return response.view('screens/results/template', {
        quickSearchPath,
        getResultsPath,
        formId,
      });
    } else {
      return response.redirect(webRoutePaths.home);
    }
  },
  quickSearchFailActionHandler: (request, response, error) => {
    const { results, guidedDateSearch: dateSearchPath, getResults: getResultsPath } = webRoutePaths;
    const formId: string = formIds.quickSearch;
    const searchError: string | undefined = error?.details?.[0]?.message ?? undefined;
    const payload = request.payload as Record<string, string>;
    const searchInputError = searchError
      ? {
          text: searchError,
        }
      : (undefined as unknown as Joi.ValidationError);
    const context = {
      quickSearchPath: results,
      formId,
      dateSearchPath,
      getResultsPath,
      searchInputError,
    };
    const view: string = payload?.pageName === 'home' ? 'screens/home/template' : 'screens/results/template';
    return response.view(view, context).code(400).takeover();
  },
  getSearchResultsHandler: async (request: Request, response: ResponseToolkit): Promise<ResponseObject> => {
    const fields: ISearchFieldsObject = request.payload as ISearchFieldsObject;
    const searchResults: ISearchResults = await getSearchResults(fields);
    return response.view('partials/results/template', {
      searchResults,
    });
  },
  getResultsCountHandler: async (request: Request, response: ResponseToolkit): Promise<ResponseObject> => {
    const fields: ISearchFieldsObject = request.payload as ISearchFieldsObject;
    const searchResultsCount: { totalResults: number } = await getSearchResultsCount(fields);
    return response.response(searchResultsCount);
  },
};

export { SearchResultsController };
