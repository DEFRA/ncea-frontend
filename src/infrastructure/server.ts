'use strict';

import { environmentConfig } from '../config/environmentConfig';
import { getSecret } from '../utils/keyvault';
import inert from '@hapi/inert';
import vision from '@hapi/vision';
import Hapi, { Server } from '@hapi/hapi';

import { customHapiPino, customHapiRoutes, customHapiViews } from './plugins/index';
const appInsightsConnectionStringSecretName =
  environmentConfig.appInsightsSecretName ?? 'ApplicationInsights--ConnectionString';
const shouldPushToAppInsights = environmentConfig.env === 'local';

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
  if (!shouldPushToAppInsights) {
    const appInsightsConnectionString = await getSecret(appInsightsConnectionStringSecretName);

    environmentConfig.appInsightsConnectionString = appInsightsConnectionString;
    customHapiViews.options.context.appInsightsConnectionString = appInsightsConnectionString;
  }
  const classifierApiClientId = await getSecret(environmentConfig.classifierApi.clientIdSecretName);
  const classifierApiClientSecret = await getSecret(environmentConfig.classifierApi.clientSecretName);
  environmentConfig.classifierApi.clientId = classifierApiClientId;
  environmentConfig.classifierApi.clientSecret = classifierApiClientSecret;

  // Register vendors plugins
  await server.register([inert, vision]);

  // Register the custom plugins
  await server.register([customHapiViews, customHapiRoutes, customHapiPino]);

  await server.initialize();

  return server;
};

const startServer = async (): Promise<Server> => {
  await server.start();
  console.log(`Server running at: http://${server.info.host}:${server.info.port}`);
  return server;
};

export { initializeServer, startServer };
