'use strict';

import { SearchController } from '../../controllers/web/SearchController';
import { dateSchema } from '../../schema/questionnaire.schema';
import { webRoutePaths } from '../../utils/constants';

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
    method: 'GET',
    path: webRoutePaths.guidedDateSearch,
    handler: SearchController.renderGuidedSearchHandler,
  },
  {
    method: 'POST',
    path: webRoutePaths.guidedDateSearch,
    handler: SearchController.doDateSearchHandler,
    options: {
      validate: {
        payload: dateSchema,
        failAction: SearchController.doDateSearchFailActionHandler,
      },
    },
  },
  {
    method: 'GET',
    path: webRoutePaths.geographySearch,
    handler: SearchController.renderGeographySearchHandler,
  },
];
