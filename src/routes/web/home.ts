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
    method: 'GET',
    path: `${webRoutePaths.intermediate}/{step}`,
    handler: HomeController.intermediateHandler,
  },
  {
    method: 'GET',
    path: webRoutePaths.accessibilityStatement,
    handler: HomeController.accessibilityHandler,
  },
];

export { homeRoutes };
