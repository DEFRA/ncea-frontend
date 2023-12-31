'use strict';

import { Server } from '@hapi/hapi';

/* eslint-disable  @typescript-eslint/no-var-requires */
const routes = [].concat(
  require('../../routes/web/home'),
  require('../../routes/web/sample'),
  require('../../routes/api/api'),
);

module.exports = {
  plugin: {
    name: 'router',
    register: (server: Server) => {
      server.route(routes);
    },
  },
};
