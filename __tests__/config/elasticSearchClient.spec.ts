import { Client, ClientOptions } from '@elastic/elasticsearch';
import { environmentConfig } from '../../src/config/environmentConfig';
import { geoNetworkIndex } from '../../src/utils/constants';
import { performQuery } from '../../src/config/elasticSearchClient';

jest.mock('@elastic/elasticsearch', () => {
  const mClient = {
    search: jest.fn(),
    count: jest.fn(),
  };
  return {
    Client: jest.fn(() => mClient),
  };
});

describe('Elasticsearch Client', () => {
  describe('Elasticsearch Client Configurations', () => {
    beforeEach(() => {
      jest.mock('../../src/config/environmentConfig', () => ({
        environmentConfig: {
          elasticSearchAPI: environmentConfig.elasticSearchAPI,
          elasticSearchUsername: '',
          elasticSearchPassword: '',
        },
      }));
    });

    afterEach(() => {
      jest.resetModules();
    });

    it('should return false for hasCredentials when username and password are empty', async () => {
      const {
        hasCredentials,
      } = require('../../src/config/elasticSearchClient');
      expect(hasCredentials).toBe(false);
    });

    it('should set clientOptions without auth when username and password are empty', () => {
      const { clientOptions } = require('../../src/config/elasticSearchClient');
      const expectedClientOptions: ClientOptions = {
        node: environmentConfig.elasticSearchAPI,
      };
      expect(clientOptions).toEqual(expectedClientOptions);
    });

    it('should return true for hasCredentials when username and password are provided', async () => {
      jest.doMock('../../src/config/environmentConfig', () => ({
        environmentConfig: {
          elasticSearchAPI: environmentConfig.elasticSearchAPI,
          elasticSearchUsername: 'es-user',
          elasticSearchPassword: 'es-pass',
        },
      }));
      const {
        hasCredentials,
      } = require('../../src/config/elasticSearchClient');
      expect(hasCredentials).toBe(true);
    });

    it('should set clientOptions with auth when username and password are provided', () => {
      jest.doMock('../../src/config/environmentConfig', () => ({
        environmentConfig: {
          elasticSearchAPI: environmentConfig.elasticSearchAPI,
          elasticSearchUsername: 'es-user',
          elasticSearchPassword: 'es-pass',
        },
      }));
      const { clientOptions } = require('../../src/config/elasticSearchClient');
      const expectedClientOptions: ClientOptions = {
        node: environmentConfig.elasticSearchAPI,
        auth: {
          username: 'es-user',
          password: 'es-pass',
        },
      };
      expect(clientOptions).toEqual(expectedClientOptions);
    });
  });

  describe('Elasticsearch Query operations', () => {
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
});
