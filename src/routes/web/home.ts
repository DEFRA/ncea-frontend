'use strict';

import { HomeController } from '../../controllers/web/HomeController';
import { webRoutePaths } from '../../utils/constants';

const homeRoutes = [
  {
    method: 'GET',
    path: webRoutePaths.home,
    handler: HomeController.renderHomeHandler,
  },
  {
    method: 'POST',
    path: webRoutePaths.quickSearch,
    handler: HomeController.doQuickSearchHandler,
  },
];

export { homeRoutes };
