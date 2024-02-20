import { environmentConfig } from '../../config/environmentConfig';
import { getSecret } from '../../utils/keyvault';
import winston from 'winston';
/* eslint-disable  @typescript-eslint/no-var-requires */
const appInsights = require('applicationinsights');
const AzureApplicationInsightsLogger = require('winston-azure-application-insights').AzureApplicationInsightsLogger;
const DailyRotateFile = require('winston-daily-rotate-file');
const shouldPushToAppInsights = environmentConfig.env === 'local';

if (shouldPushToAppInsights) {
  getSecret('ApplicationInsights--ConnectionString')
    .then(appInsightsConnectionString => {
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
        .setDistributedTracingMode(appInsights.DistributedTracingModes.AI_AND_W3C);
      appInsights.defaultClient.setAutoPopulateAzureProperties();
      appInsights.start();
    
      // Use an existing app insights SDK instance
      winston.add(
        new AzureApplicationInsightsLogger({
          insights: appInsights,
        }),
      );
      console.log('Initialized app insights');
    });
      
} else {
  winston.add(new winston.transports.Console());
  winston.add(
    new DailyRotateFile({
      filename: `${__dirname}/../log_files/app_winston_log`,
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '7d',
    }),
  );
}

export default winston;
