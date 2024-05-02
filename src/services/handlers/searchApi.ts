import { IFilterOptions } from '@/src/interfaces/searchPayload.interface';
import { elasticSearchClient } from '../../config/elasticSearchClient';
import { formatSearchResponse } from '../../utils/formatSearchResponse';

import { ISearchBuilderPayload, ISearchPayload } from '../../interfaces/queryBuilder.interface';
import { buildSearchQuery, classifierAggregationQuery } from '../../utils/queryBuilder';
import { defaultFilterOptions, elasticSearchAPIPaths } from '../../utils/constants';
import { formatAggregationResponse, formatClassifierResponse } from '../../utils/formatAggregationResponse';

import { IAggregationOptions, ISearchItem, ISearchResults } from '../../interfaces/searchResponse.interface';

const getSearchResults = async (
  searchFieldsObject: ISearchPayload,
  isMapResults: boolean = false,
): Promise<ISearchResults> => {
  try {
    if (Object.keys(searchFieldsObject.fields).length) {
      const searchBuilderPayload: ISearchBuilderPayload = {
        searchFieldsObject,
        ignoreAggregation: true,
      };
      const payload = buildSearchQuery(searchBuilderPayload);
      const response = await elasticSearchClient.post(elasticSearchAPIPaths.searchPath, payload);
      const finalResponse: ISearchResults = await formatSearchResponse(response.data, false, isMapResults);
      return finalResponse;
    } else {
      return Promise.resolve({ total: 0, items: [] });
    }
    /* eslint-disable  @typescript-eslint/no-explicit-any */
  } catch (error: any) {
    throw new Error(`Error fetching results: ${error.message}`);
  }
};

const getSearchResultsCount = async (searchFieldsObject: ISearchPayload): Promise<{ totalResults: number }> => {
  try {
    const searchBuilderPayload: ISearchBuilderPayload = {
      searchFieldsObject,
      isCount: true,
      ignoreAggregation: true,
    };
    const payload = buildSearchQuery(searchBuilderPayload);
    if (payload.query.bool.must?.length) {
      const response = await elasticSearchClient.post(elasticSearchAPIPaths.countPath, payload);
      const data = await response.data;
      return { totalResults: data?.count ?? 0 };
    } else {
      return Promise.resolve({ totalResults: 0 });
    }
    /* eslint-disable  @typescript-eslint/no-explicit-any */
  } catch (error: any) {
    throw new Error(`Error fetching results: ${error.message}`);
  }
};

const getFilterOptions = async (
  searchFieldsObject: ISearchPayload,
  filterOptions: IFilterOptions = defaultFilterOptions,
): Promise<IAggregationOptions> => {
  try {
    if (Object.keys(searchFieldsObject.fields).length && filterOptions.length > 0) {
      const searchBuilderPayload: ISearchBuilderPayload = {
        searchFieldsObject,
        filterOptions,
      };
      const payload = buildSearchQuery(searchBuilderPayload);
      const response = await elasticSearchClient.post(elasticSearchAPIPaths.searchPath, payload);
      const finalResponse: IAggregationOptions = await formatAggregationResponse(response.data, filterOptions);
      return finalResponse;
    } else {
      const fallbackResolve: IAggregationOptions = filterOptions.reduce((acc, curr) => {
        acc[curr.key] = [];
        return acc;
      }, {});
      return Promise.resolve(fallbackResolve);
    }
  } catch (error: any) {
    throw new Error(`Error fetching results: ${error.message}`);
  }
};

const getDocumentDetails = async (docId: string): Promise<ISearchItem> => {
  try {
    const payload = buildSearchQuery({ docId });
    const response = await elasticSearchClient.post(elasticSearchAPIPaths.searchPath, payload);
    const responseData = response?.data;
    if (responseData?.hits?.total?.value) {
      const finalResponse: ISearchResults = await formatSearchResponse(responseData, true);
      return finalResponse?.items?.[0] as ISearchItem;
    } else {
      return Promise.resolve({} as ISearchItem);
    }
    /* eslint-disable  @typescript-eslint/no-explicit-any */
  } catch (error: any) {
    throw new Error(`Error fetching results: ${error.message}`);
  }
};

const getClassifierDetails = async (level: number, level1?: string[], level2?: string[]): Promise<string[]> => {
  try {
    const mustFilters: Record<string, string | string[]>[] = [];
    let uniqueField: string = '';
    switch (level) {
      case 3:
        uniqueField = 'OrgNceaClassifiers.classifiers.classifiers.classifierValue.keyword';
        mustFilters.push({
          'OrgNceaClassifiers.classifierType.keyword': 'Level 1',
        });
        mustFilters.push({
          'OrgNceaClassifiers.classifiers.classifierType.keyword': 'Level 2',
        });
        mustFilters.push({
          'OrgNceaClassifiers.classifierValue.keyword': level1 || [],
        });
        mustFilters.push({
          'OrgNceaClassifiers.classifiers.classifierValue.keyword': level2 || [],
        });
        break;
      case 2:
        uniqueField = 'OrgNceaClassifiers.classifiers.classifierValue.keyword';
        mustFilters.push({
          'OrgNceaClassifiers.classifierType.keyword': 'Level 1',
        });
        mustFilters.push({
          'OrgNceaClassifiers.classifiers.classifierType.keyword': 'Level 2',
        });
        mustFilters.push({
          'OrgNceaClassifiers.classifierValue.keyword': level1 || [],
        });
        break;
      default:
        uniqueField = 'OrgNceaClassifiers.classifierValue.keyword';
        mustFilters.push({
          'OrgNceaClassifiers.classifierType.keyword': 'Level 1',
        });
    }
    const payload = classifierAggregationQuery(mustFilters, uniqueField);
    const response = await elasticSearchClient.post(elasticSearchAPIPaths.searchPath, payload);
    const responseData = response?.data;
    if (responseData?.hits?.total?.value) {
      const finalResponse: string[] = await formatClassifierResponse(responseData?.aggregations);
      return finalResponse;
    } else {
      return Promise.resolve([] as string[]);
    }
    /* eslint-disable  @typescript-eslint/no-explicit-any */
  } catch (error: any) {
    throw new Error(`Error fetching results: ${error.message}`);
  }
};

export { getDocumentDetails, getFilterOptions, getSearchResultsCount, getSearchResults, getClassifierDetails };
