'use strict';
import { Request, ResponseToolkit } from '@hapi/hapi';
import { SearchController } from '../../../src/controllers/web/SearchController';
import {
  sharedDataStructure,
  webRoutePaths,
} from '../../../src/utils/constants';

jest.mock('../../../src/services/handlers/searchApi', () => ({
  getSearchResults: jest.fn(),
}));

describe('Search Results Controller > deals with  handlers', () => {
  describe('Deals with the Quick Search Handler', () => {
    it('should update shared data and redirect to results', async () => {
      const request: Request = {
        payload: { search_term: 'example' },
        server: { updateSharedData: jest.fn() },
      } as any;
      const response: ResponseToolkit = { redirect: jest.fn() } as any;
      await SearchController.doQuickSearchHandler(request, response);
      expect(request.server.updateSharedData).toHaveBeenCalledWith(
        sharedDataStructure.searchTerm,
        'example'
      );
      expect(response.redirect).toHaveBeenCalledWith(webRoutePaths.results);
    });
  });

  describe('Deals with Search Results Handler', () => {
    it('should return the rendered view with shared data', async () => {
      const request: Request = {
        server: {
          getSharedData: jest.fn().mockReturnValue({
            [sharedDataStructure.searchTerm]: 'example term',
            [sharedDataStructure.searchResults]: [
              { id: 1, title: 'Result 1' },
              { id: 2, title: 'Result 2' },
            ],
          }),
        },
      } as any;
      const response: ResponseToolkit = { view: jest.fn() } as any;
      await SearchController.renderSearchResultsHandler(request, response);
      expect(response.view).toHaveBeenCalledWith('screens/results/template', {
        searchTerm: 'example term',
        quickSearchPath: webRoutePaths.quickSearch,
        searchResults: [
          { id: 1, title: 'Result 1' },
          { id: 2, title: 'Result 2' },
        ],
      });
    });
  });

  describe('Deals with Guided Date Search Handler', () => {
    it('should update shared data and redirect to results', async () => {
      const request: Request = {
        payload: { 'from-date-year': 2022, 'to-date-year': 2023 },
        server: { updateSharedData: jest.fn(), purgeSharedData: jest.fn() },
      } as any;
      const response: ResponseToolkit = { redirect: jest.fn() } as any;
      await SearchController.doDateSearchHandler(request, response);
      expect(request.server.updateSharedData).toHaveBeenCalledWith(
        sharedDataStructure.searchResults,
        undefined
      );
      expect(request.server.purgeSharedData).toHaveBeenCalledWith(
        sharedDataStructure.searchTerm
      );
      expect(response.redirect).toHaveBeenCalledWith(webRoutePaths.results);
    });
  });
});
