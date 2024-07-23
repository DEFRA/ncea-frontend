'use strict';

import { Server } from '@hapi/hapi';
import {
  classifierSearchRoutes,
  dateSearchRoutes,
  errorRoutes,
  geographySearchRoutes,
  homeRoutes,
  searchResultsRoutes,
  staticRoutes,
  mdcRoutes
} from '../../routes/index';

const routes = [
  ...errorRoutes,
  ...staticRoutes,
  ...homeRoutes,
  ...classifierSearchRoutes,
  ...dateSearchRoutes,
  ...geographySearchRoutes,
  ...searchResultsRoutes,
  ...mdcRoutes
];

const customHapiRoutes = {
  plugin: {
    name: 'router',
    register: (server: Server) => {
      server.route(routes);
    },
  },
};

export { customHapiRoutes };
