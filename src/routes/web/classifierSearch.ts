'use strict';

import { ClassifierSearchController } from '../../controllers/web/ClassifierSearchController';
// import { dateSchema } from '../../schema/questionnaire.schema';
import { webRoutePaths } from '../../utils/constants';

const classifierSearchRoutes = [
  {
    method: 'GET',
    path: webRoutePaths.guidedClassifierSearch,
    handler: ClassifierSearchController.renderClassifierSearchHandler,
  },
];

export { classifierSearchRoutes };
