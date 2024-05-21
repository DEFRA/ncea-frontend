import { generateSearchQuery } from '../../../src/utils/queryBuilder';
import { elasticSearchClient } from '../../../src/config/elasticSearchClient';
import {
  IQuery,
  ISearchPayload,
} from '../../../src/interfaces/queryBuilder.interface';
import {
  elasticSearchAPIPaths,
  resourceTypeFilterField,
  uniqueResourceTypesKey,
  yearRange,
} from '../../../src/utils/constants';
import {
  formattedResourceTypeResponse,
  resourceTypeAPIResponse,
} from '../../data/resourceTypeResponse';
import {
  getDocumentDetails,
  getFilterOptions,
  getSearchResults,
  getSearchResultsCount,
} from '../../../src/services/handlers/searchApi';
import {
  detailsEmptyAPIResponse,
  detailsSuccessAPIResponse,
} from '../../data/documentDetailsResponse';
import { formatAggregationResponse } from '../../../src/utils/formatAggregationResponse';
import { formatSearchResponse } from '../../../src/utils/formatSearchResponse';
import {
  IAggregationOptions,
  ISearchResults,
} from '../../../src/interfaces/searchResponse.interface';

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

jest.mock('../../../src/utils/formatAggregationResponse', () => ({
  formatAggregationResponse: jest.fn(),
}));

describe('Search API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe('Search API - To fetch the search results', () => {
    it('should call elasticSearchClient.post with correct arguments', async () => {
      const searchFieldsObject: ISearchPayload = {
        fields: {
          keyword: {
            q: 'example',
          },
        },
        sort: '',
        filters: {},
        rowsPerPage: 20,
        page: 1,
      };
      const payload: IQuery = generateSearchQuery({ searchFieldsObject });
      await getSearchResults(searchFieldsObject);
      expect(elasticSearchClient.post).toHaveBeenCalledWith(
        elasticSearchAPIPaths.searchPath,
        payload,
      );
    });

    it('should return the response from elasticSearchClient.post', async () => {
      const searchFieldsObject: ISearchPayload = {
        fields: {
          keyword: {
            q: 'example',
          },
        },
        sort: 'best_match',
        filters: {},
        rowsPerPage: 20,
        page: 1,
      };
      const result = await getSearchResults(searchFieldsObject);
      expect(result).toEqual({ total: undefined, items: [] });
    });

    it('should handle errors and throw an error message', async () => {
      const searchFieldsObject: ISearchPayload = {
        fields: {
          keyword: {
            q: 'example',
          },
        },
        sort: '',
        filters: {},
        rowsPerPage: 20,
        page: 1,
      };
      elasticSearchClient.post = jest
        .fn()
        .mockRejectedValueOnce(new Error('Mocked error'));
      await expect(getSearchResults(searchFieldsObject)).rejects.toThrow(
        'Error fetching results: Mocked error',
      );
    });

    it('should return the default response when no fields data is present', async () => {
      const result = await getSearchResults({
        fields: {},
        sort: '',
        rowsPerPage: 20,
        filters: {},
        page: 1,
      });
      expect(result).toEqual({ total: 0, items: [] });
    });
  });

  describe('Search API - To fetch the search results count', () => {
    it('should call elasticSearchClient.post with correct arguments', async () => {
      const searchFieldsObject: ISearchPayload = {
        fields: {
          keyword: {
            q: 'example',
          },
        },
        sort: '',
        filters: {},
        rowsPerPage: 20,
        page: 1,
      };
      (elasticSearchClient.post as jest.Mock).mockResolvedValueOnce({
        data: { totalResults: 10 },
      });
      await getSearchResultsCount(searchFieldsObject);
      expect(elasticSearchClient.post).toHaveBeenCalledTimes(1);
    });

    it('should return the total results count', async () => {
      const searchFieldsObject: ISearchPayload = {
        fields: {
          keyword: {
            q: 'example',
          },
        },
        sort: '',
        filters: {},
        rowsPerPage: 20,
        page: 1,
      };
      (elasticSearchClient.post as jest.Mock).mockResolvedValueOnce({
        data: { count: 10 },
      });
      const result = await getSearchResultsCount(searchFieldsObject);
      expect(result).toEqual({ totalResults: 10 });
    });

    it('should return the total results count as 0 if no must conditions are provided', async () => {
      const result = await getSearchResultsCount({
        fields: {},
        sort: '',
        rowsPerPage: 20,
        filters: {},
        page: 1,
      });
      expect(result).toEqual({ totalResults: 0 });
    });

    it('should handle errors and throw an error message', async () => {
      const searchFieldsObject: ISearchPayload = {
        fields: {
          keyword: {
            q: 'example',
          },
        },
        sort: '',
        filters: {},
        rowsPerPage: 20,
        page: 1,
      };
      elasticSearchClient.post = jest
        .fn()
        .mockRejectedValueOnce(new Error('Mocked error'));
      await expect(getSearchResultsCount(searchFieldsObject)).rejects.toThrow(
        'Error fetching results: Mocked error',
      );
    });
  });

  describe('Search API - To fetch the aggregated results for filters', () => {
    it('should return the response from elasticSearchClient.post', async () => {
      const searchFieldsObject: ISearchPayload = {
        fields: {
          keyword: {
            q: 'example',
          },
        },
        sort: 'best_match',
        filters: { [resourceTypeFilterField]: ['dataset'] },
        rowsPerPage: 20,
        page: 1,
      };
      (elasticSearchClient.post as jest.Mock).mockResolvedValueOnce(
        resourceTypeAPIResponse,
      );
      (formatAggregationResponse as jest.Mock).mockResolvedValueOnce(
        formattedResourceTypeResponse,
      );
      const result = await getFilterOptions(searchFieldsObject, {
        isStudyPeriod: false,
      });
      expect(result).toEqual(formattedResourceTypeResponse);
    });

    it('should handle errors and throw an error message', async () => {
      const searchFieldsObject: ISearchPayload = {
        fields: {
          keyword: {
            q: 'example',
          },
        },
        sort: '',
        filters: {},
        rowsPerPage: 20,
        page: 1,
      };
      elasticSearchClient.post = jest
        .fn()
        .mockRejectedValueOnce(new Error('Mocked error'));
      await expect(
        getFilterOptions(searchFieldsObject, {
          isStudyPeriod: false,
        }),
      ).rejects.toThrow('Error fetching results: Mocked error');
    });

    it('should return the default response when no fields data is present', async () => {
      const result = await getFilterOptions(
        {
          fields: {},
          sort: '',
          rowsPerPage: 20,
          filters: {},
          page: 1,
        },
        {
          isStudyPeriod: false,
        },
      );
      const filterOptionsResponse: IAggregationOptions = {
        [yearRange]: [],
        [uniqueResourceTypesKey]: [],
      };
      expect(result).toEqual(filterOptionsResponse);
    });
  });

  describe('Search API - To fetch the document details', () => {
    it('should return the response from elasticSearchClient.post', async () => {
      const docId = '3c080cb6-2ed9-43e7-9323-9ce42b05b9a2';
      (elasticSearchClient.post as jest.Mock).mockResolvedValueOnce({
        data: detailsSuccessAPIResponse,
      });
      const formattedDetailsResponse: ISearchResults =
        await formatSearchResponse(detailsSuccessAPIResponse, true);
      const result = await getDocumentDetails(docId);
      expect(result).toEqual(formattedDetailsResponse?.items?.[0]);
    });

    it('should return the empty object when no document found from elasticSearchClient.post', async () => {
      const docId = '3c080cb6-2ed9-43e7-9323-9ce42b05b9a2';
      (elasticSearchClient.post as jest.Mock).mockResolvedValueOnce({
        data: detailsEmptyAPIResponse,
      });
      const result = await getDocumentDetails(docId);
      expect(result).toEqual({});
    });

    it('should handle errors and throw an error message', async () => {
      const docId = '3c080cb6-2ed9-43e7-9323-9ce42b05b9a2';
      elasticSearchClient.post = jest
        .fn()
        .mockRejectedValueOnce(new Error('Mocked error'));
      await expect(getDocumentDetails(docId)).rejects.toThrow(
        'Error fetching results: Mocked error',
      );
    });
  });
});
