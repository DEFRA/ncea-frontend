import { ApiResponse } from '../../Models/ApiResponse';
import { geoNetworkClient } from '../../config/geoNetworkClient';
import { BoolModel, Must, Query, Querystring, SearchRequest } from '../../Models/SearchRequest';

const url = 'https://20.77.9.229:8080/geonetwork/srv/api/search/records/_search?bucket=s101';

const getSearchRequest = function (searchTerm: string | null): SearchRequest {
  const queryString = new Querystring(searchTerm as string, 'AND');
  const must = new Must(queryString);
  const boolModel = new BoolModel([must]);
  const queryModel = new Query(boolModel);
  const searchRequestObj = new SearchRequest(queryModel, null);
  return searchRequestObj;
};

const getSearchResults = async function (query: string | null): Promise<ApiResponse> {
  try {
    const searchRequestObj = getSearchRequest(query);
    const res = await geoNetworkClient.post(url, searchRequestObj);
    return new ApiResponse(res.data, res.status, res.status == 200);
  } catch (error) {
    return new ApiResponse({ message: 'Unable to fetch the search results.' }, 400);
  }
};

export { getSearchResults };
