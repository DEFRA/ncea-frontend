'use strict';

import { HomeController } from '../../controllers/web/HomeController';
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
    handler: HomeController.doQuickSearchHandler,
    options: {
      validate: {
        payload: searchSchema,
        failAction: HomeController.quickSearchFailActionHandler,
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
