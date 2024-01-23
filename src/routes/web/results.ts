'use strict';

import { SearchController } from '../../controllers/web/SearchController';
import { webRoutePaths } from '../../utils/constants';

module.exports = [
  {
    method: 'GET',
    path: webRoutePaths.results,
    handler: SearchController.renderSearchResultsHandler,
  },
];
