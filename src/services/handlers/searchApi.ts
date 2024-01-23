import { ISearchFieldsObject } from '../../models/interfaces/queryBuilder.interface';
import { buildSearchQuery } from '../../utils/queryBuilder';
import { geoNetworkAPIPaths } from '../../utils/constants';
import { geoNetworkClient } from '../../config/geoNetworkClient';

const getSearchResults = async (searchFieldsObject: ISearchFieldsObject) => {
  const payload = buildSearchQuery(searchFieldsObject);
  return geoNetworkClient.post(geoNetworkAPIPaths.elasticSearch, payload);
};

export { getSearchResults };
