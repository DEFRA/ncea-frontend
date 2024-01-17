'use strict';

import { SearchResultsController } from '../../controllers/web/SearchResultsController';
import { webRoutePaths } from '../../utils/constants';

module.exports = [
  {
    method: 'GET',
    path: webRoutePaths.results,
    handler: SearchResultsController.renderSearchResultsHandler,
  },
];
