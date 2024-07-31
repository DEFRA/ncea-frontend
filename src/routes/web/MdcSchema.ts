'use strict';

import { MdcSchemaController } from '../../controllers/web/MdcSchemaController';
import { webRoutePaths } from '../../utils/constants';

const mdcRoutes = [
  {
    method: 'GET',
    path: webRoutePaths.mdc,
    handler: MdcSchemaController.MdcSchemaHandler,
  },
  {
    method: 'GET',
    path: webRoutePaths.mdcClassifiers,
    handler: MdcSchemaController.MdcClassifierSchemaHandler,
  },
  {
    method: 'GET',
    path: webRoutePaths.mdcIdentifiers,
    handler: MdcSchemaController.MdcIdentifierSchemaHandler,
  },
];

export { mdcRoutes };
