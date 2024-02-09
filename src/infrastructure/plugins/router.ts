'use strict';

import { Server } from '@hapi/hapi';
import {
  dateSearchRoutes,
  geographySearchRoutes,
  homeRoutes,
  searchResultsRoutes,
  staticRoutes,
} from '../../../src/routes/index';

const routes = [...staticRoutes, ...homeRoutes, ...dateSearchRoutes, ...geographySearchRoutes, ...searchResultsRoutes];

const customHapiRoutes = {
  plugin: {
    name: 'router',
    register: (server: Server) => {
      server.route(routes);
    },
  },
};

export { customHapiRoutes };
