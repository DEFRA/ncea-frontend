'use strict';

import { SearchResultsController } from '../../controllers/web/SearchResultsController';
import { webRoutePaths } from '../../utils/constants';

const searchResultsRoutes = [
  {
    method: 'GET',
    path: webRoutePaths.results,
    handler: SearchResultsController.renderSearchResultsHandler,
  },
  {
    method: 'POST',
    path: webRoutePaths.getResults,
    handler: SearchResultsController.getSearchResultsHandler,
  },
];

export { searchResultsRoutes };
