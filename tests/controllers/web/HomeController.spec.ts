'use strict';

import { mock } from 'jest-mock-extended';
import { Request, ResponseToolkit } from '@hapi/hapi';
import { HomeController } from '../../../src/controllers/web/HomeController';
import { webRoutePaths } from '../../../src/utils/constants';

describe('Home Controller > deals with render home handler', () => {
  const mockRequest = mock<Request>();

  const mockResponse = mock<ResponseToolkit>();

  beforeAll(() => {
    return HomeController.renderHomeHandler(mockRequest, mockResponse);
  });

  it('should call the home view with context', async () => {
    const { quickSearch: quickSearchPath, guidedDateSearch: dateSearchPath } =
      webRoutePaths;
    expect(mockResponse.view).toHaveBeenCalledWith('screens/home/template', {
      quickSearchPath,
      dateSearchPath,
    });
  });
});
