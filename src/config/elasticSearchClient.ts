/* eslint-disable  @typescript-eslint/no-explicit-any */

import { environmentConfig } from './environmentConfig';
import fs from 'fs';
import { geoNetworkIndex } from '../utils/constants';
import path from 'path';
import { Client, ClientOptions, estypes } from '@elastic/elasticsearch';

const { elasticSearchAPI, elasticSearchUsername, elasticSearchPassword } = environmentConfig;

const hasCredentials: boolean = !!elasticSearchUsername?.length && !!elasticSearchPassword?.length;
const certPath: string = path.join('/usr/share/elasticsearch/config/certs', 'ca.crt');

const clientOptions: ClientOptions = {
  node: elasticSearchAPI,
  ...(hasCredentials && {
    auth: {
      username: elasticSearchUsername as string,
      password: elasticSearchPassword as string,
    },
    tls: {
    ca: fs.readFileSync(certPath),
    rejectUnauthorized: true,
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
