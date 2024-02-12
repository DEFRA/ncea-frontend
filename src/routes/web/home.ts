'use strict';

import { HomeController } from '../../controllers/web/HomeController';

import { searchSchema } from '../../schema/search.schema';
import { webRoutePaths } from '../../utils/constants';

const homeRoutes = [
  {
    method: 'GET',
    path: webRoutePaths.home,
    handler: HomeController.renderHomeHandler,
  },
  {
    method: 'POST',
    path: webRoutePaths.home,
    handler: HomeController.doQuickSearchHandler,
    options: {
      validate: {
        payload: searchSchema,
        failAction: HomeController.quickSearchFailActionHandler,
      },
    },
  },
];

export { homeRoutes };
