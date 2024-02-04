import { ISearchFieldsObject } from '../../interfaces/queryBuilder.interface';
import { ISearchResults } from '../../interfaces/searchResponse.interface';
import { buildSearchQuery } from '../../utils/queryBuilder';
import { formatSearchResponse } from '../../utils/formatSearchResponse';
import { elasticSearchAPIPaths } from '../../utils/constants';
import { elasticSearchClient } from '../../config/elasticSearchClient';

const getSearchResults = async (
  searchFieldsObject: ISearchFieldsObject
): Promise<ISearchResults> => {
  try {
    const payload = buildSearchQuery(searchFieldsObject);
    const response = await elasticSearchClient.post(
      elasticSearchAPIPaths.searchPath,
      payload
    );
    const finalResponse: ISearchResults = await formatSearchResponse(
      response.data
    );
    return finalResponse;
    /* eslint-disable  @typescript-eslint/no-explicit-any */
  } catch (error: any) {
    throw new Error(`Error fetching results: ${error.message}`);
  }
};

export { getSearchResults };
