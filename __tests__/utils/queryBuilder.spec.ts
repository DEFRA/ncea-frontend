import {
  IQuery,
  ISearchPayload,
} from '../../src/interfaces/queryBuilder.interface';
import {
  buildCustomSortScriptForStudyPeriod,
  buildSearchQuery,
} from '../../src/utils/queryBuilder';

const recentStudySortScript = buildCustomSortScriptForStudyPeriod();

describe('Build the search query', () => {
  describe('Search query without sort', () => {
    it('should build the search query correctly with date range and when fields are not provided', () => {
      const searchFieldsObject: ISearchPayload = {
        fields: {
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
        },
        sort: '',
        filters: {},
        rowsPerPage: 20,
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
        size: 20,
      };

      const result = buildSearchQuery(searchFieldsObject, [], false, false);

      expect(result).toEqual(expectedQuery);
      expect(result.query.bool.must).toHaveLength(3);
    });

    it('should build the search query correctly with both search term and date range', () => {
      const searchFieldsObject: ISearchPayload = {
        fields: {
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
        },
        sort: '',
        filters: {},
        rowsPerPage: 20,
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
        size: 20,
      };

      const result = buildSearchQuery(
        searchFieldsObject,
        ['field1', 'field2', 'field3'],
        false,
        false,
      );

      expect(result).toEqual(expectedQuery);
      expect(result.query.bool.must).toHaveLength(3);
    });

    it('should build the search query correctly with only search term', () => {
      const searchFieldsObject: ISearchPayload = {
        fields: {
          'quick-search': {
            search_term: 'example',
          },
        },
        sort: '',
        filters: {},
        rowsPerPage: 20,
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
        size: 20,
      };

      const result = buildSearchQuery(
        searchFieldsObject,
        ['field1', 'field2', 'field3'],
        false,
        false,
      );

      expect(result).toEqual(expectedQuery);
      expect(result.query.bool.must).toHaveLength(1);
    });

    it('should build the search query correctly with only search term without fields', () => {
      const searchFieldsObject: ISearchPayload = {
        fields: {
          'quick-search': {
            search_term: 'example',
          },
        },
        sort: '',
        filters: {},
        rowsPerPage: 20,
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
            ],
          },
        },
        size: 20,
      };

      const result = buildSearchQuery(searchFieldsObject, [], false, false);

      expect(result).toEqual(expectedQuery);
      expect(result.query.bool.must).toHaveLength(1);
    });

    it('should build the search query correctly with only date range', () => {
      const searchFieldsObject: ISearchPayload = {
        fields: {
          'date-search': {
            'from-date-year': '2022',
            'from-date-day': '01',
            'from-date-month': '01',
            'to-date-year': '2022',
            'to-date-day': '31',
            'to-date-month': '12',
          },
        },
        sort: '',
        filters: {},
        rowsPerPage: 20,
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
        size: 20,
      };

      const result = buildSearchQuery(searchFieldsObject, [], false, false);

      expect(result).toEqual(expectedQuery);
      expect(result.query.bool.must).toHaveLength(1);
    });

    it('should build the search query correctly with only Geo Coordinates with depth', () => {
      const searchFieldsObject: ISearchPayload = {
        fields: {
          'coordinate-search': {
            north: '123',
            south: '345',
            east: '678',
            west: '901',
            depth: '1',
          },
        },
        sort: '',
        filters: {},
        rowsPerPage: 20,
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
        size: 20,
      };

      const result = buildSearchQuery(searchFieldsObject, [], false, false);

      expect(result).toEqual(expectedQuery);
      expect(result.query.bool.must).toHaveLength(1);
    });

    it('should build the search query correctly with only Geo Coordinates with out depth', () => {
      const searchFieldsObject: ISearchPayload = {
        fields: {
          'coordinate-search': {
            north: '123',
            south: '345',
            east: '678',
            west: '901',
          },
        },
        sort: '',
        filters: {},
        rowsPerPage: 20,
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
        size: 20,
      };

      const result = buildSearchQuery(searchFieldsObject, [], false, false);

      expect(result).toEqual(expectedQuery);
      expect(result.query.bool.must).toHaveLength(1);
    });

    it('should handle missing search fields', () => {
      const searchFieldsObject = {
        fields: {},
        sort: '',
        rowsPerPage: 20,
        filters: {},
      };

      const expectedQuery = {
        query: {
          bool: {
            must: [],
          },
        },
        size: 20,
      };

      const result = buildSearchQuery(searchFieldsObject, [], false, false);

      expect(result.query.bool.must).toEqual([]);
      expect(result).toEqual(expectedQuery);
    });
  });

  describe('Search query with best match sort', () => {
    it('should build the search query correctly with best match sort when date range and when fields are not provided', () => {
      const searchFieldsObject: ISearchPayload = {
        fields: {
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
        },
        sort: 'best_match',
        filters: {},
        rowsPerPage: 20,
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
        sort: [
          {
            _score: {
              order: 'desc',
            },
          },
        ],
        size: 20,
      };

      const result = buildSearchQuery(searchFieldsObject, [], false, false);

      expect(result).toEqual(expectedQuery);
      expect(result.query.bool.must).toHaveLength(3);
    });

    it('should build the search query correctly with best match sort when both search term and date range', () => {
      const searchFieldsObject: ISearchPayload = {
        fields: {
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
        },
        sort: 'best_match',
        filters: {},
        rowsPerPage: 20,
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
        sort: [
          {
            _score: {
              order: 'desc',
            },
          },
        ],
        size: 20,
      };

      const result = buildSearchQuery(
        searchFieldsObject,
        ['field1', 'field2', 'field3'],
        false,
        false,
      );

      expect(result).toEqual(expectedQuery);
      expect(result.query.bool.must).toHaveLength(3);
    });

    it('should build the search query correctly with best match sort when only search term', () => {
      const searchFieldsObject: ISearchPayload = {
        fields: {
          'quick-search': {
            search_term: 'example',
          },
        },
        sort: 'best_match',
        filters: {},
        rowsPerPage: 20,
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
        sort: [
          {
            _score: {
              order: 'desc',
            },
          },
        ],
        size: 20,
      };

      const result = buildSearchQuery(
        searchFieldsObject,
        ['field1', 'field2', 'field3'],
        false,
        false,
      );

      expect(result).toEqual(expectedQuery);
      expect(result.query.bool.must).toHaveLength(1);
    });

    it('should build the search query correctly with best match sort when only search term without fields', () => {
      const searchFieldsObject: ISearchPayload = {
        fields: {
          'quick-search': {
            search_term: 'example',
          },
        },
        sort: 'best_match',
        filters: {},
        rowsPerPage: 20,
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
            ],
          },
        },
        sort: [
          {
            _score: {
              order: 'desc',
            },
          },
        ],
        size: 20,
      };

      const result = buildSearchQuery(searchFieldsObject, [], false, false);

      expect(result).toEqual(expectedQuery);
      expect(result.query.bool.must).toHaveLength(1);
    });

    it('should build the search query correctly with best match sort when only date range', () => {
      const searchFieldsObject: ISearchPayload = {
        fields: {
          'date-search': {
            'from-date-year': '2022',
            'from-date-day': '01',
            'from-date-month': '01',
            'to-date-year': '2022',
            'to-date-day': '31',
            'to-date-month': '12',
          },
        },
        sort: 'best_match',
        filters: {},
        rowsPerPage: 20,
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
        sort: [
          {
            _score: {
              order: 'desc',
            },
          },
        ],
        size: 20,
      };

      const result = buildSearchQuery(searchFieldsObject, [], false, false);

      expect(result).toEqual(expectedQuery);
      expect(result.query.bool.must).toHaveLength(1);
    });

    it('should build the search query correctly with best match sort when only Geo Coordinates with depth', () => {
      const searchFieldsObject: ISearchPayload = {
        fields: {
          'coordinate-search': {
            north: '123',
            south: '345',
            east: '678',
            west: '901',
            depth: '1',
          },
        },
        sort: 'best_match',
        filters: {},
        rowsPerPage: 20,
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
        sort: [
          {
            _score: {
              order: 'desc',
            },
          },
        ],
        size: 20,
      };

      const result = buildSearchQuery(searchFieldsObject, [], false, false);

      expect(result).toEqual(expectedQuery);
      expect(result.query.bool.must).toHaveLength(1);
    });

    it('should build the search query correctly with best match sort when only Geo Coordinates with out depth', () => {
      const searchFieldsObject: ISearchPayload = {
        fields: {
          'coordinate-search': {
            north: '123',
            south: '345',
            east: '678',
            west: '901',
          },
        },
        sort: 'best_match',
        filters: {},
        rowsPerPage: 20,
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
        sort: [
          {
            _score: {
              order: 'desc',
            },
          },
        ],
        size: 20,
      };

      const result = buildSearchQuery(searchFieldsObject, [], false, false);

      expect(result).toEqual(expectedQuery);
      expect(result.query.bool.must).toHaveLength(1);
    });
  });

  describe('Search query with most recent study sort', () => {
    it('should build the search query correctly with most recent study sort when date range and when fields are not provided', () => {
      const searchFieldsObject: ISearchPayload = {
        fields: {
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
        },
        sort: 'recent_study',
        filters: {},
        rowsPerPage: 20,
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
        sort: [recentStudySortScript],
        size: 20,
      };

      const result = buildSearchQuery(searchFieldsObject, [], false, false);

      expect(result).toEqual(expectedQuery);
      expect(result.query.bool.must).toHaveLength(3);
    });

    it('should build the search query correctly with most recent study sort when both search term and date range', () => {
      const searchFieldsObject: ISearchPayload = {
        fields: {
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
        },
        sort: 'recent_study',
        filters: {},
        rowsPerPage: 20,
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
        sort: [recentStudySortScript],
        size: 20,
      };

      const result = buildSearchQuery(
        searchFieldsObject,
        ['field1', 'field2', 'field3'],
        false,
        false,
      );

      expect(result).toEqual(expectedQuery);
      expect(result.query.bool.must).toHaveLength(3);
    });

    it('should build the search query correctly with most recent study sort when only search term', () => {
      const searchFieldsObject: ISearchPayload = {
        fields: {
          'quick-search': {
            search_term: 'example',
          },
        },
        sort: 'recent_study',
        filters: {},
        rowsPerPage: 20,
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
        sort: [recentStudySortScript],
        size: 20,
      };

      const result = buildSearchQuery(
        searchFieldsObject,
        ['field1', 'field2', 'field3'],
        false,
        false,
      );

      expect(result).toEqual(expectedQuery);
      expect(result.query.bool.must).toHaveLength(1);
    });

    it('should build the search query correctly with most recent study sort when only search term without fields', () => {
      const searchFieldsObject: ISearchPayload = {
        fields: {
          'quick-search': {
            search_term: 'example',
          },
        },
        sort: 'recent_study',
        filters: {},
        rowsPerPage: 20,
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
            ],
          },
        },
        sort: [recentStudySortScript],
        size: 20,
      };

      const result = buildSearchQuery(searchFieldsObject, [], false, false);

      expect(result).toEqual(expectedQuery);
      expect(result.query.bool.must).toHaveLength(1);
    });

    it('should build the search query correctly with most recent study sort when only date range', () => {
      const searchFieldsObject: ISearchPayload = {
        fields: {
          'date-search': {
            'from-date-year': '2022',
            'from-date-day': '01',
            'from-date-month': '01',
            'to-date-year': '2022',
            'to-date-day': '31',
            'to-date-month': '12',
          },
        },
        sort: 'recent_study',
        filters: {},
        rowsPerPage: 20,
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
        sort: [recentStudySortScript],
        size: 20,
      };

      const result = buildSearchQuery(searchFieldsObject, [], false, false);

      expect(result).toEqual(expectedQuery);
      expect(result.query.bool.must).toHaveLength(1);
    });

    it('should build the search query correctly with most recent study sort when only Geo Coordinates with depth', () => {
      const searchFieldsObject: ISearchPayload = {
        fields: {
          'coordinate-search': {
            north: '123',
            south: '345',
            east: '678',
            west: '901',
            depth: '1',
          },
        },
        sort: 'recent_study',
        filters: {},
        rowsPerPage: 20,
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
        sort: [recentStudySortScript],
        size: 20,
      };

      const result = buildSearchQuery(searchFieldsObject, [], false, false);

      expect(result).toEqual(expectedQuery);
      expect(result.query.bool.must).toHaveLength(1);
    });

    it('should build the search query correctly with most recent study sort when only Geo Coordinates with out depth', () => {
      const searchFieldsObject: ISearchPayload = {
        fields: {
          'coordinate-search': {
            north: '123',
            south: '345',
            east: '678',
            west: '901',
          },
        },
        sort: 'recent_study',
        filters: {},
        rowsPerPage: 20,
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
        sort: [recentStudySortScript],
        size: 20,
      };

      const result = buildSearchQuery(searchFieldsObject, [], false, false);

      expect(result).toEqual(expectedQuery);
      expect(result.query.bool.must).toHaveLength(1);
    });
  });

  describe('Search query with results per page', () => {
    it('should build the search query correctly with results per page as 50', () => {
      const searchFieldsObject: ISearchPayload = {
        fields: {
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
        },
        sort: 'best_match',
        filters: {},
        rowsPerPage: 50,
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
        sort: [
          {
            _score: {
              order: 'desc',
            },
          },
        ],
        size: 50,
      };

      const result = buildSearchQuery(searchFieldsObject);

      expect(result).toEqual(expectedQuery);
      expect(result.query.bool.must).toHaveLength(3);
    });

    it('should build the search query correctly with results per page as 100', () => {
      const searchFieldsObject: ISearchPayload = {
        fields: {
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
        },
        sort: 'best_match',
        filters: {},
        rowsPerPage: 100,
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
        sort: [
          {
            _score: {
              order: 'desc',
            },
          },
        ],
        size: 100,
      };

      const result = buildSearchQuery(searchFieldsObject, [
        'field1',
        'field2',
        'field3',
      ]);

      expect(result).toEqual(expectedQuery);
      expect(result.query.bool.must).toHaveLength(3);
    });
  });
});
