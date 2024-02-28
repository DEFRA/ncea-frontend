import { resourceTypeOptions } from './constants';
import { IAggregationOption, IAggregationOptions } from '../interfaces/searchResponse.interface';

const capitalizeWords = (string: string): string => {
  return string.replace(/\b\w/g, (character) => {
    return character.toUpperCase();
  });
};

/* eslint-disable  @typescript-eslint/no-explicit-any */
const formatAggregationResponse = async (apiResponse: Record<string, any>): Promise<IAggregationOptions> => {
  try {
    const finalResponse: IAggregationOptions = [...resourceTypeOptions];
    const apiAggregationOptions = apiResponse?.aggregations?.unique_values?.buckets;

    /* eslint-disable  @typescript-eslint/no-explicit-any */
    apiAggregationOptions.forEach((aggregationOption: Record<string, any>) => {
      const option: IAggregationOption = {
        value: aggregationOption.key,
        text: capitalizeWords(aggregationOption.key),
      };

      finalResponse.push(option);
    });

    return finalResponse;
  } catch (error: any) {
    throw new Error(`Error formatting the aggregation: ${error.message}`);
  }
};

export { capitalizeWords, formatAggregationResponse };
