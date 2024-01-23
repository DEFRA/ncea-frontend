import {
  IQuery,
  ISearchFieldsObject,
} from '../../src/models/interfaces/queryBuilder.interface';
import { buildSearchQuery } from '../../src/utils/queryBuilder';

describe('Build the search query', () => {
  it('should build the search query correctly with both search term and date range', () => {
    const searchFieldsObject: ISearchFieldsObject = {
      searchTerm: 'example',
      startDate: '2022-01-01',
      endDate: '2022-12-31',
    };

    const expectedQuery: IQuery = {
      query: {
        bool: {
          must: [
            {
              bool: {
                should: [
                  { match: { field1: 'example' } },
                  { match: { field2: 'example' } },
                  { match: { field3: 'example' } },
                ],
              },
            },
            {
              range: {
                your_date_field: {
                  gte: '2022-01-01',
                  lte: '2022-12-31',
                },
              },
            },
          ],
        },
      },
    };

    const result = buildSearchQuery(searchFieldsObject);

    expect(result).toEqual(expectedQuery);
    expect(result.query.bool.must).toHaveLength(2);
  });

  it('should build the search query correctly with only search term', () => {
    const searchFieldsObject: ISearchFieldsObject = {
      searchTerm: 'example',
    };

    const expectedQuery: IQuery = {
      query: {
        bool: {
          must: [
            {
              bool: {
                should: [
                  { match: { field1: 'example' } },
                  { match: { field2: 'example' } },
                  { match: { field3: 'example' } },
                ],
              },
            },
          ],
        },
      },
    };

    const result = buildSearchQuery(searchFieldsObject);

    expect(result).toEqual(expectedQuery);
    expect(result.query.bool.must).toHaveLength(1);
  });

  it('should build the search query correctly with only date range', () => {
    const searchFieldsObject: ISearchFieldsObject = {
      startDate: '2022-01-01',
      endDate: '2022-12-31',
    };

    const expectedQuery: IQuery = {
      query: {
        bool: {
          must: [
            {
              range: {
                your_date_field: {
                  gte: '2022-01-01',
                  lte: '2022-12-31',
                },
              },
            },
          ],
        },
      },
    };

    const result = buildSearchQuery(searchFieldsObject);

    expect(result).toEqual(expectedQuery);
    expect(result.query.bool.must).toHaveLength(1);
  });

  it('should handle missing search fields', () => {
    const searchFieldsObject = {};

    const expectedQuery = {
      query: {
        bool: {
          must: [],
        },
      },
    };

    const result = buildSearchQuery(searchFieldsObject);

    expect(result).toEqual(expectedQuery);
  });
});
