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
  {
    method: 'POST',
    path: webRoutePaths.getResultsCount,
    handler: SearchResultsController.getResultsCountHandler,
  },
  {
    method: 'POST',
    path: webRoutePaths.getFilters,
    handler: SearchResultsController.getSearchFiltersHandler,
  },
  {
    method: 'GET',
    path: webRoutePaths.emptyQuickSearch,
    handler: SearchResultsController.getNoResultsHandler,
  },
  {
    method: 'GET',
    path: webRoutePaths.emptyGuidedSearch,
    handler: SearchResultsController.getNoResultsHandler,
  },
  {
    method: 'GET',
    path: webRoutePaths.searchError,
    handler: SearchResultsController.getSearchErrorHandler,
  },
];

export { searchResultsRoutes };
