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
    handler: SearchResultsController.quickSearchSubmitHandler,
    options: {
      validate: {
        payload: searchSchema,
        failAction: SearchResultsController.quickSearchFailActionHandler,
      },
    },
  },
  {
    method: 'GET',
    path: `${webRoutePaths.results}/{id}`,
    handler: SearchResultsController.renderSearchDetailsHandler,
  },
  {
    method: 'GET',
    path: webRoutePaths.getMapResults,
    handler: SearchResultsController.getMapResultsHandler,
  },
  {
    method: 'POST',
    path: webRoutePaths.filterResourceType,
    handler: SearchResultsController.filterResourceTypeHandler,
  },
  {
    method: 'POST',
    path: webRoutePaths.filterStudyPeriod,
    handler: SearchResultsController.filterStudyPeriodHandler,
  },
  {
    method: 'POST',
    path: webRoutePaths.sortResults,
    handler: SearchResultsController.sortSearchHandler,
  },
  {
    method: 'GET',
    path: webRoutePaths.getMapFilters,
    handler: SearchResultsController.getMapFiltersHandler,
  },
];

export { searchResultsRoutes };
