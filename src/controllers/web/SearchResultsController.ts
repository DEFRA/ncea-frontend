'use strict';

//import { getSearchResults } from '../../services/handlers/searchResultsApi';
import { Request, ResponseObject, ResponseToolkit } from '@hapi/hapi';

const SearchResultsController = {
  renderSearchResultsHandler: async (request: Request, response: ResponseToolkit): Promise<ResponseObject> => {
    const { q: searchTerm } = request.query;

    const results = {isSuccessful: true, response: {}}; //await getSearchResults(searchTerm);
    return response.view('screens/results/template', {
      hasResult: results.isSuccessful,
      searchResults: results.response,
      searchTerm: searchTerm,
    });
  },
};

export { SearchResultsController };
