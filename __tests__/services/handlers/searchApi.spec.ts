import { buildSearchQuery } from '../../../src/utils/queryBuilder';
import { elasticSearchAPIPaths } from '../../../src/utils/constants';
import { elasticSearchClient } from '../../../src/config/elasticSearchClient';
import {
  IQuery,
  ISearchFieldsObject,
} from '../../../src/interfaces/queryBuilder.interface';
import {
  getSearchResults,
  getSearchResultsCount,
} from '../../../src/services/handlers/searchApi';

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
  describe('Search API - To fetch the search results', () => {
    it('should call elasticSearchClient.post with correct arguments', async () => {
      const searchFieldsObject: ISearchFieldsObject = {
        'quick-search': {
          search_term: 'example',
        },
      };
      const payload: IQuery = buildSearchQuery(searchFieldsObject);
      await getSearchResults(searchFieldsObject);
      expect(elasticSearchClient.post).toHaveBeenCalledWith(
        elasticSearchAPIPaths.searchPath,
        payload,
      );
    });

    it('should return the response from elasticSearchClient.post', async () => {
      const searchFieldsObject: ISearchFieldsObject = {
        'quick-search': {
          search_term: 'example',
        },
      };
      const result = await getSearchResults(searchFieldsObject);
      expect(result).toEqual({ total: undefined, items: [] });
    });

    it('should handle errors and throw an error message', async () => {
      const searchFieldsObject: ISearchFieldsObject = {
        'quick-search': {
          search_term: 'example',
        },
      };
      elasticSearchClient.post = jest
        .fn()
        .mockRejectedValueOnce(new Error('Mocked error'));
      await expect(getSearchResults(searchFieldsObject)).rejects.toThrow(
        'Error fetching results: Mocked error',
      );
    });
  });

  describe('Search API - To fetch the search results count', () => {
    it('should call elasticSearchClient.post with correct arguments', async () => {
      const searchFieldsObject: ISearchFieldsObject = {
        'quick-search': {
          search_term: 'example',
        },
      };
      (elasticSearchClient.post as jest.Mock).mockResolvedValueOnce({
        data: { totalResults: 10 },
      });
      await getSearchResultsCount(searchFieldsObject);
      expect(elasticSearchClient.post).toHaveBeenCalledTimes(1);
    });

    it('should return the total results count', async () => {
      const searchFieldsObject: ISearchFieldsObject = {
        'quick-search': {
          search_term: 'example',
        },
      };
      (elasticSearchClient.post as jest.Mock).mockResolvedValueOnce({
        data: { totalResults: 10 },
      });
      const result = await getSearchResultsCount(searchFieldsObject);
      expect(result).toEqual({ totalResults: 10 });
    });

    it('should return the total results count as 0 if no must conditions are provided', async () => {
      const result = await getSearchResultsCount({});
      expect(result).toEqual({ totalResults: 0 });
    });

    it('should handle errors and throw an error message', async () => {
      const searchFieldsObject: ISearchFieldsObject = {
        'quick-search': {
          search_term: 'example',
        },
      };
      elasticSearchClient.post = jest
        .fn()
        .mockRejectedValueOnce(new Error('Mocked error'));
      await expect(getSearchResultsCount(searchFieldsObject)).rejects.toThrow(
        'Error fetching results: Mocked error',
      );
    });
  });
});