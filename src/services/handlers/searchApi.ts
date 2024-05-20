import { IFilterFlags } from '@/src/interfaces/searchPayload.interface';
import { elasticSearchClient } from '../../config/elasticSearchClient';
import { formatAggregationResponse } from '../../utils/formatAggregationResponse';
import { formatSearchResponse } from '../../utils/formatSearchResponse';
import { IAggregationOptions, ISearchItem, ISearchResults } from '../../interfaces/searchResponse.interface';
import { ISearchBuilderPayload, ISearchPayload } from '../../interfaces/queryBuilder.interface';
import { defaultFilterOptions, elasticSearchAPIPaths } from '../../utils/constants';
import { generateFilterQuery, generateSearchQuery } from '../../utils/queryBuilder';

const getSearchResults = async (
  searchFieldsObject: ISearchPayload,
  isMapResults: boolean = false,
): Promise<ISearchResults> => {
  try {
    if (Object.keys(searchFieldsObject.fields).length) {
      const searchBuilderPayload: ISearchBuilderPayload = {
        searchFieldsObject,
      };
      const payload = generateSearchQuery(searchBuilderPayload);
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
    };
    const payload = generateSearchQuery(searchBuilderPayload);
    if (Object.keys(searchFieldsObject.fields).length) {
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
  filterFlags?: IFilterFlags,
): Promise<IAggregationOptions> => {
  try {
    const { isStudyPeriod = false } = filterFlags as IFilterFlags;
    if (Object.keys(searchFieldsObject.fields).length) {
      const searchBuilderPayload: ISearchBuilderPayload = {
        searchFieldsObject,
        isAggregation: true,
      };
      const payload = generateFilterQuery(searchBuilderPayload, {
        isStudyPeriod,
      });
      const response = await elasticSearchClient.post(elasticSearchAPIPaths.searchPath, payload);
      const finalResponse: IAggregationOptions = await formatAggregationResponse(response.data, defaultFilterOptions);
      return finalResponse;
    } else {
      const fallbackResolve: IAggregationOptions = defaultFilterOptions.reduce((acc, curr) => {
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
    const payload = generateSearchQuery({ docId });
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

export { getDocumentDetails, getFilterOptions, getSearchResultsCount, getSearchResults };
