'use strict';

import { FormFieldError } from '../../interfaces/guidedSearch.interface';
import Joi from 'joi';
import { Lifecycle, Request, ResponseObject, ResponseToolkit } from '@hapi/hapi';

import { getSearchResultsCount } from '../../services/handlers/searchApi';
import { transformErrors } from '../../utils/transformErrors';
import { formIds, formKeys, guidedSearchSteps, pageTitles, queryParamKeys, webRoutePaths } from '../../utils/constants';
import { fromDate, toDate } from '../../data/dateQuestionnaireFieldOptions';
import { generateCountPayload, readQueryParams, upsertQueryParams } from '../../utils/queryStringHelper';

const DateSearchController = {
  renderGuidedSearchHandler: async (request: Request, response: ResponseToolkit): Promise<ResponseObject> => {
    const { guidedDateSearch, geographySearch, results } = webRoutePaths;
    const formId: string = formIds.dataQuestionnaireFID;
    const countPayload = generateCountPayload(request.query);
    const count = (await getSearchResultsCount(countPayload)).totalResults.toString();

    const queryParamsObject: Record<string, string> = {
      [queryParamKeys.journey]: 'gs',
      [queryParamKeys.count]: count,
    };
    const queryString: string = upsertQueryParams(request.query, queryParamsObject, false);

    const guidedDateSearchPath: string = `${guidedDateSearch}?${queryString}`;
    const skipPath: string = queryString ? `${geographySearch}?${queryString}` : geographySearch;

    const resultPathQueryString: string = readQueryParams(request.query, '', true);
    const resultsPath: string = `${results}?${resultPathQueryString}`;
    const hasSearchResultORSkipOnLevel1 = Number(count) > 0 || Object.keys(request.query).length === 0;

    if (hasSearchResultORSkipOnLevel1) {
      return response.view('screens/guided_search/date_questionnaire', {
        pageTitle: pageTitles.date,
        fromDate,
        toDate,
        guidedDateSearchPath,
        skipPath,
        formId,
        count,
        resultsPath,
        backLinkPath: '#',
        backLinkClasses: 'back-link-date',
      });
    } else {
      return response.redirect(`${webRoutePaths.results}?${queryString}`);
    }
  },
  dateSearchFailActionHandler: (
    request: Request,
    response: ResponseToolkit,
    error: Joi.ValidationError,
  ): Lifecycle.ReturnValue => {
    const { guidedDateSearch: guidedDateSearchPath, geographySearch } = webRoutePaths;
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

    // Updated logic for skipPath
    const queryStringObj = new URLSearchParams(queryString);
    queryStringObj.delete('fdy');
    queryStringObj.delete('tdy');
    const hasLevelOrParent = queryStringObj.has('level') || queryStringObj.has('parent');
    const skipPath: string = `${geographySearch}${hasLevelOrParent ? '?' + queryStringObj.toString() : ''}`;

    return response
      .view('screens/guided_search/date_questionnaire', {
        pageTitle: pageTitles.date,
        fromDate: fromField,
        toDate: toField,
        guidedDateSearchPath,
        skipPath,
        formId,
        count,
        backLinkPath: '#',
        backLinkClasses: 'back-link-date',
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
