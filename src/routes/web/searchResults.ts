'use strict';

import { SearchResultsController } from '../../controllers/web/SearchResultsController';

import { searchSchema } from '../../schema/search.schema';
import { webRoutePaths } from '../../utils/constants';

const searchResultsRoutes = [
  {
    method: 'GET',
    path: webRoutePaths.results,
    handler: SearchResultsController.renderSearchResultsHandler,
  },
  {
    method: 'POST',
    path: webRoutePaths.results,
    handler: SearchResultsController.renderSearchResultsHandler,
    options: {
      validate: {
        payload: searchSchema,
        failAction: SearchResultsController.quickSearchFailActionHandler,
      },
    },
  },
  {
    method: 'POST',
    path: webRoutePaths.getResults,
    handler: SearchResultsController.getSearchResultsHandler,
  },
];

export { searchResultsRoutes };
