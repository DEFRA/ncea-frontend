'use strict';

import { FormFieldError } from '../../interfaces/guidedSearch.interface';
import Joi from 'joi';
import { Lifecycle, Request, ResponseObject, ResponseToolkit } from '@hapi/hapi';

import { transformErrors } from '../../utils/transformErrors';
import { formIds, formKeys, webRoutePaths } from '../../utils/constants';
import { fromDate, toDate } from '../../data/dateQuestionnaireFieldOptions';

const DateSearchController = {
  renderGuidedSearchHandler: async (request: Request, response: ResponseToolkit): Promise<ResponseObject> => {
    const { guidedDateSearch: guidedDateSearchPath } = webRoutePaths;
    const formId: string = formIds.dataQuestionnaire;
    return response.view('screens/guided_search/date_questionnaire', {
      fromDate,
      toDate,
      guidedDateSearchPath,
      formId,
    });
  },
  doDateSearchFailActionHandler: async (
    request: Request,
    response: ResponseToolkit,
    error: Joi.ValidationError,
  ): Promise<Lifecycle.ReturnValue> => {
    const { guidedDateSearch: guidedDateSearchPath } = webRoutePaths;
    const { fromError, fromItems, toError, toItems } = transformErrors(
      error,
      formKeys.dateQuestionnaire,
    ) as FormFieldError;
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
    const formId: string = formIds.dataQuestionnaire;
    return response
      .view('screens/guided_search/date_questionnaire', {
        fromDate: fromField,
        toDate: toField,
        guidedDateSearchPath,
        formId,
      })
      .code(400)
      .takeover();
  },
  doDateSearchHandler: async (request: Request, response: ResponseToolkit): Promise<ResponseObject> => {
    return response.redirect(webRoutePaths.results);
  },
};

export { DateSearchController };
