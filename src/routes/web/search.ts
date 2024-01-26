'use strict';

import { SearchController } from '../../controllers/web/SearchController';
import { webRoutePaths } from '../../utils/constants';
import { dateSchema } from '../../utils/questionnaire.schema';

module.exports = [
  {
    method: 'POST',
    path: webRoutePaths.quickSearch,
    handler: SearchController.doQuickSearchHandler,
  },
  {
    method: 'GET',
    path: webRoutePaths.results,
    handler: SearchController.renderSearchResultsHandler,
  },
  {
    method: 'POST',
    path: webRoutePaths.guidedDateSearch,
    handler: SearchController.doDateSearchHandler,
  },

  {
    method: 'GET',
    path: webRoutePaths.guidedSearch,
    handler: SearchController.renderGuidedSearchHandler,
  },
  {
    method: 'POST',
    path: webRoutePaths.guidedSearch,
    handler: SearchController.renderGuidedSearchHandler,
    options: {
      validate: {
        payload: dateSchema,
        failAction: (request, h, error) => {
          console.log(JSON.stringify(error));
          return SearchController.guidedSearchFailActionHandler(h, error);
        },
      },
    },
  },
];
