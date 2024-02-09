import {
  IQuery,
  ISearchFieldsObject,
} from '../../src/interfaces/queryBuilder.interface';
import { buildSearchQuery } from '../../src/utils/queryBuilder';

describe('Build the search query', () => {
  it('should build the search query correctly with date range and when fields are not provided', () => {
    const searchFieldsObject: ISearchFieldsObject = {
      'quick-search': {
        search_term: 'example',
      },
      'date-search': {
        'from-date-year': '2022',
        'from-date-day': '01',
        'from-date-month': '01',
        'to-date-year': '2022',
        'to-date-day': '31',
        'to-date-month': '12',
      },
      'coordinate-search': {
        north: '123',
        south: '345',
        east: '678',
        west: '901',
        depth: '1',
      },
    };

    const expectedQuery: IQuery = {
      query: {
        bool: {
          must: [
            {
              query_string: {
                query: 'example',
                default_operator: 'AND',
              },
            },
            {
              range: {
                resourceTemporalExtentDateRange: {
                  gte: '2022-01-01',
                  lte: '2022-12-31',
                },
              },
            },
            {
              geo_shape: {
                geom: {
                  shape: {
                    type: 'envelope',
                    coordinates: [
                      [901, 123],
                      [678, 345],
                    ],
                  },
                  depth: {
                    from: 0,
                    to: 1,
                  },
                  relation: 'intersects',
                  ignore_unmapped: true,
                },
              },
            },
          ],
        },
      },
    };

    const result = buildSearchQuery(searchFieldsObject);

    expect(result).toEqual(expectedQuery);
    expect(result.query.bool.must).toHaveLength(3);
  });

  it('should build the search query correctly with both search term and date range', () => {
    const searchFieldsObject: ISearchFieldsObject = {
      'quick-search': {
        search_term: 'example',
      },
      'date-search': {
        'from-date-year': '2022',
        'from-date-day': '01',
        'from-date-month': '01',
        'to-date-year': '2022',
        'to-date-day': '31',
        'to-date-month': '12',
      },
      'coordinate-search': {
        north: '123',
        south: '345',
        east: '678',
        west: '901',
        depth: '1',
      },
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
                minimum_should_match: 1,
              },
            },
            {
              range: {
                resourceTemporalExtentDateRange: {
                  gte: '2022-01-01',
                  lte: '2022-12-31',
                },
              },
            },
            {
              geo_shape: {
                geom: {
                  shape: {
                    type: 'envelope',
                    coordinates: [
                      [901, 123],
                      [678, 345],
                    ],
                  },
                  depth: {
                    from: 0,
                    to: 1,
                  },
                  relation: 'intersects',
                  ignore_unmapped: true,
                },
              },
            },
          ],
        },
      },
    };

    const result = buildSearchQuery(searchFieldsObject, [
      'field1',
      'field2',
      'field3',
    ]);

    expect(result).toEqual(expectedQuery);
    expect(result.query.bool.must).toHaveLength(3);
  });

  it('should build the search query correctly with only search term', () => {
    const searchFieldsObject: ISearchFieldsObject = {
      'quick-search': {
        search_term: 'example',
      },
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
                minimum_should_match: 1,
              },
            },
          ],
        },
      },
    };

    const result = buildSearchQuery(searchFieldsObject, [
      'field1',
      'field2',
      'field3',
    ]);

    expect(result).toEqual(expectedQuery);
    expect(result.query.bool.must).toHaveLength(1);
  });

  it('should build the search query correctly with only date range', () => {
    const searchFieldsObject: ISearchFieldsObject = {
      'date-search': {
        'from-date-year': '2022',
        'from-date-day': '01',
        'from-date-month': '01',
        'to-date-year': '2022',
        'to-date-day': '31',
        'to-date-month': '12',
      },
    };

    const expectedQuery: IQuery = {
      query: {
        bool: {
          must: [
            {
              range: {
                resourceTemporalExtentDateRange: {
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

  it('should build the search query correctly with only Geo Coordinates with depth', () => {
    const searchFieldsObject: ISearchFieldsObject = {
      'coordinate-search': {
        north: '123',
        south: '345',
        east: '678',
        west: '901',
        depth: '1',
      },
    };

    const expectedQuery: IQuery = {
      query: {
        bool: {
          must: [
            {
              geo_shape: {
                geom: {
                  shape: {
                    type: 'envelope',
                    coordinates: [
                      [901, 123],
                      [678, 345],
                    ],
                  },
                  depth: {
                    from: 0,
                    to: 1,
                  },
                  relation: 'intersects',
                  ignore_unmapped: true,
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

  it('should build the search query correctly with only Geo Coordinates with out depth', () => {
    const searchFieldsObject: ISearchFieldsObject = {
      'coordinate-search': {
        north: '123',
        south: '345',
        east: '678',
        west: '901',
      },
    };

    const expectedQuery: IQuery = {
      query: {
        bool: {
          must: [
            {
              geo_shape: {
                geom: {
                  shape: {
                    type: 'envelope',
                    coordinates: [
                      [901, 123],
                      [678, 345],
                    ],
                  },
                  relation: 'intersects',
                  ignore_unmapped: true,
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

    expect(result.query.bool.must).toEqual([]);
    expect(result).toEqual(expectedQuery);
  });
});
