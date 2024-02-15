import path from 'path';
import { webRoutePaths } from '../../../src/utils/constants';
import nunjucks, { Environment } from 'nunjucks';
jest.mock('nunjucks');
describe('Vision Plugin Configuration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should configure nunjucks and return the plugin configuration', async () => {
    const nunjucksMock = jest.requireMock('nunjucks');
    const { options } = require('../../../src/infrastructure/plugins/views');
    nunjucksMock.configure.mockImplementation(() => ({ addFilter: jest.fn() }));
    const mockEnvironment: Environment = {
      addFilter: jest.fn(),
    } as unknown as Environment;
    jest.spyOn(nunjucks, 'configure').mockReturnValueOnce(mockEnvironment);

    const nextMock = jest.fn();
    await options.engines.njk.prepare(
      {
        compileOptions: { environment: mockEnvironment },
        relativeTo: 'mockedRelativeTo',
        path: 'mockedPath',
      },
      nextMock
    );
    expect(nunjucksMock.configure).toHaveBeenCalledWith(
      [
        path.join('mockedRelativeTo', 'mockedPath'),
        'node_modules/govuk-frontend/dist',
      ],
      { autoescape: true, watch: false }
    );
    expect(nextMock).toHaveBeenCalledTimes(1);
    expect(options.engines.njk.compile).toBeDefined();
    expect(options.path).toBe('../../views');
    expect(options.isCached).toBe(process.env.NODE_ENV !== 'production');
    expect(options.context).toEqual({
      assetPath: '/assets',
      serviceName: 'Natural Capital Search Service',
      pageTitle: 'Natural Capital Search Service - GOV.UK',
      homePageUrl: webRoutePaths.home,
      appInsightsConnectionString: 'InstrumentationKey=beb07cdc-ed03-493a-88e3-ce52a5db8a99;IngestionEndpoint=https://westeurope-5.in.applicationinsights.azure.com/;LiveEndpoint=https://westeurope.livediagnostics.monitor.azure.com'
    });
  });
  it('should compile and render the template', () => {
    const nunjucksMock = jest.requireMock('nunjucks');
    const { options } = require('../../../src/infrastructure/plugins/views');
    nunjucksMock.compile.mockImplementation(
      (src: string, env: nunjucks.Environment) => {
        const template = {
          render: (context: object | undefined) =>
            `renderedTemplate: ${JSON.stringify(context)}`,
        };
        return template;
      }
    );
    const mockEnvironment: nunjucks.Environment = {} as any;
    const src = '<div>{{ data }}</div>';
    const compiledTemplate = options.engines.njk.compile(src, {
      environment: mockEnvironment,
    });
    const renderedTemplate = compiledTemplate({ data: 'testData' });
    expect(nunjucksMock.compile).toHaveBeenCalledWith(src, mockEnvironment);
    expect(renderedTemplate).toBe('renderedTemplate: {"data":"testData"}');
  });
});
