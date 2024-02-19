'use strict';

import { Request, ResponseToolkit } from '@hapi/hapi';
import { HomeController } from '../../../src/controllers/web/HomeController';
import { formIds, webRoutePaths } from '../../../src/utils/constants';

jest.mock('../../../src/infrastructure/plugins/appinsights-logger', () => ({
  info: jest.fn(),
}));

describe('Deals with Home Controller > renderHomeHandler', () => {
  it('should call the home view with context', async () => {
    const request: Request = {} as any;
    const response: ResponseToolkit = { view: jest.fn() } as any;
    await HomeController.renderHomeHandler(request, response);
    const { results: quickSearchPath, guidedDateSearch: dateSearchPath } =
      webRoutePaths;
    const formId: string = formIds.quickSearch;
    expect(response.view).toHaveBeenCalledWith('screens/home/template', {
      quickSearchPath,
      formId,
      dateSearchPath,
      searchInputError: undefined,
    });
  });
});
