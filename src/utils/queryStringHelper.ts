import { RequestQuery } from '@hapi/hapi';
import { ISearchFields, ISearchPayload } from '../interfaces/queryBuilder.interface';
import { queryParamKeys, resourceTypeFilterField, studyPeriodFilterField } from './constants';

const setDefaultQueryParams = (searchParams: URLSearchParams): URLSearchParams => {
  const page = searchParams.get(queryParamKeys.page) ?? '1';
  searchParams.set(queryParamKeys.page, page);
  const rowsPerPage = searchParams.get(queryParamKeys.rowsPerPage) ?? '20';
  searchParams.set(queryParamKeys.rowsPerPage, rowsPerPage);
  const sort = searchParams.get(queryParamKeys.sort) ?? 'best_match';
  searchParams.set(queryParamKeys.sort, sort);
  return searchParams;
};

const getQueryStringParams = (requestQuery: RequestQuery): URLSearchParams => {
  const searchParams: URLSearchParams = new URLSearchParams(requestQuery ?? '');

  return searchParams;
};

const upsertQueryParams = (
  requestQuery: RequestQuery,
  queryParamsObject: Record<string, string>,
  includeDefaultParams: boolean = true,
): string => {
  let searchParams: URLSearchParams = getQueryStringParams(requestQuery);
  if (Object.keys(queryParamsObject).length) {
    Object.keys(queryParamsObject).forEach((key: string) => {
      const value: string = queryParamsObject[key] ?? '';
      if (value) {
        searchParams.set(key, value);
      }
      if (!value && searchParams.has(key)) {
        searchParams.delete(key);
      }
    });
  }
  if (includeDefaultParams) {
    searchParams = setDefaultQueryParams(searchParams);
  }

  return searchParams.toString();
};

const readQueryParams = (
  requestQuery: RequestQuery,
  key: string = '',
  includeDefaultParams: boolean = false,
): string => {
  const searchParams: URLSearchParams = getQueryStringParams(requestQuery);
  if (key) {
    return searchParams.get(key) ?? '';
  }
  if (includeDefaultParams) {
    return setDefaultQueryParams(searchParams).toString();
  }
  return searchParams.toString();
};

const getDateParams = (searchParams: URLSearchParams): Record<string, string> => {
  const fdd: string = searchParams.get(queryParamKeys.fromDateDay) ?? '';
  const fdm: string = searchParams.get(queryParamKeys.fromDateMonth) ?? '';
  const fdy: string = searchParams.get(queryParamKeys.fromDateYear) ?? '';
  const tdd: string = searchParams.get(queryParamKeys.toDateDay) ?? '';
  const tdm: string = searchParams.get(queryParamKeys.toDateMonth) ?? '';
  const tdy: string = searchParams.get(queryParamKeys.toDateYear) ?? '';
  return {
    fdd,
    fdm,
    fdy,
    tdy,
    tdm,
    tdd,
  };
};

const getExtentParams = (searchParams: URLSearchParams): Record<string, string> => {
  const nth: string = searchParams.get(queryParamKeys.north) ?? '';
  const sth: string = searchParams.get(queryParamKeys.south) ?? '';
  const est: string = searchParams.get(queryParamKeys.east) ?? '';
  const wst: string = searchParams.get(queryParamKeys.west) ?? '';
  return {
    nth,
    sth,
    est,
    wst,
  };
};

const getFilterParams = (searchParams: URLSearchParams): Record<string, string> => {
  const resourceType = searchParams.get(queryParamKeys.resourceType) ?? '';
  const startDate = searchParams.get(queryParamKeys.startYear) ?? '';
  const endDate = searchParams.get(queryParamKeys.toYear) ?? '';
  return { resourceType, startDate, endDate };
};

const generateCountPayload = (requestQuery: RequestQuery): ISearchPayload => {
  return {
    fields: { ...generateQueryBuilderFields(requestQuery) },
    sort: '',
    rowsPerPage: 0,
    filters: {},
    page: null,
  };
};

const generateQueryBuilderFields = (requestQuery: RequestQuery): ISearchFields => {
  const searchParams: URLSearchParams = setDefaultQueryParams(getQueryStringParams(requestQuery));
  const keywordTerm: string = searchParams.get(queryParamKeys.quickSearch) ?? '';
  const dateParams: Record<string, string> = getDateParams(searchParams);
  const extentParams: Record<string, string> = getExtentParams(searchParams);
  return {
    ...(keywordTerm && { keyword: { q: keywordTerm } }),
    ...(dateParams.fdy && dateParams.tdy && { date: dateParams }),
    ...(extentParams.nth &&
      extentParams.sth &&
      extentParams.est &&
      extentParams.wst && {
        extent: extentParams,
      }),
  };
};

const generateQueryBuilderPayload = (requestQuery: RequestQuery): ISearchPayload => {
  const searchParams: URLSearchParams = setDefaultQueryParams(getQueryStringParams(requestQuery));
  const filterParams: Record<string, string> = getFilterParams(searchParams);
  const searchPayload: ISearchPayload = {
    fields: { ...generateQueryBuilderFields(requestQuery) },
    sort: searchParams.get(queryParamKeys.sort) ?? '',
    page: parseInt(searchParams.get(queryParamKeys.page) ?? '1'),
    rowsPerPage: parseInt(searchParams.get(queryParamKeys.rowsPerPage) ?? '20'),
    filters: {
      ...(filterParams.resourceType && {
        [resourceTypeFilterField]: filterParams.resourceType.split(','),
      }),
      ...((filterParams.startDate || filterParams.endDate) && {
        [studyPeriodFilterField]: {
          fdy: filterParams.startDate,
          tdy: filterParams.endDate,
        },
      }),
    },
  };
  return searchPayload;
};

export {
  getQueryStringParams,
  upsertQueryParams,
  readQueryParams,
  generateQueryBuilderPayload,
  generateCountPayload,
  getDateParams,
  getExtentParams,
  getFilterParams,
  generateQueryBuilderFields,
};
