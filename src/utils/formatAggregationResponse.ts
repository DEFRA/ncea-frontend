import { IAggregationOptions } from '../interfaces/searchResponse.interface';
import { IFilterOption, IFilterOptions } from '../interfaces/searchPayload.interface';

const capitalizeWords = (string: string): string => {
  return string.replace(/\b\w/g, (match) => match.toUpperCase());
};

/* eslint-disable  @typescript-eslint/no-explicit-any */
const formatAggregationResponse = async (
  apiResponse: Record<string, any>,
  filterOptions: IFilterOptions,
): Promise<IAggregationOptions> => {
  try {
    const finalResponse: IAggregationOptions = {};
    filterOptions.forEach((filterOption: IFilterOption) => {
      const apiAggValues = apiResponse?.aggregations?.[filterOption.key];
      if (apiAggValues && Array.isArray(apiAggValues.buckets) && apiAggValues?.buckets.length > 0) {
        finalResponse[filterOption.key] = apiAggValues?.buckets.map((bucket) => ({
          value: bucket[filterOption.propertyToRead],
          text: `${capitalizeWords(bucket[filterOption.propertyToRead])}${filterOption.needCount ? ` (${bucket['doc_count']})` : ''}`,
        }));
      } else {
        finalResponse[filterOption.key] = [];
      }
    });
    return finalResponse;
  } catch (error: any) {
    throw new Error(`Error formatting the aggregation: ${error.message}`);
  }
};

export { capitalizeWords, formatAggregationResponse };
