'use strict';

import { environmentConfig } from '../config/environmentConfig';
import inert from '@hapi/inert';
import vision from '@hapi/vision';
import Hapi, { Server } from '@hapi/hapi';
import logger from '../infrastructure/plugins/appinsights-logger';

import { customHapiPino, customHapiRoutes, customHapiViews } from './plugins/index';

// Create the hapi server
const server: Server = Hapi.server({
  host: process.env.HOST ?? '0.0.0.0',
  port: environmentConfig.env !== 'test' ? environmentConfig.port : 4000,
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
  await server.register([inert, vision]);

  // Register the custom plugins
  await server.register([customHapiViews, customHapiRoutes, customHapiPino]);

  await server.initialize();
  return server;
};

const startServer = async (): Promise<Server> => {
  logger.info('Initializing server');
  await server.start();  
  console.log(`Server running at: ${server.info.uri}`);
  return server;
};

export { initializeServer, startServer };
