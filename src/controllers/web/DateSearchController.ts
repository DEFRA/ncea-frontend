'use strict';

import { FormFieldError } from '../../interfaces/guidedSearch.interface';
import Joi from 'joi';
import { Lifecycle, Request, ResponseObject, ResponseToolkit } from '@hapi/hapi';

import { transformErrors } from '../../utils/transformErrors';
import { upsertQueryParams } from '../../utils/queryStringHelper';
import { formIds, formKeys, guidedSearchSteps, pageTitles, queryParamKeys, webRoutePaths } from '../../utils/constants';
import { fromDate, toDate } from '../../data/dateQuestionnaireFieldOptions';

const DateSearchController = {
  renderGuidedSearchHandler: (request: Request, response: ResponseToolkit): ResponseObject => {
    const { guidedDateSearch: guidedDateSearchPath, geographySearch: skipPath } = webRoutePaths;
    const formId: string = formIds.dataQuestionnaireFID;
    return response.view('screens/guided_search/date_questionnaire', {
      pageTitle: pageTitles.date,
      fromDate,
      toDate,
      guidedDateSearchPath,
      skipPath,
      formId,
    });
  },
  dateSearchFailActionHandler: (
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
    const formId: string = formIds.dataQuestionnaireFID;
    return response
      .view('screens/guided_search/date_questionnaire', {
        pageTitle: pageTitles.date,
        fromDate: fromField,
        toDate: toField,
        guidedDateSearchPath,
        skipPath,
        formId,
      })
      .code(400)
      .takeover();
  },
  dateSearchSubmitHandler: (request: Request, response: ResponseToolkit): ResponseObject => {
    const payload = request.payload as Record<string, string>;
    const queryParamsObject: Record<string, string> = {
      [queryParamKeys.journey]: 'gs',
      [queryParamKeys.fromDateDay]: payload?.['from-date-day'] ?? '',
      [queryParamKeys.fromDateMonth]: payload?.['from-date-month'] ?? '',
      [queryParamKeys.fromDateYear]: payload?.['from-date-year'] ?? '',
      [queryParamKeys.toDateDay]: payload?.['to-date-day'] ?? '',
      [queryParamKeys.toDateMonth]: payload?.['to-date-month'] ?? '',
      [queryParamKeys.toDateYear]: payload?.['to-date-year'] ?? '',
    };
    const queryString: string = upsertQueryParams(request.query, queryParamsObject, false);
    return response.redirect(`${webRoutePaths.intermediate}/${guidedSearchSteps.date}?${queryString}`);
  },
};

export { DateSearchController };
