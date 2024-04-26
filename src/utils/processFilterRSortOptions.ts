import { RequestQuery } from '@hapi/hapi';
import { readQueryParams } from './queryStringHelper';
import { IAggregationOption, IAggregationOptions } from '../interfaces/searchResponse.interface';
import { queryParamKeys, uniqueResourceTypesKey, uniqueStartYearKey, uniqueToYearKey } from './constants';

const processFilterOptions = async (
  filterOptions: IAggregationOptions,
  requestQuery: RequestQuery,
): Promise<IAggregationOptions> => {
  const { startYear, toYear, resourceType } = queryParamKeys;
  const startYearValue = readQueryParams(requestQuery, startYear);
  const toYearValue = readQueryParams(requestQuery, toYear);
  const resourceTypeValue = readQueryParams(requestQuery, resourceType).split(',');
  const startYearOptions: IAggregationOption[] = filterOptions[uniqueStartYearKey] ?? [];
  const toYearOptions: IAggregationOption[] = filterOptions[uniqueToYearKey] ?? [];
  const resourceTypeOptions: IAggregationOption[] = filterOptions[uniqueResourceTypesKey] ?? [];
  startYearOptions.forEach((option: IAggregationOption) => {
    if (option.value === startYearValue) option.selected = true;
  });
  toYearOptions.forEach((option: IAggregationOption) => {
    if (option.value === toYearValue) option.selected = true;
  });
  if (!toYearValue) {
    const toYearOptionsLastItem: IAggregationOption =
      toYearOptions[toYearOptions.length - 1] ?? ({} as IAggregationOption);
    toYearOptionsLastItem.selected = true;
  }
  resourceTypeOptions.forEach((option: IAggregationOption) => {
    if (resourceTypeValue.includes(option.value)) option.checked = true;
  });
  return {
    [uniqueResourceTypesKey]: [...resourceTypeOptions],
    [uniqueStartYearKey]: [...startYearOptions],
    [uniqueToYearKey]: [...toYearOptions],
  };
};

const processSortOptions = async (requestQuery: RequestQuery): Promise<IAggregationOptions> => {
  const { sort, rowsPerPage } = queryParamKeys;
  const sortValue = readQueryParams(requestQuery, sort);
  const rowsPerPageValue = readQueryParams(requestQuery, rowsPerPage);
  const sortValueOptions: IAggregationOption[] = [
    {
      value: 'best_match',
      text: 'Best Fit',
      selected: true,
    },
    {
      value: 'recent_study',
      text: 'Most Recent',
      selected: false,
    },
  ];
  const rowsPerPageOptions: IAggregationOption[] = [
    {
      value: '20',
      text: '20',
      selected: true,
    },
    {
      value: '50',
      text: '50',
      selected: false,
    },
    {
      value: '100',
      text: '100',
      selected: false,
    },
  ];
  sortValueOptions.forEach((option: IAggregationOption) => {
    option.selected = false;
    if (option.value === sortValue) option.selected = true;
  });
  rowsPerPageOptions.forEach((option: IAggregationOption) => {
    option.selected = false;
    if (option.value === rowsPerPageValue) option.selected = true;
  });
  return {
    sortOptions: [...sortValueOptions],
    rowsPerPageOptions: [...rowsPerPageOptions],
  };
};

export { processFilterOptions, processSortOptions };
