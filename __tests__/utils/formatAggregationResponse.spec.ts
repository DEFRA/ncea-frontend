import { IAggregationOptions } from '../../src/interfaces/searchResponse.interface';
import { IFilterOptions } from '../../src/interfaces/searchPayload.interface';
import {
  formatAggregationResponse,
  capitalizeWords,
  addSpaces,
  generateRange,
  formatClassifierResponse,
} from '../../src/utils/formatAggregationResponse';
import {
  defaultFilterOptions,
  startYearRangeKey,
  toYearRangeKey,
  uniqueResourceTypesKey,
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
      [startYearRangeKey]: [],
      [toYearRangeKey]: [],
      [uniqueResourceTypesKey]: [],
    };
    const result = await formatAggregationResponse(apiResponse, filterOptions);
    expect(result).toEqual(filterOptionsResponse);
  });

  it('should merge nonGeographicDataset and publication buckets when both are present', async () => {
    const apiResponse = {
      aggregations: {
        someKey: {
          buckets: [
            { key: 'nonGeographicDataset', doc_count: 5 },
            { key: 'publication', doc_count: 10 },
          ],
        },
      },
    };
  const filterOptions = [{ key: 'someKey', isTerm: true, propertyToRead: 'key', needCount: true }];
    const result = await formatAggregationResponse(apiResponse, filterOptions);
    expect(result.someKey).toEqual([{ value: 'nonGeographicDataset', text: 'Non Geographic Dataset (15)' }]);
  });

  it('should rename the publication bucket to nonGeographicDataset when only publication is present', async () => {
    const apiResponse = {
      aggregations: {
        someKey: {
          buckets: [{ key: 'publication', doc_count: 10 }],
        },
      },
    };
    const filterOptions = [{ key: 'someKey', isTerm: true, propertyToRead: 'key', needCount: true }];
    const result = await formatAggregationResponse(apiResponse, filterOptions);
    expect(result.someKey).toEqual([{ value: 'nonGeographicDataset', text: 'Non Geographic Dataset (10)' }]);
  });

  it('should not modify buckets if neither nonGeographicDataset nor publication are present', async () => {
    const apiResponse = {
      aggregations: {
        someKey: {
          buckets: [{ key: 'otherDataset', doc_count: 10 }],
        },
      },
    };
    const filterOptions = [{ key: 'someKey', isTerm: true, propertyToRead: 'key', needCount: true }];
    const result = await formatAggregationResponse(apiResponse, filterOptions);
    expect(result.someKey).toEqual([{ value: 'otherDataset', text: 'Other Dataset (10)' }]);
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
        needCount: true,
        propertyToRead: 'key',
        hasBucket: true,
        isTerm: true,
      },
      {
        key: 'brand',
        order: 'asc',
        needCount: false,
        propertyToRead: 'key_as_string',
        hasBucket: true,
        isTerm: true,
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

  it('should return year range for date filter option', async () => {
    const apiResponse = {
      aggregations: {
        min_year: {
          value_as_string: '2022-01-01',
        },
        max_year: {
          value_as_string: '2023-01-01',
        },
      },
    };

    const filterOptions: IFilterOptions = [
      {
        key: 'year',
        needCount: false,
        propertyToRead: 'value_as_string',
        hasBucket: false,
        isDate: true,
      },
    ];

    const result = await formatAggregationResponse(apiResponse, filterOptions);

    const expectedResponse: IAggregationOptions = {
      [startYearRangeKey]: [
        { value: '2022', text: '2022' },
        { value: '2023', text: '2023' },
      ],
      [toYearRangeKey]: [
        { value: '2022', text: '2022' },
        { value: '2023', text: '2023' },
      ],
    };

    expect(result).toEqual(expectedResponse);
  });

  it('should return empty year range for date filter option when it is null', async () => {
    const apiResponse = {
      aggregations: {
        max_year: {
          value: null,
        },
        min_year: {
          value_as_string: '2023-01-01',
        },
      },
    };

    const filterOptions: IFilterOptions = [
      {
        key: 'year',
        needCount: false,
        propertyToRead: 'value_as_string',
        hasBucket: false,
        isDate: true,
      },
    ];

    const result = await formatAggregationResponse(apiResponse, filterOptions);

    const expectedResponse: IAggregationOptions = {
      [startYearRangeKey]: [],
      [toYearRangeKey]: [],
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
      {
        key: 'category',
        needCount: true,
        propertyToRead: 'key',
        hasBucket: true,
        isTerm: true,
      },
    ];

    const result = await formatAggregationResponse(apiResponse, filterOptions);

    const expectedResponse: IAggregationOptions = {
      [startYearRangeKey]: [],
      [toYearRangeKey]: [],
      [uniqueResourceTypesKey]: [],
    };

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
        hasBucket: true,
        isTerm: true,
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

describe('addSpaces', () => {
  it('should add spaces before capital letters in a string', () => {
    const result = addSpaces('HelloWorld');
    expect(result).toEqual('Hello World');
  });

  it('should handle empty string', () => {
    const result = addSpaces('');
    expect(result).toEqual('');
  });

  it('should handle string without capital letters', () => {
    const result = addSpaces('helloworld');
    expect(result).toEqual('helloworld');
  });

  it('should handle string with multiple capital letters', () => {
    const result = addSpaces('ThisIsATest');
    expect(result).toEqual('This Is A Test');
  });
});

describe('generateRange', () => {
  it('should generate a range with the same start and end year', () => {
    const result = generateRange(2023, 2023);
    expect(result).toEqual([{ value: '2023', text: '2023' }]);
  });

  it('should generate a range with different start and end years', () => {
    const result = generateRange(2022, 2023);
    expect(result).toEqual([
      { value: '2022', text: '2022' },
      { value: '2023', text: '2023' },
    ]);
  });
});

describe('formatClassifierResponse', () => {
  it('should return classifier values', async () => {
    const apiResponse = {
      classifier_level: {
        classifier_values: {
          buckets: [
            { key: 'value1' },
            { key: 'value2' },
          ],
        },
      },
    };

    const result = await formatClassifierResponse(apiResponse);
    expect(result).toEqual(['value1', 'value2']);
  });

  it('should return empty array if no classifier values', async () => {
    const apiResponse = {
      classifier_level: {
        classifier_values: {
          buckets: [],
        },
      },
    };

    const result = await formatClassifierResponse(apiResponse);
    expect(result).toEqual([]);
  });

  it('should return empty array if no classifier level', async () => {
    const apiResponse = {};

    const result = await formatClassifierResponse(apiResponse);
    expect(result).toEqual([]);
  });

});

describe('Error handling in formatClassifierResponse', () => {
  it('should throw an error with the correct message when an error occurs', async () => {
    // Mock data
    const apiResponse = {
      classifier_level: {
        classifier_values: {
          buckets: [{ key: 'someKey' }],
        },
      },
    };

    // Mock a function to throw an error
    jest.spyOn(Array.prototype, 'forEach').mockImplementationOnce(() => {
      throw new Error('Mock error');
    });

    try {
      await formatClassifierResponse(apiResponse);
    } catch (error) {
      expect(error).toEqual(new Error('Error formatting the aggregation: Mock error'));
    }
  });
});
