import MockAdapter from 'axios-mock-adapter';
import { geoNetworkClient } from '../../src/config/geoNetworkClient';
import { geoNetworkAPIPaths } from '../../src/utils/constants';
import { Config } from '../../src/config/environmentConfig';

const mock = new MockAdapter(geoNetworkClient);

const mockConfig = {
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
};
const mockError = {
  response: {
    statue: 404,
    data: 'Not Found',
  },
};
const mockErrorInterceptor = jest.fn((error) => Promise.reject(error));
const mockRequestInterceptor = jest.fn((config) => config);
geoNetworkClient.interceptors.request.use(
  mockRequestInterceptor,
  mockErrorInterceptor
);

describe('Geo Network instance configuration', () => {
  beforeEach(() => {
    mock.reset();
  });

  describe('Geo Network instance creation', () => {
    it('should create Geo Network instance with correct base url and headers', async () => {
      expect(geoNetworkClient.defaults.baseURL).toBe(
        Config.geoNetworkSearchAPI
      );
      expect(geoNetworkClient.defaults.headers.Accept).toEqual(
        'application/json'
      );
    });
  });

  describe('Geo Network request and response interceptors', () => {
    it('should handle successful responses correctly', async () => {
      const responseData = { message: 'Success' };
      mock
        .onPost(geoNetworkAPIPaths.elasticSearch, {}, mockConfig.headers)
        .reply(200, responseData);

      const response = await geoNetworkClient.post(
        geoNetworkAPIPaths.elasticSearch,
        {},
        mockConfig
      );

      expect(response.status).toBe(200);
      expect(response.data).toEqual(responseData);
      expect(mockRequestInterceptor).toHaveBeenCalledTimes(1);
    });

    it('should reject the promise with the received error', async () => {
      try {
        mock.onGet('fake-url').reply(404, { message: 'Mock error' });
        await geoNetworkClient.get('/fake-url');
      } catch (error: any) {
        await expect(error.response?.status).toBe(404);
        await expect(error.response?.data?.message).toEqual('Mock error');
        expect(mockErrorInterceptor(mockError)).rejects.toEqual(mockError);
      }
    });
  });
});
