'use strict';

import { Server } from '@hapi/hapi';

/* eslint-disable  @typescript-eslint/no-var-requires */
const routes = [].concat(
  require('../../routes/web/assets'),
  require('../../routes/web/home'),
  require('../../routes/web/results'),
  require('../../routes/web/sample'),
  require('../../routes/api/api'),
  require('../../routes/web/404'),
);

module.exports = {
  plugin: {
    name: 'router',
    register: (server: Server) => {
      server.route(routes);
    },
  },
};
