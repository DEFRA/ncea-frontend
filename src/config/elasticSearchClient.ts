import { environmentConfig } from './environmentConfig';
import { geoNetworkIndex } from '../utils/constants';
import { Client, estypes } from '@elastic/elasticsearch';

const client = new Client({ node: environmentConfig.elasticSearchAPI });

const performQuery = async <T>(payload: estypes.SearchRequest, isCount: boolean = false): Promise<T> => {
  try {
    const endPoint: string = isCount ? 'count' : 'search';
    const result = await client[endPoint]({
      index: geoNetworkIndex,
      ...payload,
    });
    return result as T;
  } catch (error) {
    console.error('Elasticsearch error:', error);
    throw error;
  }
};

export { performQuery };
