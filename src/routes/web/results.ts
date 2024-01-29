'use strict';

import { SearchResultsController } from '../../controllers/web/SearchResultsController';
import { dateSchema } from '../../schema/questionnaire.schema';
import { webRoutePaths } from '../../utils/constants';

module.exports = [
  {
    method: 'GET',
    path: webRoutePaths.results,
    handler: SearchResultsController.renderSearchResultsHandler,
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
          console.log(JSON.stringify(error));
          return SearchResultsController.guidedSearchFailActionHandler(h, error);
        },
      },
    },
  },
];
