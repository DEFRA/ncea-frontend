'use strict';

import { mock } from 'jest-mock-extended';
import { Request, ResponseToolkit } from '@hapi/hapi';
import { SearchResultsController } from '../../../src/controllers/web/SearchResultsController';
import { getSearchResults } from '../../../src/services/handlers/searchResultsApi';
import { ApiResponse } from '../../../src/Models/ApiResponse';
import { fromDate, toDate } from '../../../src/views/forms/dateQuestionnaireFields';
import { dateQuestionChronologicalError, dateQuestionnaireGovUKError } from '../../data/dateQuestionnaire';
import { quickSearchJoiError } from '../../data/quickSearch';
import { DateQuestionnaireError } from '../../../src/interfaces/guidedSearch';
import * as errorTransformer from '../../../src/utils/transformErrors';

jest.mock('../../../src/services/handlers/searchResultsApi');

describe('Search Results Controller > deals with rendering search results handler', () => {
  const mockResponse = mock<ResponseToolkit>();
  const mockRequest = {
    payload: {
      q: 'test search term'
    }
  };

  beforeAll(async () => {
    (getSearchResults as jest.Mock).mockResolvedValue(
      new ApiResponse({}, 200, true)
    );
    return SearchResultsController.renderSearchResultsHandler(
      mockRequest as Request,
      mockResponse
    );
  });

  it('should call the Search view with context', async () => {
    expect(mockResponse.view).toHaveBeenCalledWith('screens/results/template', {
      searchTerm: mockRequest.payload?.q as string,
      searchResults: {},
      hasResult: true,
    });
  });
});

describe('Search Results Controller > renderGuidedSearchHandler', () => {
  const mockRequest = mock<Request>();
  const mockResponse = mock<ResponseToolkit>();

  beforeAll(() => {
    return SearchResultsController.renderGuidedSearchHandler(
      mockRequest,
      mockResponse
    );
  });

  it('should render the date questionnaire template', async () => {
    expect(mockResponse.view).toHaveBeenCalledWith('screens/guided_search/date_questionnaire', {
      fromDate, toDate
    });
  });
});

describe('Search Results Controller > guidedSearchFailActionHandler', () => {
  const h = {
    view: jest.fn().mockReturnThis(),
    takeover: jest.fn(),
    code: jest.fn().mockReturnThis(),
  };
  const error = {};
  jest.spyOn(errorTransformer,'transformErrors').mockReturnValue(dateQuestionChronologicalError as DateQuestionnaireError);
  beforeAll(() => {
    return SearchResultsController.guidedSearchFailActionHandler(h, error);
  });

  it('should render the date questionnaire template with error messages', async () => {
    expect(h.view).toHaveBeenCalledWith('screens/guided_search/date_questionnaire', dateQuestionnaireGovUKError);
  });
});

describe('Search Results Controller > quickSearchFailActionHandler > home page', () => {
  const h = {
    view: jest.fn().mockReturnThis(),
    takeover: jest.fn(),
    code: jest.fn().mockReturnThis(),
  };
  const request = {
    payload: {
      pageName: 'home'
    }
  }
  beforeAll(() => {
    return SearchResultsController.quickSearchFailActionHandler(request, h, quickSearchJoiError);
  });

  it('should render the home page with error messages', async () => {
    expect(h.view).toHaveBeenCalledWith('screens/home/template', {searchInputError: {
      text: 'Please enter keywords into the search field.'
    }});
  });
});

describe('Search Results Controller > quickSearchFailActionHandler > results page', () => {
  const h = {
    view: jest.fn().mockReturnThis(),
    takeover: jest.fn(),
    code: jest.fn().mockReturnThis(),
  };
  const request = {
    payload: {
      pageName: 'results'
    }
  }
  beforeAll(() => {
    return SearchResultsController.quickSearchFailActionHandler(request, h, quickSearchJoiError);
  });

  it('should render the results page with error messages', async () => {
    expect(h.view).toHaveBeenCalledWith('screens/results/template', {searchInputError: {
      text: 'Please enter keywords into the search field.'
    }});
  });
});