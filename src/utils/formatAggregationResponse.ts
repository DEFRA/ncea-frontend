import { getYear } from './formatDate';
import { IAggregationOption, IAggregationOptions } from '../interfaces/searchResponse.interface';
import { IFilterOption, IFilterOptions } from '../interfaces/searchPayload.interface';
import { startYearRangeKey, toYearRangeKey, uniqueResourceTypesKey } from './constants';

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
        const maxYearDateString: string =
          apiResponse?.aggregations?.[`max_${filterOption.key}`]?.[filterOption.propertyToRead] ?? '';
        const minYearDateString: string =
          apiResponse?.aggregations?.[`min_${filterOption.key}`]?.[filterOption.propertyToRead] ?? '';
        if (maxYearDateString && minYearDateString) {
          const maxYearValue: string = getYear(maxYearDateString);
          const minYearValue: string = getYear(minYearDateString);
          const maxYear: number = Math.floor(parseInt(maxYearValue));
          const minYear: number = Math.floor(parseInt(minYearValue));
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
        finalResponse[uniqueResourceTypesKey] = [];
        finalResponse[startYearRangeKey] = [];
        finalResponse[toYearRangeKey] = [];
      }
    });
    return finalResponse;
  } catch (error: any) {
    throw new Error(`Error formatting the aggregation: ${error.message}`);
  }
};

export { addSpaces, capitalizeWords, formatAggregationResponse, generateRange };
