import { ISearchFieldsObject } from '../../../src/interfaces/queryBuilder.interface';
import { buildSearchQuery } from '../../../src/utils/queryBuilder';
import { geoNetworkClient } from '../../../src/config/geoNetworkClient';
import { getSearchResults } from '../../../src/services/handlers/searchApi';
import { geoNetworkAPIPaths } from '../../../src/utils/constants';
jest.mock('../../../src/utils/queryBuilder', () => ({
  buildSearchQuery: jest.fn((searchFieldsObject) => {
    return { query: {} };
  }),
}));
jest.mock('../../../src/config/geoNetworkClient', () => ({
  geoNetworkClient: {
    post: jest.fn(() => {
      return Promise.resolve({ data: 'mocked response' });
    }),
  },
}));
jest.mock('../../../src/utils/formatSearchResponse', () => ({
  formatSearchResponse: jest.fn((apiResponse) => ({
    total: apiResponse?.hits?.total?.value,
    items: [],
  })),
}));
describe('Search API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('should call buildSearchQuery with correct arguments', async () => {
    const searchFieldsObject: ISearchFieldsObject = { searchTerm: 'example' };
    await getSearchResults(searchFieldsObject);
    expect(buildSearchQuery).toHaveBeenCalledWith(searchFieldsObject);
  });
  it('should call geoNetworkClient.post with correct arguments', async () => {
    const searchFieldsObject: ISearchFieldsObject = { searchTerm: 'example' };
    await getSearchResults(searchFieldsObject);
    expect(geoNetworkClient.post).toHaveBeenCalledWith(
      geoNetworkAPIPaths.elasticSearch,
      { query: {} }
    );
  });
  it('should return the response from geoNetworkClient.post', async () => {
    const searchFieldsObject: ISearchFieldsObject = { searchTerm: 'example' };
    const result = await getSearchResults(searchFieldsObject);
    expect(result).toEqual({ total: undefined, items: [] });
  });
  it('should handle errors and throw an error message', async () => {
    jest.mock('../../../src/config/geoNetworkClient', () => ({
      geoNetworkClient: {
        post: jest.fn(() => {
          throw new Error('Mocked error');
        }),
      },
    }));
    const searchFieldsObject = { searchTerm: 'example' };
    const consoleErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    try {
      await getSearchResults(searchFieldsObject);
    } catch (error: any) {
      expect(error.message).toContain('Error fetching results');
      expect(error.message).toContain('Mocked error');
      expect(consoleErrorSpy).toHaveBeenCalled();
    }
  });
});
