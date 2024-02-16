
'use strict';

import { Config } from '../../config/environmentConfig'
import winston from 'winston';

const appInsights = require("applicationinsights");
const AzureApplicationInsightsLogger = require('winston-azure-application-insights').AzureApplicationInsightsLogger;
const shouldPushToAppInsights = Config.env === 'local';

if (!shouldPushToAppInsights) {  
  appInsights
  .setup(Config.appInsightsConnectionString)
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
} else {
    winston.add(new winston.transports.Console());
}

export default winston
  
