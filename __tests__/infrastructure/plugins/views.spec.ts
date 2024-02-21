import { environmentConfig } from '../../../src/config/environmentConfig';
import path from 'path';
import { webRoutePaths } from '../../../src/utils/constants';
import nunjucks, { Environment } from 'nunjucks';
import { customHapiViews } from '../../../src/infrastructure/plugins/views';

jest.mock('nunjucks');

describe('Vision Plugin Configuration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should configure nunjucks and return the plugin configuration', async () => {
    const nunjucksMock = jest.requireMock('nunjucks');
    const { options } = customHapiViews;
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
      nextMock,
    );
    expect(nunjucksMock.configure).toHaveBeenCalledWith(
      [
        path.join('mockedRelativeTo', 'mockedPath'),
        'node_modules/govuk-frontend/dist',
      ],
      { autoescape: true, watch: false },
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
      appInsightsConnectionString:
        environmentConfig.appInsightsConnectionString,
    });
    expect(mockEnvironment.addFilter).toHaveBeenCalledTimes(2);
  });
  it('should compile and render the template', () => {
    const nunjucksMock = jest.requireMock('nunjucks');
    const { options } = customHapiViews;
    nunjucksMock.compile.mockImplementation(
      (src: string, env: nunjucks.Environment) => {
        const template = {
          render: (context: object | undefined) =>
            `renderedTemplate: ${JSON.stringify(context)}`,
        };
        return template;
      },
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
  it('should add a custom date filter to the environment', () => {
    const nunjucksMock = jest.requireMock('nunjucks');
    const { options } = customHapiViews;
    const mockEnvironment: Environment = {
      addFilter: jest.fn(),
    } as unknown as Environment;
    nunjucksMock.configure.mockReturnValueOnce(mockEnvironment);
    const nextMock = jest.fn();
    options.engines.njk.prepare(
      {
        compileOptions: { environment: mockEnvironment },
        relativeTo: 'mockedRelativeTo',
        path: 'mockedPath',
      },
      nextMock,
    );
    expect(mockEnvironment.addFilter).toHaveBeenCalledWith(
      'date',
      expect.any(Function),
    );
  });

  it('should add a custom merge filter to the environment', () => {
    const nunjucksMock = jest.requireMock('nunjucks');
    const { options } = customHapiViews;

    const mockEnvironment: Environment = {
      addFilter: jest.fn(),
    } as unknown as Environment;

    nunjucksMock.configure.mockReturnValueOnce(mockEnvironment);

    const nextMock = jest.fn();
    options.engines.njk.prepare(
      {
        compileOptions: { environment: mockEnvironment },
        relativeTo: 'mockedRelativeTo',
        path: 'mockedPath',
      },
      nextMock,
    );

    const addFilterMock = mockEnvironment.addFilter as jest.Mock;
    const mergeFilterFunction = addFilterMock.mock.calls.find(
      (call) => call[0] === 'merge',
    )[1] as Function;

    const obj1 = { a: 1, b: 2 };
    const obj2 = { c: 3, d: 4 };
    const mergedObject = mergeFilterFunction(obj1, obj2);

    expect(mergedObject).toEqual({ a: 1, b: 2, c: 3, d: 4 });
  });
});
