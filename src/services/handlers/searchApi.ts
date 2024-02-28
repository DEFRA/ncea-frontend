import { ISearchPayload } from '../../interfaces/queryBuilder.interface';
import { buildSearchQuery } from '../../utils/queryBuilder';
import { elasticSearchClient } from '../../config/elasticSearchClient';
import { formatAggregationResponse } from '../../utils/formatAggregationResponse';
import { formatSearchResponse } from '../../utils/formatSearchResponse';
import { IAggregationOptions, ISearchResults } from '../../interfaces/searchResponse.interface';
import { elasticSearchAPIPaths, resourceTypeOptions } from '../../utils/constants';

const getSearchResults = async (searchFieldsObject: ISearchPayload): Promise<ISearchResults> => {
  try {
    if (Object.keys(searchFieldsObject.fields).length) {
      const payload = buildSearchQuery(searchFieldsObject, [], false, true);
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
    const payload = buildSearchQuery(searchFieldsObject, [], true, true);
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
      const payload = buildSearchQuery(searchFieldsObject, [], false, false, 'resourceType');
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

export { getResourceTypeOptions, getSearchResults, getSearchResultsCount };
