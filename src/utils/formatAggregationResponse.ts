import { resourceTypeOptions } from './constants';
import { IAggregationOption, IAggregationOptions } from '../interfaces/searchResponse.interface';

const capitalizeWords = (string: string): string => {
  return string.replace(/\b\w/g, (character) => {
    return character.toUpperCase();
  });
};

/* eslint-disable  @typescript-eslint/no-explicit-any */
const formatAggregationResponse = async (apiResponse: Record<string, any>): Promise<IAggregationOptions> => {
  const finalResponse: IAggregationOptions = [...resourceTypeOptions];
  const apiAggregationOptions = apiResponse?.aggregations?.unique_values?.buckets;

  /* eslint-disable  @typescript-eslint/no-explicit-any */
  apiAggregationOptions.map((aggregationOption: Record<string, any>) => {
    const option: IAggregationOption = {
      value: aggregationOption.key,
      text: capitalizeWords(aggregationOption.key),
    };

    finalResponse.push(option);
  });

  return finalResponse;
};

export { capitalizeWords, formatAggregationResponse };
