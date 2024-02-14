import nunjucks from 'nunjucks';
import path from 'path';
import { webRoutePaths } from '../../utils/constants';
/* eslint-disable  @typescript-eslint/no-var-requires */
const dateFilter = require('nunjucks-date-filter');

module.exports = {
  plugin: require('@hapi/vision'),
  options: {
    engines: {
      njk: {
        compile: (src: string, options: { environment: nunjucks.Environment | undefined }) => {
          const template = nunjucks.compile(src, options.environment);

          return (context: object | undefined) => {
            return template.render(context);
          };
        },
        prepare: (
          options: {
            compileOptions: { environment: nunjucks.Environment };
            /* eslint-disable  @typescript-eslint/no-explicit-any */
            relativeTo: any;
            path: string;
          },
          /* eslint-disable  @typescript-eslint/no-explicit-any */
          next: () => any,
        ) => {
          options.compileOptions.environment = nunjucks.configure(
            [path.join(options.relativeTo, options.path), 'node_modules/govuk-frontend/dist'],
            {
              autoescape: true,
              watch: false,
            },
          );
          options.compileOptions.environment.addFilter('date', dateFilter);

          return next();
        },
      },
    },
    path: '../../views',
    relativeTo: __dirname,
    isCached: process.env.NODE_ENV !== 'production',
    context: {
      assetPath: '/assets',
      serviceName: 'Natural Capital Search Service',
      pageTitle: 'Natural Capital Search Service - GOV.UK',
      homePageUrl: webRoutePaths.home,
      appInsightsConnectionString: 'InstrumentationKey=beb07cdc-ed03-493a-88e3-ce52a5db8a99;IngestionEndpoint=https://westeurope-5.in.applicationinsights.azure.com/;LiveEndpoint=https://westeurope.livediagnostics.monitor.azure.com'
    },
  },
};
