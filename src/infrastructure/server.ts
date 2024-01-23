'use strict';

import { Config } from '../config/environmentConfig';
import Hapi, { Server } from '@hapi/hapi';

// Create the hapi server
const server: Server = Hapi.server({
  host: process.env.HOST ?? 'localhost',
  port: Config.env !== 'test' ? Config.port : 4000,
  routes: {
    validate: {
      options: {
        abortEarly: false,
      },
    },
  },
});

const initializeServer = async (): Promise<Server> => {
  // Register vendors plugins
  await server.register([require('@hapi/inert'), require('@hapi/vision')]);

  // Register the custom plugins
  await server.register([
    require('./plugins/shared_data'),
    require('./plugins/views'),
    require('./plugins/router'),
    require('./plugins/logger'),
  ]);

  await server.initialize();
  return server;
};

const startServer = async (): Promise<Server> => {
  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
  return server;
};

export { initializeServer, startServer };
