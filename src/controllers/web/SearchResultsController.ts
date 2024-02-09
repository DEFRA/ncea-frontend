'use strict';

import { ISearchFieldsObject } from '../../interfaces/queryBuilder.interface';
import { ISearchResults } from '../../interfaces/searchResponse.interface';
import { Request, ResponseObject, ResponseToolkit } from '@hapi/hapi';

import { getSearchResults } from '../../services/handlers/searchApi';
import { formIds, webRoutePaths } from '../../utils/constants';

const SearchResultsController = {
  renderSearchResultsHandler: async (request: Request, response: ResponseToolkit): Promise<ResponseObject> => {
    const { quickSearch: quickSearchPath, getResults: getResultsPath } = webRoutePaths;
    const formId: string = formIds.quickSearch;
    return response.view('screens/results/template', {
      quickSearchPath,
      getResultsPath,
      formId,
    });
  },
  getSearchResultsHandler: async (request: Request, response: ResponseToolkit): Promise<ResponseObject> => {
    const fields: ISearchFieldsObject = request.payload as ISearchFieldsObject;
    const searchResults: ISearchResults = await getSearchResults(fields);
    return response.view('partials/results/template', {
      searchResults,
    });
  },
};

export { SearchResultsController };
