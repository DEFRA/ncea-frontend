import { Client } from '@elastic/elasticsearch';
import { environmentConfig } from '../../src/config/environmentConfig';
import { performQuery } from '../../src/config/elasticSearchClient';
import { geoNetworkIndex } from '../../src/utils/constants';

jest.mock('@elastic/elasticsearch', () => {
  const mClient = {
    search: jest.fn(),
    count: jest.fn(),
  };
  return {
    Client: jest.fn(() => mClient),
  };
});

describe('performQuery', () => {
  let client;
  let payload;

  beforeEach(() => {
    client = new Client({ node: environmentConfig.elasticSearchAPI });
    payload = { body: { query: { match_all: {} } } };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should perform a search query successfully', async () => {
    const expectedResult = { hits: { hits: [] } };
    client.search.mockResolvedValueOnce(expectedResult);

    const result = await performQuery(payload);

    expect(client.search).toHaveBeenCalledWith({
      index: geoNetworkIndex,
      ...payload,
    });
    expect(result).toBe(expectedResult);
  });

  it('should perform a count query successfully', async () => {
    const expectedResult = { count: 0 };
    client.count.mockResolvedValueOnce(expectedResult);

    const result = await performQuery(payload, true);

    expect(client.count).toHaveBeenCalledWith({
      index: geoNetworkIndex,
      ...payload,
    });
    expect(result).toBe(expectedResult);
  });

  it('should handle errors', async () => {
    const errorMessage = 'Elasticsearch error';
    client.search.mockRejectedValueOnce(new Error(errorMessage));

    await expect(performQuery(payload)).rejects.toThrow(errorMessage);

    expect(client.search).toHaveBeenCalledWith({
      index: geoNetworkIndex,
      ...payload,
    });
  });
});
