'use strict';

import { ClassifierSearchController } from '../../controllers/web/ClassifierSearchController';
import { webRoutePaths } from '../../utils/constants';

const classifierSearchRoutes = [
  {
    method: 'GET',
    path: webRoutePaths.guidedClassifierSearch,
    handler: ClassifierSearchController.renderClassifierSearchHandler,
  }
];

export { classifierSearchRoutes };
