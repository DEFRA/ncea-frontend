import { RequestQuery } from '@hapi/hapi';
import {
  processFilterOptions,
  processSortOptions,
} from '../../src/utils/processFilterRSortOptions';
import { IAggregationOptions } from '../../src/interfaces/searchResponse.interface';
import {
  queryParamKeys,
  uniqueResourceTypesKey,
  uniqueOriginatorTypesKey,
  startYearRangeKey,
  toYearRangeKey,
} from '../../src/utils/constants';

describe('processFilterRSortOptions', () => {
  describe('processFilterOptions', () => {
    test('should correctly process originatorTypeOptions with no matching values', async () => {
      const filterOptions: IAggregationOptions = {
        [uniqueOriginatorTypesKey]: [
          { value: 'type1', text: 'Type 1', checked: false },
          { value: 'type2', text: 'Type 2', checked: false },
        ],
      };
      const requestQuery: RequestQuery = {
        [queryParamKeys.originatorType]: 'type3',
      };

      const result = await processFilterOptions(filterOptions, requestQuery);

      expect(result?.[uniqueOriginatorTypesKey]?.[0]?.checked ?? '').toBe(false);
      expect(result?.[uniqueOriginatorTypesKey]?.[1]?.checked ?? '').toBe(false);
    });

    test('should correctly process originatorTypeOptions with some matching values', async () => {
      const filterOptions: IAggregationOptions = {
        [uniqueOriginatorTypesKey]: [
          { value: 'type1', text: 'Type 1', checked: false },
          { value: 'type2', text: 'Type 2', checked: false },
        ],
      };
      const requestQuery: RequestQuery = {
        [queryParamKeys.originatorType]: 'type1',
      };

      const result = await processFilterOptions(filterOptions, requestQuery);

      expect(result?.[uniqueOriginatorTypesKey]?.[0]?.checked ?? '').toBe(true);
      expect(result?.[uniqueOriginatorTypesKey]?.[1]?.checked ?? '').toBe(false);
    });

    test('should correctly process originatorTypeOptions when options array is empty', async () => {
      const filterOptions: IAggregationOptions = {
        [uniqueOriginatorTypesKey]: [],
      };
      const requestQuery: RequestQuery = {
        [queryParamKeys.originatorType]: 'type1',
      };

      const result = await processFilterOptions(filterOptions, requestQuery);

      expect(result?.[uniqueOriginatorTypesKey]?.length).toBe(0);
    });
    test('should return default aggregation options when no query params provided', async () => {
      const filterOptions: IAggregationOptions = {
        [startYearRangeKey]: [],
        [toYearRangeKey]: [],
        [uniqueResourceTypesKey]: [],
        [uniqueOriginatorTypesKey]:[],
      };
      const requestQuery: RequestQuery = {};

      const result = await processFilterOptions(filterOptions, requestQuery);

      expect(result).toEqual(filterOptions);
    });

    test('should correctly process query params and update aggregation options', async () => {
      const filterOptions: IAggregationOptions = {
        [startYearRangeKey]: [{ value: '2020', text: '2020', selected: true }],
        [toYearRangeKey]: [{ value: '2022', text: '2022', selected: true }],
        [uniqueResourceTypesKey]: [
          { value: 'type1', text: 'type1', checked: true },
        ],
      };
      const requestQuery: RequestQuery = {
        [queryParamKeys.startYear]: '2020',
        [queryParamKeys.toYear]: '2022',
        [queryParamKeys.resourceType]: 'type1,type2',
      };

      const result = await processFilterOptions(filterOptions, requestQuery);

      expect(result?.[startYearRangeKey]?.[0]?.selected ?? '').toBe(true);
      expect(result?.[toYearRangeKey]?.[0]?.selected ?? '').toBe(true);
      expect(result?.[uniqueResourceTypesKey]?.[0]?.checked ?? '').toBe(true);
    });
  });

  describe('processSortOptions', () => {
    test('should return default sort and rowsPerPage options when no query params provided', async () => {
      const requestQuery: RequestQuery = {};

      const result = await processSortOptions(requestQuery);

      expect(result?.sortOptions?.[0]?.selected ?? '').toBe(false);
      expect(result?.rowsPerPageOptions?.[0]?.selected ?? '').toBe(false);
    });

    test('should correctly process query params and update sort and rowsPerPage options', async () => {
      const requestQuery: RequestQuery = {
        [queryParamKeys.sort]: 'oldest_study_period',
        [queryParamKeys.rowsPerPage]: '50',
      };

      const result = await processSortOptions(requestQuery);

      expect(result?.sortOptions?.[0]?.selected ?? '').toBe(false);
      expect(result?.sortOptions?.[1]?.selected ?? '').toBe(true);
      expect(result?.rowsPerPageOptions?.[0]?.selected ?? '').toBe(false);
      expect(result?.rowsPerPageOptions?.[1]?.selected ?? '').toBe(true);
    });
  });
});
