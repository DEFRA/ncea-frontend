'use strict';

import { Request, ResponseObject, ResponseToolkit } from '@hapi/hapi';

const SearchController = {
  renderSearchResultsHandler: async (request: Request, response: ResponseToolkit): Promise<ResponseObject> => {
    const { q: searchTerm } = request.query;
    return response.view('screens/results/template', { searchTerm });
  },
};

export { SearchController };
