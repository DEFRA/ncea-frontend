/* eslint-disable  @typescript-eslint/no-explicit-any */

import { environmentConfig } from './environmentConfig';
import { geoNetworkIndex } from '../utils/constants';
import { Client, ClientOptions, estypes } from '@elastic/elasticsearch';

const { elasticSearchAPI, elasticSearchUsername, elasticSearchPassword } = environmentConfig;

const hasCredentials: boolean = !!elasticSearchUsername?.length && !!elasticSearchPassword?.length;

const clientOptions: ClientOptions = {
  node: elasticSearchAPI,
  ...(hasCredentials && {
    auth: {
      username: elasticSearchUsername as string,
      password: elasticSearchPassword as string,
    },
  }),
};
const client = new Client(clientOptions);

const performQuery = async <T>(payload: estypes.SearchRequest, isCount: boolean = false): Promise<T> => {
  try {
    const endPoint: string = isCount ? 'count' : 'search';
    const result = await client[endPoint]({
      index: geoNetworkIndex,
      ...payload,
    });
    return result as T;
  } catch (error: any) {
    throw new Error(`Elasticsearch results: ${error.message}`);
  }
};

export { performQuery, hasCredentials, clientOptions };
