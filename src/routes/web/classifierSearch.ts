'use strict';

import { ClassifierSearchController } from '../../controllers/web/ClassifierSearchController';
import { webRoutePaths } from '../../utils/constants';

const classifierSearchRoutes = [
  {
    method: 'GET',
    path: webRoutePaths.guidedClassifierSearch,
    handler: ClassifierSearchController.renderClassifierSearchHandler,
  },
  {
    method: 'POST',
    path: webRoutePaths.guidedClassifierSearch,
    handler: ClassifierSearchController.classifierSearchSubmitHandler,
  },
];

export { classifierSearchRoutes };
