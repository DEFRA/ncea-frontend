import { getYear } from './formatDate';
import { IAggregationOption, IAggregationOptions } from '../interfaces/searchResponse.interface';
import { IFilterOption, IFilterOptions } from '../interfaces/searchPayload.interface';
import { startYearRangeKey, toYearRangeKey, uniqueResourceTypesKey } from './constants';

const capitalizeWords = (string: string): string => {
  return string.replace(/\b\w/g, (match) => match.toUpperCase());
};

const addSpaces = (string: string): string => string.split(/(?=[A-Z])/).join(' ');

type AggregationOption = {
  key: string;
};

type ClassifierValues = {
  buckets: AggregationOption[];
};

type ClassifierLevel = {
  classifier_values?: ClassifierValues;
};

type ApiResponse = {
  classifier_level?: ClassifierLevel;
};
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
        let nonGeoIndex = -1;
        let publicationIndex = -1;
        apiAggValues.buckets.forEach((bucket, index) => {
          if (bucket.key === 'nonGeographicDataset') nonGeoIndex = index;
          if (bucket.key === 'publication') publicationIndex = index;
        });

        if (nonGeoIndex !== -1 && publicationIndex !== -1) {
          apiAggValues.buckets[nonGeoIndex].doc_count += apiAggValues.buckets[publicationIndex].doc_count;
          apiAggValues.buckets.splice(publicationIndex, 1);
        } else if (nonGeoIndex === -1 && publicationIndex !== -1) {
          apiAggValues.buckets[publicationIndex].key = 'nonGeographicDataset';
        }
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

const formatClassifierResponse = async (apiResponse: ApiResponse): Promise<string[]> => {
  try {
    const finalResponse: string[] = [];
    const apiAggregationOptions = apiResponse?.classifier_level?.classifier_values?.buckets;

    if (apiAggregationOptions) {
      apiAggregationOptions.forEach((aggregationOption) => {
        finalResponse.push(aggregationOption.key);
      });
    }

    return finalResponse;
  } catch (error) {
    throw new Error(`Error formatting the aggregation: ${(error as Error).message}`);
  }
};

export { addSpaces, capitalizeWords, formatAggregationResponse, generateRange, formatClassifierResponse };
