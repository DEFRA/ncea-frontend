import winston from 'winston';
import { Config } from '../../../src/config/environmentConfig';
import appInsights from 'applicationinsights';
import AzureApplicationInsightsLogger from 'winston-azure-application-insights';
import DailyRotateFile from 'winston-daily-rotate-file';

jest.mock('../../../src/config/environmentConfig', () => ({
  Config: {
    env: 'local',
    appInsightsConnectionString: 'your-connection-string',
  },
}));

jest.mock('applicationinsights', () => ({
  setup: jest.fn().mockReturnThis(),
  enableWebInstrumentation: jest.fn().mockReturnThis(),
  setAutoDependencyCorrelation: jest.fn().mockReturnThis(),
  setAutoCollectRequests: jest.fn().mockReturnThis(),
  setAutoCollectPerformance: jest.fn().mockReturnThis(),
  setAutoCollectExceptions: jest.fn().mockReturnThis(),
  setAutoCollectDependencies: jest.fn().mockReturnThis(),
  setAutoCollectConsole: jest.fn().mockReturnThis(),
  setUseDiskRetryCaching: jest.fn().mockReturnThis(),
  setSendLiveMetrics: jest.fn().mockReturnThis(),
  setInternalLogging: jest.fn().mockReturnThis(),
  setAutoCollectHeartbeat: jest.fn().mockReturnThis(),
  setDistributedTracingMode: jest.fn().mockReturnThis(),
  defaultClient: {
    setAutoPopulateAzureProperties: jest.fn(),
  },
  start: jest.fn(),
}));

describe('Winston Logger Configuration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should configure winston logger with correct transports', () => {
    const shouldPushToAppInsights = Config.env === 'local';

    if (!shouldPushToAppInsights) {
      console.log = jest.fn();

      const insights = appInsights.setup();
      const azureLogger = new AzureApplicationInsightsLogger({ insights });
      winston.add(azureLogger);

      expect(appInsights.setup).toHaveBeenCalledWith('your-connection-string');
      expect(appInsights.start).toHaveBeenCalled();
      expect(
        appInsights.defaultClient.setAutoPopulateAzureProperties
      ).toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith('Initialized app insights');
    } else {
      winston.add(new winston.transports.Console());
      winston.add(
        new DailyRotateFile({
          filename: `${__dirname}/../log_files/app_winston_log`,
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '7d',
        })
      );

      const transports = winston.transports;
      expect(transports.Console).toBeTruthy();
      expect(transports.DailyRotateFile).toBeTruthy();
    }
  });
});
