'use strict';

import { mock } from 'jest-mock-extended';
import { Request, ResponseToolkit } from '@hapi/hapi';
import { SearchResultsController } from '../../../src/controllers/web/SearchResultsController';

describe('Search Results Controller > deals with rendering search results handler', () => {
  const mockRequest = mock<Request>();

  const mockResponse = mock<ResponseToolkit>();

  beforeAll(() => {
    return SearchResultsController.renderSearchResultsHandler(
      mockRequest,
      mockResponse
    );
  });

  it('should call the Search view with context', async () => {
    expect(mockResponse.view).toHaveBeenCalledWith('screens/results/template', {
      searchTerm: mockRequest.query?.q,
    });
  });
});
