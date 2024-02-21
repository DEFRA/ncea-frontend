'use strict';

import { Server } from '@hapi/hapi';
import { dateSearchRoutes, errorRoutes, homeRoutes, searchResultsRoutes, staticRoutes } from '../../routes/index';

const routes = [...errorRoutes, ...staticRoutes, ...homeRoutes, ...dateSearchRoutes, ...searchResultsRoutes];

const customHapiRoutes = {
  plugin: {
    name: 'router',
    register: (server: Server) => {
      server.route(routes);
    },
  },
};

export { customHapiRoutes };
