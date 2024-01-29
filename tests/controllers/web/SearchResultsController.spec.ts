'use strict';

import { mock } from 'jest-mock-extended';
import { Request, ResponseToolkit } from '@hapi/hapi';
import { SearchResultsController } from '../../../src/controllers/web/SearchResultsController';
import { getSearchResults } from '../../../src/services/handlers/searchResultsApi';
import { ApiResponse } from '../../../src/models/ApiResponse';

jest.mock('../../../src/services/handlers/searchResultsApi');

describe('Search Results Controller > deals with rendering search results handler', () => {
  let mockRequest = mock<Request>();
  const mockResponse = mock<ResponseToolkit>();
  mockRequest.query['q'] = 'test search term';

  beforeAll(async () => {
    (getSearchResults as jest.Mock).mockResolvedValue(
      new ApiResponse({}, 200, true)
    );
    return SearchResultsController.renderSearchResultsHandler(
      mockRequest,
      mockResponse
    );
  });

  it('should call the Search view with context', async () => {
    expect(mockResponse.view).toHaveBeenCalledWith('screens/results/template', {
      searchTerm: mockRequest.query?.q,
      searchResults: {},
      hasResult: true,
    });
  });
});
