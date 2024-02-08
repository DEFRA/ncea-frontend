'use strict';

import { Request, ResponseToolkit } from '@hapi/hapi';
import { HomeController } from '../../../src/controllers/web/HomeController';
import { formIds, webRoutePaths } from '../../../src/utils/constants';

describe('Deals with the Home Controller', () => {
  it('should call the home view with context', async () => {
    const request: Request = {} as any;
    const response: ResponseToolkit = { view: jest.fn() } as any;
    await HomeController.renderHomeHandler(request, response);
    const { quickSearch: quickSearchPath, guidedDateSearch: dateSearchPath } =
      webRoutePaths;
    const formId: string = formIds.quickSearch;
    expect(response.view).toHaveBeenCalledWith('screens/home/template', {
      quickSearchPath,
      formId,
      dateSearchPath,
    });
  });

  it('should redirect to results page', async () => {
    const request: Request = {} as any;
    const response: ResponseToolkit = { redirect: jest.fn() } as any;
    await HomeController.doQuickSearchHandler(request, response);
    expect(response.redirect).toHaveBeenCalledWith(webRoutePaths.results);
  });
});
