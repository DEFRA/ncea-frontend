'use strict';

import { SearchResultsController } from '../../controllers/web/SearchResultsController';
import { dateSchema } from '../../schema/questionnaire.schema';
import { searchSchema } from '../../schema/search.schema';
import { webRoutePaths } from '../../utils/constants';

module.exports = [
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
        failAction: (request, h, error) => {
          return SearchResultsController.quickSearchFailActionHandler(request, h, error);
        },
      },
    },
  },
  {
    method: 'GET',
    path: webRoutePaths.guidedSearch,
    handler: SearchResultsController.renderGuidedSearchHandler,
  },
  {
    method: 'POST',
    path: webRoutePaths.guidedSearch,
    handler: SearchResultsController.renderGuidedSearchHandler,
    options: {
      validate: {
        payload: dateSchema,
        failAction: (request, h, error) => {
          return SearchResultsController.guidedSearchFailActionHandler(h, error);
        },
      },
    },
  },
];
