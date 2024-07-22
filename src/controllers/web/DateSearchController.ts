'use strict';

import { FormFieldError } from '../../interfaces/guidedSearch.interface';
import Joi from 'joi';
import { Lifecycle, Request, ResponseObject, ResponseToolkit } from '@hapi/hapi';

import { transformErrors } from '../../utils/transformErrors';
import { formIds, formKeys, guidedSearchSteps, pageTitles, queryParamKeys, webRoutePaths } from '../../utils/constants';
import { fromDate, toDate } from '../../data/dateQuestionnaireFieldOptions';
import { readQueryParams, upsertQueryParams } from '../../utils/queryStringHelper';

let newRequest:String;
const DateSearchController = {
  renderGuidedSearchHandler: (request: Request, response: ResponseToolkit): ResponseObject => {
    const { guidedDateSearch: guidedDateSearchPath, home,results } = webRoutePaths;
    const count: string = readQueryParams(request.query, queryParamKeys.count);
    const formId: string = formIds.dataQuestionnaireFID;
    const queryString: string = readQueryParams(request.query, '');
    newRequest = queryString;
    const skipPath: string = `${webRoutePaths.intermediate}/${guidedSearchSteps.date}?${queryString}`;
    const resultPathQueryString: string = readQueryParams(request.query, '', true);
    const resultsPath: string = `${results}?${resultPathQueryString}`;
    return response.view('screens/guided_search/date_questionnaire', {
      pageTitle: pageTitles.date,
      fromDate,
      toDate,
      guidedDateSearchPath,
      skipPath,
      formId,
      count,
      resultsPath,
      backLinkPath: home,
    });
  },
  dateSearchFailActionHandler: (
    request: Request,
    response: ResponseToolkit,
    error: Joi.ValidationError,
  ): Lifecycle.ReturnValue => {
    const { guidedDateSearch: guidedDateSearchPath, home } = webRoutePaths;
    const count: string = readQueryParams(request.query, queryParamKeys.count);
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
    const queryString: string = readQueryParams(request.query, '');
    const skipPath: string = `${webRoutePaths.intermediate}/${guidedSearchSteps.date}?${queryString}`;;
    return response
      .view('screens/guided_search/date_questionnaire', {
        pageTitle: pageTitles.date,
        fromDate: fromField,
        toDate: toField,
        guidedDateSearchPath,
        skipPath,
        formId,
        count,
        backLinkPath: home,
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
    const queryString: string = upsertQueryParams(newRequest, queryParamsObject, false);
    return response.redirect(`${webRoutePaths.intermediate}/${guidedSearchSteps.date}?${queryString}`);
  },
};

export { DateSearchController };
