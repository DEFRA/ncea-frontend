'use strict';

import { getSearchResults } from '../../services/handlers/searchResultsApi';
import { Request, ResponseObject, ResponseToolkit } from '@hapi/hapi';

const SearchResultsController = {
  renderSearchResultsHandler: async (request: Request, response: ResponseToolkit): Promise<ResponseObject> => {
    const { q: searchTerm } = request.query;
    let searchResults = [];
    if (searchTerm) {
      const posts = await getSearchResults(searchTerm);
      searchResults = posts.data;
    }

    return response.view('screens/results/template', {
      searchResults,
      searchTerm: searchTerm,
    });
  },
};

export { SearchResultsController };
