'use strict';

import { mock } from 'jest-mock-extended';
import { Request, ResponseToolkit } from '@hapi/hapi';
import { SearchResultsController } from '../../../src/controllers/web/SearchResultsController';
import { fromDate, toDate } from '../../../src/views/forms/dateQuestionnaireFields';
import { dateQuestionChronologicalError, dateQuestionnaireGovUKError } from '../../data/dateQuestionnaire';
import { DateQuestionnaireError } from '../../../src/interfaces/guidedSearch';
import * as errorTransformer from '../../../src/utils/transformErrors';

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
    takeover: jest.fn()
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