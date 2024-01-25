import { ISearchFieldsObject } from '../../models/interfaces/queryBuilder.interface';
import { ISearchResults } from '../../models/interfaces/searchResponse.interface';
import { buildSearchQuery } from '../../utils/queryBuilder';
import { formatSearchResponse } from '../../utils/formatSearchResponse';
import { geoNetworkAPIPaths } from '../../utils/constants';
import { geoNetworkClient } from '../../config/geoNetworkClient';

const getSearchResults = async (searchFieldsObject: ISearchFieldsObject): Promise<ISearchResults> => {
  try {
    const payload = buildSearchQuery(searchFieldsObject);
    const response = await geoNetworkClient.post(geoNetworkAPIPaths.elasticSearch, payload);
    const finalResponse: ISearchResults = await formatSearchResponse(response.data);
    return finalResponse;
    /* eslint-disable  @typescript-eslint/no-explicit-any */
  } catch (error: any) {
    throw new Error(`Error fetching results: ${error.message}`);
  }
};

export { getSearchResults };
