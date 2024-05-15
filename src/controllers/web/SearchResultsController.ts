'use strict';

import { FormattedTabOptions } from '../../interfaces/detailsTab.interface';
import { ISearchPayload } from '../../interfaces/queryBuilder.interface';
import Joi from 'joi';
import { IAggregationOptions, ISearchItem, ISearchResults } from '../../interfaces/searchResponse.interface';
import { Lifecycle, Request, ResponseObject, ResponseToolkit } from '@hapi/hapi';

import { getPaginationItems } from '../../utils/paginationBuilder';
import { processDetailsTabData } from '../../utils/processDetailsTabData';
import {
  formIds,
  mapResultMaxCount,
  pageTitles,
  queryParamKeys,
  requiredFieldsForMap,
  startYearRangeKey,
  toYearRangeKey,
  uniqueResourceTypesKey,
  webRoutePaths,
} from '../../utils/constants';
import { generateQueryBuilderPayload, readQueryParams, upsertQueryParams } from '../../utils/queryStringHelper';
import { getDocumentDetails, getFilterOptions, getSearchResults } from '../../services/handlers/searchApi';
import { processFilterOptions, processSortOptions } from '../../utils/processFilterRSortOptions';

const SearchResultsController = {
  renderSearchResultsHandler: async (request: Request, response: ResponseToolkit): Promise<ResponseObject> => {
    const { quickSearchFID } = formIds;
    const journey: string = readQueryParams(request.query, queryParamKeys.journey);
    const payload: ISearchPayload = generateQueryBuilderPayload(request.query);
    const { rowsPerPage, page } = payload;
    const isQuickSearchJourney = journey === 'qs';
    try {
      const searchResults: ISearchResults = await getSearchResults(payload);
      const studyPeriodFilterOptions: IAggregationOptions = await getFilterOptions(payload, { isStudyPeriod: true });
      const resourceTypeFilterOptions: IAggregationOptions = await getFilterOptions(payload, { isStudyPeriod: false });
      const filterOptions: IAggregationOptions = {
        [uniqueResourceTypesKey]: resourceTypeFilterOptions[uniqueResourceTypesKey] ?? [],
        [startYearRangeKey]: studyPeriodFilterOptions[startYearRangeKey] ?? [],
        [toYearRangeKey]: studyPeriodFilterOptions[toYearRangeKey] ?? [],
      };
      const paginationItems = getPaginationItems(page, searchResults?.total ?? 0, rowsPerPage, request.query);
      const queryString = readQueryParams(request.query);
      const filterResourceTypePath = `${webRoutePaths.filterResourceType}?${queryString}`;
      const filterStudyPeriodPath = `${webRoutePaths.filterStudyPeriod}?${queryString}`;
      const sortSubmitPath = `${webRoutePaths.sortResults}?${queryString}`;
      const processedFilterOptions = await processFilterOptions(filterOptions, request.query);
      const processedSortOptions = await processSortOptions(request.query);
      return response.view('screens/results/template', {
        pageTitle: pageTitles.results,
        quickSearchFID,
        searchResults,
        hasError: false,
        isQuickSearchJourney,
        paginationItems,
        filterOptions: processedFilterOptions,
        sortOptions: processedSortOptions,
        filterResourceTypePath,
        filterStudyPeriodPath,
        sortSubmitPath,
        dateSearchPath: webRoutePaths.guidedDateSearch,
        filterInstance: 'search_results',
        queryString,
      });
    } catch (error) {
      return response.view('screens/results/template', {
        quickSearchFID,
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
    const { quickSearchFID } = formIds;
    const searchError: string | undefined = error?.details?.[0]?.message ?? undefined;
    const payload = request.payload as Record<string, string>;
    const searchInputError = searchError
      ? {
          text: searchError,
        }
      : (undefined as unknown as Joi.ValidationError);
    const context = {
      pageTitle: payload?.pageName === 'home' ? pageTitles.home : pageTitles.results,
      quickSearchFID,
      searchInputError,
    };
    const view: string = payload?.pageName === 'home' ? 'screens/home/template' : 'screens/results/template';
    return response.view(view, context).code(400).takeover();
  },
  getMapResultsHandler: async (request: Request, response: ResponseToolkit): Promise<ResponseObject> => {
    const payload: ISearchPayload = generateQueryBuilderPayload(request.query);
    try {
      const mapPayload: ISearchPayload = {
        ...payload,
        rowsPerPage: mapResultMaxCount,
        fieldsExist: ['geom'],
        requiredFields: requiredFieldsForMap,
      };
      const searchMapResults: ISearchResults = await getSearchResults(mapPayload, true);
      return response.response(searchMapResults).header('Content-Type', 'application/json');
    } catch (error) {
      return response.response({ error: 'An error occurred while processing your request' }).code(500);
    }
  },
  getMapFiltersHandler: async (request: Request, response: ResponseToolkit): Promise<ResponseObject> => {
    const filterPayload: ISearchPayload = generateQueryBuilderPayload(request.query);
    try {
      const mapPayload: ISearchPayload = {
        ...filterPayload,
        rowsPerPage: mapResultMaxCount,
        fieldsExist: ['geom'],
        requiredFields: requiredFieldsForMap,
      };
      const studyPeriodFilterOptions: IAggregationOptions = await getFilterOptions(mapPayload, { isStudyPeriod: true });
      const resourceTypeFilterOptions: IAggregationOptions = await getFilterOptions(mapPayload, {
        isStudyPeriod: false,
      });
      const filterOptions: IAggregationOptions = {
        [uniqueResourceTypesKey]: resourceTypeFilterOptions[uniqueResourceTypesKey] ?? [],
        [startYearRangeKey]: studyPeriodFilterOptions[startYearRangeKey] ?? [],
        [toYearRangeKey]: studyPeriodFilterOptions[toYearRangeKey] ?? [],
      };
      const processedFilterOptions = await processFilterOptions(filterOptions, request.query);
      return response.view('partials/results/filters', {
        filterOptions: processedFilterOptions,
        filterInstance: 'map_results',
        filterResourceTypePath: '',
        filterStudyPeriodPath: '',
      });
    } catch (error) {
      return response.view('partials/results/filters', {
        error,
        filterOptions: undefined,
        filterResourceTypePath: '',
        filterStudyPeriodPath: '',
      });
    }
  },
  renderSearchDetailsHandler: async (request: Request, response: ResponseToolkit): Promise<ResponseObject> => {
    try {
      const docId = request.params.id;
      const docDetails: ISearchItem = await getDocumentDetails(docId);
      const queryString: string = readQueryParams(request.query);
      const detailsTabOptions: FormattedTabOptions = await processDetailsTabData(docDetails);
      return response.view('screens/details/template', {
        pageTitle: pageTitles.generalTab,
        docDetails,
        detailsTabOptions,
        queryString,
        pageTitles,
      });
    } catch (error) {
      return response.view('screens/details/template', {
        error,
        docDetails: undefined,
      });
    }
  },
  filterResourceTypeHandler: async (request: Request, response: ResponseToolkit): Promise<ResponseObject> => {
    const payload = request.payload as Record<string, string>;
    let resourceTypeValues = '';
    if (payload?.['resource_type'] && Array.isArray(payload?.['resource_type'])) {
      resourceTypeValues = payload['resource_type'].join(',');
    } else if (payload?.['resource_type'] && typeof payload?.['resource_type'] === 'string') {
      resourceTypeValues = payload?.['resource_type'];
    }
    const queryParamsObject: Record<string, string> = {
      [queryParamKeys.resourceType]: resourceTypeValues,
      [queryParamKeys.page]: '1',
    };
    const queryString: string = upsertQueryParams(request.query, queryParamsObject, false);
    return response.redirect(`${webRoutePaths.results}?${queryString}`);
  },
  filterStudyPeriodHandler: async (request: Request, response: ResponseToolkit): Promise<ResponseObject> => {
    const payload = request.payload as Record<string, string>;
    const queryParamsObject: Record<string, string> = {
      [queryParamKeys.startYear]: payload?.['start_year'] ?? '',
      [queryParamKeys.toYear]: payload?.['to_year'] ?? '',
      [queryParamKeys.page]: '1',
    };
    const queryString: string = upsertQueryParams(request.query, queryParamsObject, false);
    return response.redirect(`${webRoutePaths.results}?${queryString}`);
  },
  sortSearchHandler: async (request: Request, response: ResponseToolkit): Promise<ResponseObject> => {
    const payload = request.payload as Record<string, string>;
    const queryParamsObject: Record<string, string> = {
      [queryParamKeys.sort]: payload?.['sort'] ?? '',
      [queryParamKeys.rowsPerPage]: payload?.['page-results'] ?? '',
      [queryParamKeys.page]: '1',
    };
    const queryString: string = upsertQueryParams(request.query, queryParamsObject, false);
    return response.redirect(`${webRoutePaths.results}?${queryString}`);
  },
};

export { SearchResultsController };
