import dateFilter from 'nunjucks-date-filter';
import { environmentConfig } from '../../config/environmentConfig';
import nunjucks from 'nunjucks';
import path from 'path';
import vision from '@hapi/vision';
import { webRoutePaths } from '../../utils/constants';

const {
  home: homePage,
  results: searchResults,
  guidedClassifierSearch: guidedSearch,
  guidedDateSearch,
  getMapResults,
  getMapFilters,
  filterResourceType,
  filterStudyPeriod,
  help,
  accessibilityStatement,
  termsAndConditions,
  privacyPolicy,
  cookiePolicy,
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

          return next();
        },
      },
    },
    path: '../../views',
    relativeTo: __dirname,
    isCached: process.env.NODE_ENV !== 'production',
    context: {
      assetPath: '/assets',
      serviceName: 'Find Natural Capital data',
      pageTitle: 'Find Natural Capital data - GOV.UK',
      routes: {
        homePage,
        searchResults,
        guidedSearch,
        guidedDateSearch,
        getMapResults,
        getMapFilters,
        filterResourceType,
        filterStudyPeriod,
        help,
        accessibilityStatement,
        termsAndConditions,
        privacyPolicy,
        cookiePolicy,
      },
      appInsightsConnectionString: environmentConfig.appInsightsConnectionString,
      gtmId: environmentConfig.gtmId,
    },
  },
};

export { customHapiViews };
