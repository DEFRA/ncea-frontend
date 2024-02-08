'use strict';

import { DateQuestionnaireError } from '../../interfaces/guidedSearch';
import { getSearchResults } from '../../services/handlers/searchResultsApi';
import { transformErrors } from '../../utils/transformErrors';
import { Request, ResponseObject, ResponseToolkit } from '@hapi/hapi';
import { fromDate, toDate } from '../../views/forms/dateQuestionnaireFields';

const SearchResultsController = {
  renderSearchResultsHandler: async (request: Request, response: ResponseToolkit): Promise<ResponseObject> => {
    const { q: searchTerm } = request.query;

    let results = { isSuccessful: true, response: {} };
    if (searchTerm) {
      results = await getSearchResults(searchTerm);
    }
    return response.view('screens/results/template', {
      hasResult: results.isSuccessful,
      searchResults: results.response,
      searchTerm: searchTerm,
    });
  },
  renderGuidedSearchHandler: async (request: Request, response: ResponseToolkit): Promise<ResponseObject> => {
    return response.view('screens/guided_search/date_questionnaire', { fromDate, toDate });
  },
  guidedSearchFailActionHandler: (h, error) => {
    const { fromError, fromItems, toError, toItems } = transformErrors(
      error,
      'date-questionnaire',
    ) as DateQuestionnaireError;
    const fromField = {
      ...fromDate,
      ...(fromError && { errorMessage: { text: fromError } }),
      items: fromItems,
    };
    const toField = {
      ...toDate,
      ...(toError && { errorMessage: { text: toError } }),
      items: toItems,
    };
    return h.view('screens/guided_search/date_questionnaire', { fromDate: fromField, toDate: toField }).takeover();
  },
  quickSearchFailActionHandler: (request, response, error) => {
    const searchError: string | undefined = error?.details?.[0].message ? error?.details?.[0].message : undefined;
    return response
      .view(request.payload.pageName === 'home' ? 'screens/home/template' : 'screens/results/template', {
        searchInputError: searchError
          ? {
              text: searchError,
            }
          : undefined,
      })
      .takeover();
  },
};

export { SearchResultsController };
