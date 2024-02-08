'use strict';

import { GeographySearchController } from '../../controllers/web/GeographySearchController';
import { geographyQuestionnaireSchema } from '../../schema/geographyQuestionnaire.schema';
import { webRoutePaths } from '../../utils/constants';

const geographySearchRoutes = [
  {
    method: 'GET',
    path: webRoutePaths.geographySearch,
    handler: GeographySearchController.renderGeographySearchHandler,
  },
  {
    method: 'POST',
    path: webRoutePaths.geographySearch,
    handler: GeographySearchController.doGeographySearchHandler,
    options: {
      validate: {
        payload: geographyQuestionnaireSchema,
        failAction:
          GeographySearchController.doGeographySearchFailActionHandler,
      },
    },
  },
];

export { geographySearchRoutes };
