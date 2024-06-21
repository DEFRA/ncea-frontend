import { RequestQuery } from '@hapi/hapi';
import {
  processFilterOptions,
  processSortOptions,
} from '../../src/utils/processFilterRSortOptions';
import { IAggregationOptions } from '../../src/interfaces/searchResponse.interface';
import {
  queryParamKeys,
  uniqueResourceTypesKey,
  startYearRangeKey,
  toYearRangeKey,
} from '../../src/utils/constants';

describe('processFilterRSortOptions', () => {
  describe('processFilterOptions', () => {
    test('should return default aggregation options when no query params provided', async () => {
      const filterOptions: IAggregationOptions = {
        [startYearRangeKey]: [],
        [toYearRangeKey]: [],
        [uniqueResourceTypesKey]: [],
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
