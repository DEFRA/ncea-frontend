'use strict';

import { environmentConfig } from '../config/environmentConfig';
import inert from '@hapi/inert';
import vision from '@hapi/vision';
import Hapi, { Server } from '@hapi/hapi';

import {
  customHapiPino,
  customHapiRoutes,
  customHapiViews,
} from './plugins/index';

const appInsights = require('applicationinsights');
appInsights
  .setup('8e4b93d8-b645-4aa9-9ad1-467f74ef1c04')
  .enableWebInstrumentation(true)
  .setAutoDependencyCorrelation(true)
  .setAutoCollectRequests(true)
  .setAutoCollectPerformance(true)
  .setAutoCollectExceptions(true)
  .setAutoCollectDependencies(true)
  .setAutoCollectConsole(true, true)
  .setUseDiskRetryCaching(true)
  .setSendLiveMetrics(true)
  .setInternalLogging(false, true)
  .setAutoCollectHeartbeat(true)
  .setDistributedTracingMode(appInsights.DistributedTracingModes.AI_AND_W3C);
appInsights.defaultClient.setAutoPopulateAzureProperties();
appInsights.start();

// Create the hapi server
const server: Server = Hapi.server({
  host: process.env.HOST ?? 'localhost',
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

  // server.ext('onRequest', (request, h) => {
  //   if (!request.path.startsWith('/assets')) {
  //     const payload = request.payload ? JSON.stringify(request.payload) : '';
  //     appInsights.defaultClient.trackTrace({
  //       message: `Incoming request: ${request.method.toUpperCase()} ${request.url.pathname}, Payload: ${payload}`,
  //     });
  //   }

  //   return h.continue;
  // });

  // server.ext('onPreResponse', (request, h) => {
  //   const response = request.response;
  //   if (!request.path.startsWith('/assets')) {
  //     if (response instanceof Error) {
  //       appInsights.defaultClient.trackException({ exception: response });
  //     } else {
  //       appInsights.defaultClient.trackTrace({
  //         message: `Response: ${response.statusCode} ${request.method.toUpperCase()} ${request.url.pathname}`,
  //       });
  //     }
  //   }
  //   return h.continue;
  // });

  server.events.on('request', (request, event, tags) => {
    appInsights.defaultClient.trackEvent({
      name: 'Custom log event',
      properties: event,
    });
  });

  // server.events.on(
  //   { name: 'request', channels: 'error' },
  //   (request, event, tags) => {
  //     const telemetryClient = appInsights.defaultClient;
  //     telemetryClient.trackRequest({
  //       exception: event.error,
  //     });
  //   },
  // );

  return server;
};

const startServer = async (): Promise<Server> => {
  await server.start();
  console.log(`Server running at: ${server.info.uri}`);
  return server;
};

export { initializeServer, startServer };
