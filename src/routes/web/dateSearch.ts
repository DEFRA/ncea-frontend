'use strict';

import { DateSearchController } from '../../controllers/web/DateSearchController';
import { dateSchema } from '../../schema/questionnaire.schema';
import { webRoutePaths } from '../../utils/constants';

const dateSearchRoutes = [
  {
    method: 'GET',
    path: webRoutePaths.guidedDateSearch,
    handler: DateSearchController.renderGuidedSearchHandler,
  },
  {
    method: 'POST',
    path: webRoutePaths.guidedDateSearch,
    handler: DateSearchController.dateSearchSubmitHandler,
    options: {
      validate: {
        payload: dateSchema,
        failAction: DateSearchController.dateSearchFailActionHandler,
      },
    },
  },
];

export { dateSearchRoutes };
