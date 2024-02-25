import { resourceTypeOptions } from '../../src/utils/constants';
import {
  capitalizeWords,
  formatAggregationResponse,
} from '../../src/utils/formatAggregationResponse';

describe('Capitalize first word function', () => {
  it('should capitalizes the first letter of each word in a string', () => {
    expect(capitalizeWords('hello world')).toEqual('Hello World');
    expect(capitalizeWords('this is a test')).toEqual('This Is A Test');
    expect(capitalizeWords('')).toEqual('');
    expect(capitalizeWords('onlyone')).toEqual('Onlyone');
  });
});

describe('Format Aggregation Response function', () => {
  it('should formats the aggregation response correctly', async () => {
    const mockApiResponse = {
      aggregations: {
        unique_values: {
          buckets: [{ key: 'value1' }, { key: 'value2' }, { key: 'value3' }],
        },
      },
    };

    const expectedResponse = [
      ...resourceTypeOptions,
      { value: 'value1', text: 'Value1' },
      { value: 'value2', text: 'Value2' },
      { value: 'value3', text: 'Value3' },
    ];

    const formattedResponse = await formatAggregationResponse(mockApiResponse);
    expect(formattedResponse).toEqual(expectedResponse);
  });

  it('should handles empty buckets', async () => {
    const responseWithEmptyBuckets = await formatAggregationResponse({
      aggregations: {
        unique_values: {
          buckets: [],
        },
      },
    });
    expect(responseWithEmptyBuckets).toEqual(resourceTypeOptions);
  });

  it('should throw an error for invalid aggregation response', async () => {
    const apiResponse = {
      aggregations: {
        unique_values: {
          buckets: null,
        },
      },
    };

    await expect(formatAggregationResponse(apiResponse)).rejects.toThrow(
      'Error formatting the aggregation',
    );
  });
});
