'use strict';

import { IQuickSearchPayload } from '../../models/interfaces/searchPayload.interface';
import { ISearchFieldsObject } from '../../models/interfaces/queryBuilder.interface';
import { ISearchResults } from '../../models/interfaces/searchResponse.interface';
import { ISharedData } from '../../models/interfaces/sharedData.interface';
import { getSearchResults } from '../../services/handlers/searchApi';
import { Request, ResponseObject, ResponseToolkit } from '@hapi/hapi';
import { sharedDataStructure, webRoutePaths } from '../../utils/constants';

const SearchController = {
  doQuickSearchHandler: async (request: Request, response: ResponseToolkit): Promise<ResponseObject> => {
    const { search_term }: IQuickSearchPayload = request.payload as IQuickSearchPayload;
    const searchFieldsObject: ISearchFieldsObject = {
      startDate: '2008-02-23',
      endDate: '2008-02-23',
    };
    const searchResults: ISearchResults = await getSearchResults(searchFieldsObject);
    request.server.updateSharedData(sharedDataStructure.searchTerm, search_term);
    request.server.updateSharedData(sharedDataStructure.searchResults, searchResults);

    return response.redirect(webRoutePaths.results);
  },
  renderSearchResultsHandler: async (request: Request, response: ResponseToolkit): Promise<ResponseObject> => {
    const sharedData: ISharedData = request.server.getSharedData();
    const searchTerm = sharedData[sharedDataStructure.searchTerm];
    const searchResults = sharedData[sharedDataStructure.searchResults];
    const quickSearchPath = webRoutePaths.quickSearch;
    return response.view('screens/results/template', {
      searchTerm,
      quickSearchPath,
      searchResults,
    });
  },
};

export { SearchController };
