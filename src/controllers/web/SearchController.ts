'use strict';

import { FormFieldError } from '../../interfaces/guidedSearch.interface';
import { ISearchFieldsObject } from '../../interfaces/queryBuilder.interface';
import { ISearchResults } from '../../interfaces/searchResponse.interface';
import { ISharedData } from '../../interfaces/sharedData.interface';
import Joi from 'joi';
import { IDateSearchPayload, IQuickSearchPayload } from '../../interfaces/searchPayload.interface';
import { Request, ResponseObject, ResponseToolkit } from '@hapi/hapi';

import { generateDateString } from '../../utils/generateDateString';
import { getSearchResults } from '../../services/handlers/searchApi';
import { transformErrors } from '../../utils/transformErrors';
import { formKeys, sharedDataStructure, webRoutePaths } from '../../utils/constants';
import { fromDate, toDate } from '../../data/dateQuestionnaireFieldOptions';

const SearchController = {
  doQuickSearchHandler: async (request: Request, response: ResponseToolkit): Promise<ResponseObject> => {
    const { search_term }: IQuickSearchPayload = request.payload as IQuickSearchPayload;
    const searchFieldsObject: ISearchFieldsObject = {
      searchTerm: search_term,
    };
    const searchResults: ISearchResults = await getSearchResults(searchFieldsObject);
    request.server.updateSharedData(sharedDataStructure.searchTerm, search_term);
    request.server.updateSharedData(sharedDataStructure.searchResults, searchResults);
    return response.redirect(webRoutePaths.results);
  },
  renderSearchResultsHandler: async (request: Request, response: ResponseToolkit): Promise<ResponseObject> => {
    const sharedData: ISharedData = request.server.getSharedData();
    const searchTerm = sharedData[sharedDataStructure.searchTerm];
    const searchResults = sharedData[sharedDataStructure.searchResults];
    const quickSearchPath = webRoutePaths.quickSearch;
    return response.view('screens/results/template', {
      searchTerm,
      quickSearchPath,
      searchResults,
    });
  },
  renderGuidedSearchHandler: async (request: Request, response: ResponseToolkit): Promise<ResponseObject> => {
    const guidedDateSearchPath = webRoutePaths.guidedDateSearch;
    return response.view('screens/guided_search/date_questionnaire', {
      fromDate,
      toDate,
      guidedDateSearchPath,
    });
  },
  doDateSearchHandler: async (request: Request, response: ResponseToolkit): Promise<ResponseObject> => {
    const dateSearchPayload: IDateSearchPayload = request.payload as IDateSearchPayload;

    const startDate = generateDateString({
      year: dateSearchPayload['from-date-year'],
      month: dateSearchPayload['from-date-month'],
      day: dateSearchPayload['from-date-day'],
    });
    const endDate = generateDateString({
      year: dateSearchPayload['to-date-year'],
      month: dateSearchPayload['to-date-month'],
      day: dateSearchPayload['to-date-day'],
    });
    const searchFieldsObject: ISearchFieldsObject = {
      startDate,
      endDate,
    };
    const searchResults: ISearchResults = await getSearchResults(searchFieldsObject);
    request.server.purgeSharedData(sharedDataStructure.searchTerm);
    request.server.updateSharedData(sharedDataStructure.searchResults, searchResults);
    return response.redirect(webRoutePaths.results);
  },
  doDateSearchFailActionHandler: async (
    request: Request,
    response: ResponseToolkit,
    error: Joi.ValidationError,
  ): Promise<ResponseObject> => {
    const guidedDateSearchPath = webRoutePaths.guidedDateSearch;
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
    return response
      .view('screens/guided_search/date_questionnaire', {
        fromDate: fromField,
        toDate: toField,
        guidedDateSearchPath,
      })
      .code(400)
      .takeover();
  },
};

export { SearchController };
