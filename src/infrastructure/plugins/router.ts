'use strict';

import { Server } from '@hapi/hapi';
import { dateSearchRoutes, homeRoutes, searchResultsRoutes, staticRoutes } from '../../../src/routes/index';

const routes = [...staticRoutes, ...homeRoutes, ...dateSearchRoutes, ...searchResultsRoutes];

const customHapiRoutes = {
  plugin: {
    name: 'router',
    register: (server: Server) => {
      server.route(routes);
    },
  },
};

export { customHapiRoutes };
