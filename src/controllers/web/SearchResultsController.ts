'use strict';

import { FormattedTabOptions } from '../../interfaces/detailsTab.interface';
import { ISearchPayload } from '../../interfaces/queryBuilder.interface';
import Joi from 'joi';
import { IAggregationOptions, ISearchItem, ISearchResults } from '../../interfaces/searchResponse.interface';
import { Lifecycle, Request, ResponseObject, ResponseToolkit } from '@hapi/hapi';

import { getPaginationItems } from '../../utils/paginationBuilder';
import { processDetailsTabData } from '../../utils/processDetailsTabData';
import { formIds, mapResultMaxCount, queryParamKeys, requiredFieldsForMap, webRoutePaths } from '../../utils/constants';
import {
  generateCountPayload,
  generateQueryBuilderPayload,
  readQueryParams,
  upsertQueryParams,
} from '../../utils/queryStringHelper';
import { getDocumentDetails, getResourceTypeOptions, getSearchResults } from '../../services/handlers/searchApi';

const SearchResultsController = {
  renderSearchResultsHandler: async (request: Request, response: ResponseToolkit): Promise<ResponseObject> => {
    const formId: string = formIds.quickSearch;
    const journey: string = readQueryParams(request.query, queryParamKeys.journey);
    const payload: ISearchPayload = generateQueryBuilderPayload(request.query);
    const mapPayload: ISearchPayload = {
      ...payload,
      rowsPerPage: mapResultMaxCount,
      fieldsExist: ['geom'],
      requiredFields: requiredFieldsForMap,
    };
    const resourceTypePayload: ISearchPayload = generateCountPayload(request.query);
    const { rowsPerPage, page } = payload;
    const isQuickSearchJourney = journey === 'qs';
    try {
      const searchResults: ISearchResults = await getSearchResults(payload);
      const searchMapResults: ISearchResults = await getSearchResults(mapPayload);
      const resourceTypeOptionsData: IAggregationOptions = await getResourceTypeOptions(resourceTypePayload);
      const paginationItems = getPaginationItems(page, searchResults?.total ?? 0, rowsPerPage);
      return response.view('screens/results/template', {
        formId,
        searchResults,
        hasError: false,
        isQuickSearchJourney,
        paginationItems,
        searchMapResults,
        resourceTypeOptions: resourceTypeOptionsData,
        dateSearchPath: webRoutePaths.guidedDateSearch,
      });
    } catch (error) {
      return response.view('screens/results/template', {
        formId,
        error,
        hasError: true,
        isQuickSearchJourney,
      });
    }
  },
  quickSearchSubmitHandler: async (request: Request, response: ResponseToolkit): Promise<ResponseObject> => {
    const { search_term } = request.payload as Record<string, string>;
    const queryParamsObject: Record<string, string> = {
      [queryParamKeys.quickSearch]: search_term ?? '',
      [queryParamKeys.journey]: 'qs',
    };
    const queryString: string = upsertQueryParams(request.query, queryParamsObject);
    return response.redirect(`${webRoutePaths.results}?${queryString}`);
  },
  quickSearchFailActionHandler: (request, response, error): Lifecycle.ReturnValue => {
    const formId: string = formIds.quickSearch;
    const searchError: string | undefined = error?.details?.[0]?.message ?? undefined;
    const payload = request.payload as Record<string, string>;
    const searchInputError = searchError
      ? {
          text: searchError,
        }
      : (undefined as unknown as Joi.ValidationError);
    const context = {
      formId,
      searchInputError,
    };
    const view: string = payload?.pageName === 'home' ? 'screens/home/template' : 'screens/results/template';
    return response.view(view, context).code(400).takeover();
  },
  renderSearchDetailsHandler: async (request: Request, response: ResponseToolkit): Promise<ResponseObject> => {
    try {
      const docId = request.params.id;
      const docDetails: ISearchItem = await getDocumentDetails(docId);
      const detailsTabOptions: FormattedTabOptions = await processDetailsTabData(docDetails);
      return response.view('screens/details/template', {
        docDetails,
        detailsTabOptions,
      });
    } catch (error) {
      return response.view('screens/details/template', {
        error,
        docDetails: undefined,
      });
    }
  },
};

export { SearchResultsController };
