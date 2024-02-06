import { ISearchFieldsObject } from '../../../src/interfaces/queryBuilder.interface';
import { buildSearchQuery } from '../../../src/utils/queryBuilder';
import { elasticSearchAPIPaths } from '../../../src/utils/constants';
import { elasticSearchClient } from '../../../src/config/elasticSearchClient';
import { getSearchResults } from '../../../src/services/handlers/searchApi';

jest.mock('../../../src/utils/queryBuilder', () => ({
  buildSearchQuery: jest.fn((searchFieldsObject) => {
    return { query: {} };
  }),
}));
jest.mock('../../../src/config/elasticSearchClient', () => ({
  elasticSearchClient: {
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
  it('should call elasticSearchClient.post with correct arguments', async () => {
    const searchFieldsObject: ISearchFieldsObject = { searchTerm: 'example' };
    await getSearchResults(searchFieldsObject);
    expect(elasticSearchClient.post).toHaveBeenCalledWith(
      elasticSearchAPIPaths.searchPath,
      { query: {} }
    );
  });
  it('should return the response from elasticSearchClient.post', async () => {
    const searchFieldsObject: ISearchFieldsObject = { searchTerm: 'example' };
    const result = await getSearchResults(searchFieldsObject);
    expect(result).toEqual({ total: undefined, items: [] });
  });
  it('should handle errors and throw an error message', async () => {
    const searchFieldsObject = { searchTerm: 'example' };
    elasticSearchClient.post = jest
      .fn()
      .mockRejectedValueOnce(new Error('Mocked error'));
    await expect(getSearchResults(searchFieldsObject)).rejects.toThrow(
      'Error fetching results: Mocked error'
    );
  });
});