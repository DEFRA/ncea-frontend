'use strict';

import { HomeController } from '../../controllers/web/HomeController';

import { webRoutePaths } from '../../utils/constants';

const homeRoutes = [
  {
    method: 'GET',
    path: webRoutePaths.home,
    handler: HomeController.renderHomeHandler,
  },
];

export { homeRoutes };
