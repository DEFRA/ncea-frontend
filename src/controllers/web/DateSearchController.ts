'use strict';

import { FormFieldError } from '../../interfaces/guidedSearch.interface';
import Joi from 'joi';
import { Lifecycle, Request, ResponseObject, ResponseToolkit } from '@hapi/hapi';

import { transformErrors } from '../../utils/transformErrors';
import { formIds, formKeys, webRoutePaths } from '../../utils/constants';
import { fromDate, toDate } from '../../data/dateQuestionnaireFieldOptions';

const DateSearchController = {
  renderGuidedSearchHandler: (request: Request, response: ResponseToolkit): ResponseObject => {
    const { guidedDateSearch: guidedDateSearchPath, geographySearch: skipPath } = webRoutePaths;
    const formId: string = formIds.dataQuestionnaire;
    return response.view('screens/guided_search/date_questionnaire', {
      fromDate,
      toDate,
      guidedDateSearchPath,
      skipPath,
      formId,
    });
  },
  doDateSearchFailActionHandler: (
    request: Request,
    response: ResponseToolkit,
    error: Joi.ValidationError,
  ): Lifecycle.ReturnValue => {
    const { guidedDateSearch: guidedDateSearchPath, geographySearch: skipPath } = webRoutePaths;
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
        skipPath,
        formId,
      })
      .code(400)
      .takeover();
  },
  doDateSearchHandler: (request: Request, response: ResponseToolkit): ResponseObject => {
    return response.redirect(webRoutePaths.geographySearch);
  },
};

export { DateSearchController };
