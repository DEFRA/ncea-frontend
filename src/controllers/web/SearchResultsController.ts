'use strict';

import { getSearchResults } from '../../services/handlers/searchResultsApi';
import { Request, ResponseObject, ResponseToolkit } from '@hapi/hapi';

const SearchResultsController = {
  renderSearchResultsHandler: async (request: Request, response: ResponseToolkit): Promise<ResponseObject> => {
    const { q: searchTerm } = request.query;

    const results = await getSearchResults(searchTerm);
    return response.view('screens/results/template', {
      HasResult: results?.isSuccessful,
      SearchResults: results?.response,
      SearchTerm: searchTerm,
    });
  },
};

export { SearchResultsController };
