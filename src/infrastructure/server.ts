'use strict';

import { Config } from '../config/environmentConfig';
import Hapi, { Server } from '@hapi/hapi';
import { getSecret } from '../utils/keyvault';

const winston = require('winston');
const appInsights = require("applicationinsights");
const { AzureApplicationInsightsLogger } = require('winston-azure-application-insights');

const shouldPushToAppInsights = 'SHOULD_PUSH_TO_APPINSIGHTS' in process.env;

if (shouldPushToAppInsights) {
    // appInsights
    //   .setup("InstrumentationKey=beb07cdc-ed03-493a-88e3-ce52a5db8a99;IngestionEndpoint=https://westeurope-5.in.applicationinsights.azure.com/;LiveEndpoint=https://westeurope.livediagnostics.monitor.azure.com")
    //   .enableWebInstrumentation(true)
    //   .setAutoDependencyCorrelation(true)
    //   .setAutoCollectRequests(true)
    //   .setAutoCollectPerformance(true)
    //   .setAutoCollectExceptions(true)
    //   .setAutoCollectDependencies(true)
    //   .setAutoCollectConsole(true, true)
    //   .setUseDiskRetryCaching(true)
    //   .setSendLiveMetrics(true)
    //   .setInternalLogging(false, true)
    //   .setAutoCollectHeartbeat(true)
    //   .setDistributedTracingMode(appInsights.DistributedTracingModes.AI_AND_W3C)
    // appInsights.defaultClient.setAutoPopulateAzureProperties()
    // appInsights.start();
  getSecret("ApplicationInsights--ConnectionString")
  .then(appInsightsConnectionString  => {
    appInsights
      .setup(appInsightsConnectionString)
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
      .setDistributedTracingMode(appInsights.DistributedTracingModes.AI_AND_W3C)
    appInsights.defaultClient.setAutoPopulateAzureProperties()
    appInsights.start();

    // Use an existing app insights SDK instance
    winston.add(new AzureApplicationInsightsLogger({
      insights: appInsights
   }));
    console.log('Initialized app insights');
  })
  .catch(e => {
    throw new Error('Cannot initialise app insights, reason: ' + e);
  });   
} else {
    winston.add(new winston.transports.Console());
}
global.logger = winston;

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
  await server.register([require('./plugins/views'), require('./plugins/router'), require('./plugins/logger')]);

  await server.initialize();
  return server;
};

const startServer = async (): Promise<Server> => {
  await server.start();
  console.log(`Server running at: ${server.info.uri}`);  
  return server;
};

export { initializeServer, startServer };
