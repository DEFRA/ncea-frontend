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
        page: 1,
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
                  },
                },
              },
            ],
          },
        },
        size: 20,
        from: 0,
      };

      const result = buildSearchQuery({ searchFieldsObject });

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
        page: 1,
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
                  },
                },
              },
            ],
          },
        },
        size: 20,
        from: 0,
      };

      const result = buildSearchQuery({
        searchFieldsObject,
        fieldsToSearch: ['field1', 'field2', 'field3'],
      });

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
        page: 1,
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
        from: 0,
      };

      const result = buildSearchQuery({
        searchFieldsObject,
        fieldsToSearch: ['field1', 'field2', 'field3'],
      });

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
        page: 1,
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
        from: 0,
      };

      const result = buildSearchQuery({ searchFieldsObject });

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
        page: 1,
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
        from: 0,
      };

      const result = buildSearchQuery({ searchFieldsObject });

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
        page: 1,
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
                  },
                },
              },
            ],
          },
        },
        size: 20,
        from: 0,
      };

      const result = buildSearchQuery({ searchFieldsObject });

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
        page: 1,
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
                  },
                },
              },
            ],
          },
        },
        size: 20,
        from: 0,
      };

      const result = buildSearchQuery({ searchFieldsObject });

      expect(result).toEqual(expectedQuery);
      expect(result.query.bool.must).toHaveLength(1);
    });

    it('should handle missing search fields', () => {
      const searchFieldsObject = {
        fields: {},
        sort: '',
        rowsPerPage: 20,
        filters: {},
        page: 1,
      };

      const expectedQuery = {
        query: {
          bool: {
            must: [],
          },
        },
        size: 20,
        from: 0,
      };

      const result = buildSearchQuery({ searchFieldsObject });

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
        page: 1,
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
        from: 0,
      };

      const result = buildSearchQuery({ searchFieldsObject });

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
        page: 1,
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
        from: 0,
      };

      const result = buildSearchQuery({
        searchFieldsObject,
        fieldsToSearch: ['field1', 'field2', 'field3'],
      });

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
        page: 1,
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
        from: 0,
      };

      const result = buildSearchQuery({
        searchFieldsObject,
        fieldsToSearch: ['field1', 'field2', 'field3'],
      });

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
        page: 1,
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
        from: 0,
      };

      const result = buildSearchQuery({ searchFieldsObject });

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
        page: 1,
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
        from: 0,
      };

      const result = buildSearchQuery({ searchFieldsObject });

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
        page: 1,
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
        from: 0,
      };

      const result = buildSearchQuery({ searchFieldsObject });

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
        page: 1,
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
        from: 0,
      };

      const result = buildSearchQuery({ searchFieldsObject });

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
        page: 1,
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
                  },
                },
              },
            ],
          },
        },
        sort: [recentStudySortScript],
        size: 20,
        from: 0,
      };

      const result = buildSearchQuery({ searchFieldsObject });

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
        page: 1,
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
                  },
                },
              },
            ],
          },
        },
        sort: [recentStudySortScript],
        size: 20,
        from: 0,
      };

      const result = buildSearchQuery({
        searchFieldsObject,
        fieldsToSearch: ['field1', 'field2', 'field3'],
      });

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
        page: 1,
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
        from: 0,
      };

      const result = buildSearchQuery({
        searchFieldsObject,
        fieldsToSearch: ['field1', 'field2', 'field3'],
      });

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
        page: 1,
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
        from: 0,
      };

      const result = buildSearchQuery({ searchFieldsObject });

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
        page: 1,
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
        from: 0,
      };

      const result = buildSearchQuery({ searchFieldsObject });

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
        page: 1,
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
                  },
                },
              },
            ],
          },
        },
        sort: [recentStudySortScript],
        size: 20,
        from: 0,
      };

      const result = buildSearchQuery({ searchFieldsObject });

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
        page: 1,
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
                  },
                },
              },
            ],
          },
        },
        sort: [recentStudySortScript],
        size: 20,
        from: 0,
      };

      const result = buildSearchQuery({ searchFieldsObject });

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
        page: 1,
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
        from: 0,
      };

      const result = buildSearchQuery({ searchFieldsObject });

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
        page: 1,
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
        from: 0,
      };

      const result = buildSearchQuery({
        searchFieldsObject,
        fieldsToSearch: ['field1', 'field2', 'field3'],
      });

      expect(result).toEqual(expectedQuery);
      expect(result.query.bool.must).toHaveLength(3);
    });
  });
  describe('Search query with pagination', () => {
    it('should build the search query correctly with pagination for page 1', () => {
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
        rowsPerPage: 20,
        filters: {},
        page: 1,
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
        from: 0,
      };

      const result = buildSearchQuery({ searchFieldsObject });

      expect(result).toEqual(expectedQuery);
      expect(result.query.bool.must).toHaveLength(3);
    });

    it('should build the search query correctly with pagination for page 5', () => {
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
        rowsPerPage: 20,
        page: 5,
        filters: {},
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
        from: 80,
      };

      const result = buildSearchQuery({
        searchFieldsObject,
        fieldsToSearch: ['field1', 'field2', 'field3'],
      });

      expect(result).toEqual(expectedQuery);
      expect(result.query.bool.must).toHaveLength(3);
    });
  });

  describe('Search query with filters', () => {
    it('should build the search query when filter resourceType is all', () => {
      const searchFieldsObject: ISearchPayload = {
        fields: {
          'quick-search': {
            search_term: 'example',
          },
        },
        sort: 'best_match',
        filters: { resourceType: 'all' },
        rowsPerPage: 20,
        page: 1,
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
        from: 0,
      };

      const result = buildSearchQuery({ searchFieldsObject });
      const filteredOptions = Object.keys(searchFieldsObject.filters).filter(
        (key) => searchFieldsObject.filters[key] !== 'all',
      );

      expect(result).toEqual(expectedQuery);
      expect(result.query.bool.must).toHaveLength(1);

      expect(filteredOptions).not.toContain('resourceType');
      expect(filteredOptions.length).toBe(0);
    });

    it('should build the search query when filter resourceType as dataset', () => {
      const searchFieldsObject: ISearchPayload = {
        fields: {
          'quick-search': {
            search_term: 'example',
          },
        },
        sort: 'best_match',
        filters: { resourceType: 'dataset' },
        rowsPerPage: 20,
        page: 1,
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
                bool: {
                  should: [{ match: { resourceType: 'dataset' } }],
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
        from: 0,
      };

      const result = buildSearchQuery({
        searchFieldsObject,
        ignoreAggregation: true,
      });

      expect(result).toEqual(expectedQuery);
      expect(result.query.bool.must).toHaveLength(2);
    });
  });

  describe('Search query for resourceType aggregations', () => {
    it('should build the search query for resourceType aggregation', () => {
      const aggregationField = 'resourceType';
      const searchFieldsObject: ISearchPayload = {
        fields: {
          'quick-search': {
            search_term: 'example',
          },
        },
        sort: 'best_match',
        filters: { resourceType: 'all' },
        rowsPerPage: 20,
        page: 1,
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
        aggs: {
          unique_values: {
            terms: {
              field: aggregationField,
            },
          },
        },
        size: 0,
        from: 0,
      };

      const result = buildSearchQuery({
        searchFieldsObject,
        aggregationField,
      });

      expect(result).toEqual(expectedQuery);
      expect(result.query.bool.must).toHaveLength(1);
    });
  });

  describe('Search query for count', () => {
    it('should build the search query to get only count of documents', () => {
      const searchFieldsObject: ISearchPayload = {
        fields: {
          'quick-search': {
            search_term: 'example',
          },
        },
        sort: 'best_match',
        filters: { resourceType: 'all' },
        rowsPerPage: 20,
        page: 1,
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
        from: 0,
      };

      const result = buildSearchQuery({
        searchFieldsObject,
        isCount: true,
        ignoreAggregation: true,
      });

      expect(result).toEqual(expectedQuery);
      expect(result.query.bool.must).toHaveLength(1);
    });
  });

  describe('Search query to fetch single document details', () => {
    it('should build query with docId to fetch single document details', async () => {
      const result = buildSearchQuery({ docId: '12313-123232-1231231' });

      const expectedQuery: IQuery = {
        query: {
          bool: {
            must: [
              {
                bool: {
                  should: [
                    {
                      match: {
                        _id: '12313-123232-1231231',
                      },
                    },
                  ],
                  minimum_should_match: 1,
                },
              },
            ],
          },
        },
      };

      expect(result).toEqual(expectedQuery);
      expect(result.query.bool.must).toHaveLength(1);
    });

    it('should not consider docId when fields are present', async () => {
      const searchFieldsObject: ISearchPayload = {
        fields: {
          'quick-search': {
            search_term: 'example',
          },
        },
        sort: 'best_match',
        filters: { resourceType: 'all' },
        rowsPerPage: 20,
        page: 1,
      };

      const result = buildSearchQuery({
        searchFieldsObject,
        docId: '12313-123232-1231231',
        isCount: true,
        ignoreAggregation: true,
      });

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
        from: 0,
      };

      expect(result).toEqual(expectedQuery);
      expect(result.query.bool.must).toHaveLength(1);
    });
  });
});
