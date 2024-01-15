'use strict';

import { HomeController } from '../../controllers/web/HomeController';
import { webRoutePaths } from '../../utils/constants';

module.exports = [
  {
    method: 'GET',
    path: webRoutePaths.home,
    handler: HomeController.renderHomeHandler,
  },
];
