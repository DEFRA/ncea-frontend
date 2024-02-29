import { buildSearchQuery } from '../../utils/queryBuilder';
import { elasticSearchClient } from '../../config/elasticSearchClient';
import { formatAggregationResponse } from '../../utils/formatAggregationResponse';
import { formatSearchResponse } from '../../utils/formatSearchResponse';
import { IAggregationOptions, ISearchItem, ISearchResults } from '../../interfaces/searchResponse.interface';
import { ISearchBuilderPayload, ISearchPayload } from '../../interfaces/queryBuilder.interface';
import { elasticSearchAPIPaths, resourceTypeOptions } from '../../utils/constants';

const getSearchResults = async (searchFieldsObject: ISearchPayload): Promise<ISearchResults> => {
  try {
    if (Object.keys(searchFieldsObject.fields).length) {
      const searchBuilderPayload: ISearchBuilderPayload = {
        searchFieldsObject,
        ignoreAggregation: true,
      };
      const payload = buildSearchQuery(searchBuilderPayload);
      const response = await elasticSearchClient.post(elasticSearchAPIPaths.searchPath, payload);
      const finalResponse: ISearchResults = await formatSearchResponse(response.data);
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

const getResourceTypeOptions = async (searchFieldsObject: ISearchPayload): Promise<IAggregationOptions> => {
  try {
    if (Object.keys(searchFieldsObject.fields).length) {
      const searchBuilderPayload: ISearchBuilderPayload = {
        searchFieldsObject,
        aggregationField: 'resourceType',
      };
      const payload = buildSearchQuery(searchBuilderPayload);
      const response = await elasticSearchClient.post(elasticSearchAPIPaths.searchPath, payload);
      const finalResponse: IAggregationOptions = await formatAggregationResponse(response.data);
      return finalResponse;
    } else {
      return Promise.resolve(resourceTypeOptions);
    }
    /* eslint-disable  @typescript-eslint/no-explicit-any */
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
      const finalResponse: ISearchResults = await formatSearchResponse(responseData);
      return finalResponse?.items?.[0] as ISearchItem;
    } else {
      return Promise.resolve({} as ISearchItem);
    }
    /* eslint-disable  @typescript-eslint/no-explicit-any */
  } catch (error: any) {
    throw new Error(`Error fetching results: ${error.message}`);
  }
};

export { getDocumentDetails, getResourceTypeOptions, getSearchResultsCount, getSearchResults };
