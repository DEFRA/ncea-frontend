import MockAdapter from 'axios-mock-adapter';
import { elasticSearchClient } from '../../src/config/elasticSearchClient';
import { elasticSearchAPIPaths } from '../../src/utils/constants';
import { environmentConfig } from '../../src/config/environmentConfig';

const mock = new MockAdapter(elasticSearchClient);

const mockConfig = {
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
};
const mockError = {
  response: {
    status: 404,
    data: 'Not Found',
  },
};
const mockErrorInterceptor = jest.fn((error) => Promise.reject(error));
const mockRequestInterceptor = jest.fn((config) => config);
elasticSearchClient.interceptors.request.use(
  mockRequestInterceptor,
  mockErrorInterceptor
);

describe('Elasticsearch instance configuration', () => {
  beforeEach(() => {
    mock.reset();
  });

  describe('Elasticsearch instance creation', () => {
    it('should create Elasticsearch instance with correct base url and headers', async () => {
      expect(elasticSearchClient.defaults.baseURL).toBe(
        environmentConfig.elasticSearchAPI
      );
      expect(elasticSearchClient.defaults.headers.Accept).toEqual(
        'application/json'
      );
    });
  });

  describe('Elasticsearch request and response interceptors', () => {
    it('should handle successful responses correctly', async () => {
      const responseData = { message: 'Success' };
      mock
        .onPost(elasticSearchAPIPaths.searchPath, {}, mockConfig.headers)
        .reply(200, responseData);

      const response = await elasticSearchClient.post(
        elasticSearchAPIPaths.searchPath,
        {},
        mockConfig
      );

      expect(response.status).toBe(200);
      expect(response.data).toEqual(responseData);
      expect(mockRequestInterceptor).toHaveBeenCalledTimes(1);
    });

    it('should reject the promise with the received error', async () => {
      mock.onGet('fake-url').reply(404, { message: 'Mock error' });

      try {
        await elasticSearchClient.get('/fake-url');
        fail('Promise should have been rejected');
      } catch (error: any) {
        await expect(error.response?.status).toBe(404);
        await expect(error.response?.data?.message).toEqual('Mock error');
        await expect(mockErrorInterceptor(mockError)).rejects.toEqual(
          mockError
        );
        await expect(mockErrorInterceptor).toHaveBeenCalledWith(mockError);
      }
    });
  });
});
