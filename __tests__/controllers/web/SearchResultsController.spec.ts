'use strict';

import { Request, ResponseToolkit } from '@hapi/hapi';
import { formIds, webRoutePaths } from '../../../src/utils/constants';
import { SearchResultsController } from '../../../src/controllers/web/SearchResultsController';

jest.mock('../../../src/services/handlers/searchApi', () => ({
  getSearchResults: jest.fn(),
  getSearchResultsCount: jest.fn(),
}));
describe('Deals with search results controller', () => {
  describe('Deals with search results handler', () => {
    it('should return the rendered view with context', async () => {
      const request: Request = {} as any;
      const response: ResponseToolkit = { view: jest.fn() } as any;

      const { results: quickSearchPath, getResults: getResultsPath } =
        webRoutePaths;
      const formId: string = formIds.quickSearch;
      await SearchResultsController.renderSearchResultsHandler(
        request,
        response,
      );
      expect(response.view).toHaveBeenCalledWith('screens/results/template', {
        quickSearchPath,
        getResultsPath,
        formId,
      });
    });

    it('should fetch the data and return the view', async () => {
      const request: Request = {} as any;
      const response: ResponseToolkit = { view: jest.fn() } as any;
      await SearchResultsController.getSearchResultsHandler(request, response);
      expect(response.view).toHaveBeenCalledWith('partials/results/template', {
        searchResults: undefined,
      });
    });
  });

  describe('Deals with search results count handler', () => {
    it('should fetch the total results count', async () => {
      const request: Request = {} as any;
      const response: ResponseToolkit = {
        response: jest.fn().mockReturnThis(),
      } as any;
      await SearchResultsController.getResultsCountHandler(request, response);
      expect(response.response).toHaveBeenCalledTimes(1);
    });
  });
});
