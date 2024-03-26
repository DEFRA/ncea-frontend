import dateFilter from 'nunjucks-date-filter';
import { environmentConfig } from '../../config/environmentConfig';
import nunjucks from 'nunjucks';
import path from 'path';
import vision from '@hapi/vision';
import { webRoutePaths } from '../../utils/constants';

const {
  home: homePage,
  results: searchResults,
  guidedDateSearch: guidedSearch,
  getResults,
  getFilters,
  getResultsCount,
} = webRoutePaths;

const customHapiViews = {
  plugin: vision,
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
          options.compileOptions.environment.addFilter('merge', (obj1, obj2) => {
            return { ...obj1, ...obj2 };
          });
          options.compileOptions.environment.addFilter('json_encode', (obj) => {
            return JSON.stringify(obj);
          });

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
      routes: {
        homePage,
        searchResults,
        guidedSearch,
        getFilters,
        getResults,
        getResultsCount,
      },
      appInsightsConnectionString: environmentConfig.appInsightsConnectionString,
    },
  },
};

export { customHapiViews };
