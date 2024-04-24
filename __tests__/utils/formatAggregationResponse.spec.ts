import { IAggregationOptions } from '../../src/interfaces/searchResponse.interface';
import {
  IFilterOption,
  IFilterOptions,
} from '../../src/interfaces/searchPayload.interface';
import {
  formatAggregationResponse,
  capitalizeWords,
} from '../../src/utils/formatAggregationResponse';
import {
  defaultFilterOptions,
  uniqueResourceTypesKey,
  uniqueStartYearKey,
  uniqueToYearKey,
} from '../../src/utils/constants';

describe('formatAggregationResponse', () => {
  it('should return empty object when apiResponse is empty', async () => {
    const apiResponse = {
      hits: {
        total: {
          value: 0,
          relation: 'eq',
        },
        hits: [],
      },
    };
    const filterOptions: IFilterOptions = defaultFilterOptions;
    const filterOptionsResponse: IAggregationOptions = {
      [uniqueStartYearKey]: [],
      [uniqueToYearKey]: [],
      [uniqueResourceTypesKey]: [],
    };
    const result = await formatAggregationResponse(apiResponse, filterOptions);
    expect(result).toEqual(filterOptionsResponse);
  });

  it('should return formatted aggregation options for each filter option', async () => {
    const apiResponse = {
      aggregations: {
        category: {
          buckets: [
            { key: 'electronics', doc_count: 10 },
            { key: 'clothing', doc_count: 20 },
          ],
        },
        brand: {
          buckets: [
            { key_as_string: 'samsung', doc_count: 5 },
            { key_as_string: 'apple', doc_count: 15 },
          ],
        },
      },
    };

    const filterOptions: IFilterOptions = [
      {
        key: 'category',
        field: 'resourceType',
        needCount: true,
        propertyToRead: 'key',
      },
      {
        key: 'brand',
        field: 'resourceTemporalExtentDateRange',
        format: 'yyyy',
        calendarInterval: 'year',
        order: 'asc',
        needCount: false,
        propertyToRead: 'key_as_string',
      },
    ];

    const result = await formatAggregationResponse(apiResponse, filterOptions);

    const expectedResponse: IAggregationOptions = {
      category: [
        { value: 'electronics', text: 'Electronics (10)' },
        { value: 'clothing', text: 'Clothing (20)' },
      ],
      brand: [
        { value: 'samsung', text: 'Samsung' },
        { value: 'apple', text: 'Apple' },
      ],
    };

    expect(result).toEqual(expectedResponse);
  });

  it('should return empty array for filter options with no buckets', async () => {
    const apiResponse = {
      aggregations: {
        category: { buckets: [] },
      },
    };

    const filterOptions: IFilterOptions = [
      { key: 'category', propertyToRead: 'key', needCount: true, field: '' },
    ];

    const result = await formatAggregationResponse(apiResponse, filterOptions);

    const expectedResponse: IAggregationOptions = { category: [] };

    expect(result).toEqual(expectedResponse);
  });

  it('should throw an error if an error occurs during formatting', async () => {
    const apiResponse = {
      aggregations: { category: { buckets: [{ key: 'electronics' }] } },
    };
    const filterOptions: IFilterOptions = [
      {
        key: 'category',
        propertyToRead: 'invalidProperty',
        needCount: true,
        field: '',
      },
    ];

    await expect(
      formatAggregationResponse(apiResponse, filterOptions),
    ).rejects.toThrow();
  });
});

describe('capitalizeWords', () => {
  it('should capitalize the first letter of each word in a string', () => {
    const result = capitalizeWords('hello world');
    expect(result).toEqual('Hello World');
  });

  it('should handle empty string', () => {
    const result = capitalizeWords('');
    expect(result).toEqual('');
  });

  it('should handle single word', () => {
    const result = capitalizeWords('hello');
    expect(result).toEqual('Hello');
  });
});
