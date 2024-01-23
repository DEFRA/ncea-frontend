'use strict';

import { getSearchResults } from '../../services/handlers/searchResultsApi';
import { Request, ResponseObject, ResponseToolkit } from '@hapi/hapi';

const SearchResultsController = {
  renderSearchResultsHandler: async (request: Request, response: ResponseToolkit): Promise<ResponseObject> => {
    const { q: searchTerm } = request.query;
    const posts = await getSearchResults(searchTerm);

    return response.view('screens/results/template', { SearchResults: posts.data, SearchTerm: searchTerm });
  },
};

export { SearchResultsController };
