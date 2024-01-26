'use strict';

import { DateQuestionnaireError } from '../../interfaces/guidedSearch';
import { transformErrors } from '../../utils/transformErrors';
import { Request, ResponseObject, ResponseToolkit } from '@hapi/hapi';
import { fromDate, toDate } from '../../views/forms/dateQuestionnaireFields';

const SearchResultsController = {
  renderSearchResultsHandler: async (request: Request, response: ResponseToolkit): Promise<ResponseObject> => {
    const { q: searchTerm } = request.query;
    return response.view('screens/results/template', { searchTerm });
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
};

export { SearchResultsController };
