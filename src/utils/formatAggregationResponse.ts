import { IAggregationOption, IAggregationOptions } from '../interfaces/searchResponse.interface';
import { IFilterOption, IFilterOptions } from '../interfaces/searchPayload.interface';
import { startYearRangeKey, toYearRangeKey } from './constants';

const capitalizeWords = (string: string): string => {
  return string.replace(/\b\w/g, (match) => match.toUpperCase());
};

const addSpaces = (string: string): string => string.split(/(?=[A-Z])/).join(' ');

const generateRange = (start, end): IAggregationOption[] => {
  return Array.from({ length: end - start + 1 }, (_, index) => ({
    value: String(start + index),
    text: String(start + index),
  }));
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
      const { isTerm, isDate } = filterOption;
      if (isTerm && apiAggValues && Array.isArray(apiAggValues.buckets) && apiAggValues?.buckets.length > 0) {
        finalResponse[filterOption.key] = apiAggValues?.buckets.map((bucket) => {
          const wordsWithSpace = addSpaces(bucket[filterOption.propertyToRead]);
          let text: string = capitalizeWords(wordsWithSpace);
          if (filterOption.needCount) text += ` (${bucket['doc_count']})`;
          return {
            value: bucket[filterOption.propertyToRead],
            text,
          };
        });
      } else if (isDate) {
        const maxYearValue: number = apiResponse?.aggregations?.[`max-${filterOption.key}`]?.value ?? null;
        const minYearValue: number = apiResponse?.aggregations?.[`min-${filterOption.key}`]?.value ?? null;
        if (maxYearValue && minYearValue) {
          const maxYear: number = Math.floor(maxYearValue);
          const minYear: number = Math.floor(minYearValue);
          const yearRange: IAggregationOption[] = generateRange(minYear, maxYear);
          finalResponse[startYearRangeKey] = yearRange.map((year) => ({
            ...year,
          }));
          finalResponse[toYearRangeKey] = yearRange.map((year) => ({
            ...year,
          }));
        } else {
          finalResponse[startYearRangeKey] = [];
          finalResponse[toYearRangeKey] = [];
        }
      } else {
        finalResponse[filterOption.key] = [];
      }
    });
    return finalResponse;
  } catch (error: any) {
    throw new Error(`Error formatting the aggregation: ${error.message}`);
  }
};

const formatClassifierResponse = async (apiResponse: Record<string, any>): Promise<string[]> => {
  try {
    const finalResponse: string[] = [];
    const apiAggregationOptions = apiResponse?.classifier_level?.classifier_values?.buckets;

    /* eslint-disable  @typescript-eslint/no-explicit-any */
    apiAggregationOptions.forEach((aggregationOption: Record<string, any>) => {
      finalResponse.push(aggregationOption.key);
    });

    return finalResponse;
  } catch (error: any) {
    throw new Error(`Error formatting the aggregation: ${error.message}`);
  }
};

export { capitalizeWords, formatAggregationResponse, formatClassifierResponse };
