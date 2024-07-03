import { estypes } from '@elastic/elasticsearch';
import { ISearchPayload } from '../../src/interfaces/queryBuilder.interface';
import {
  resourceTypeFilterField,
  studyPeriodFilterField,
} from '../../src/utils/constants';
import {
  buildCustomSortScriptForStudyPeriod,
  generateFilterQuery,
  generateSearchQuery,
} from '../../src/utils/queryBuilder';

const oldestStudySortScript = buildCustomSortScriptForStudyPeriod('asc');
const newestStudySortScript = buildCustomSortScriptForStudyPeriod('desc');

describe('Build the search query', () => {
  describe('Search query without sort', () => {
    it('should build the search query correctly with date range and when fields are not provided', () => {
      const searchFieldsObject: ISearchPayload = {
        fields: {
          keyword: {
            q: 'example',
          },
          date: {
            fdy: '2022',
            fdd: '01',
            fdm: '01',
            tdy: '2022',
            tdd: '31',
            tdm: '12',
          },
          extent: {
            nth: '123',
            sth: '345',
            est: '678',
            wst: '901',
          },
        },
        sort: '',
        filters: {},
        rowsPerPage: 20,
        page: 1,
      };

      const expectedQuery: estypes.SearchRequest = {
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
            filter: [
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

              {
                bool: {
                  should: [
                    {
                      bool: {
                        must: [
                          { range: { 'resourceTemporalExtentDetails.start.date': { lte: '2022-01-01' } } },
                          { range: { 'resourceTemporalExtentDetails.end.date': { gte: '2022-01-01' } } },
                        ],
                      },
                    },
                    {
                      bool: {
                        must: [
                          { range: { 'resourceTemporalExtentDetails.start.date': { gte: '2022-01-01' } } },
                          { range: { 'resourceTemporalExtentDetails.end.date': { lte: '2022-12-31' } } },
                        ],
                      },
                    },
                    {
                      bool: {
                        must: [
                          { range: { 'resourceTemporalExtentDetails.start.date': { gte: '2022-01-01' } } },
                          { range: { 'resourceTemporalExtentDetails.start.date': { lte: '2022-12-31' } } },
                        ],
                      },
                    },
                  ],
                  minimum_should_match: 1,
                },
              },
            ],
          },
        },
        size: 20,
        from: 0,
        _source: [],
      };

      const result = generateSearchQuery({ searchFieldsObject });

      expect(result).toEqual(expectedQuery);
      expect(result?.query?.bool?.must).toHaveLength(1);
      expect(result?.query?.bool?.filter).toHaveLength(2);
    });

    it('should build the search query correctly with both search term and date range', () => {
      const searchFieldsObject: ISearchPayload = {
        fields: {
          keyword: {
            q: 'example',
          },
          date: {
            fdy: '2022',
            fdd: '01',
            fdm: '01',
            tdy: '2022',
            tdd: '31',
            tdm: '12',
          },
          extent: {
            nth: '123',
            sth: '345',
            est: '678',
            wst: '901',
          },
        },
        sort: '',
        filters: {},
        rowsPerPage: 20,
        page: 1,
      };

      const expectedQuery: estypes.SearchRequest = {
        query: {
          bool: {
            must: [
              {
                query_string: {
                  query: 'example',
                  default_operator: 'AND',
                  fields: ['field1', 'field2', 'field3'],
                },
              },
            ],
            filter: [
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
              {
                bool: {
                  should: [
                    {
                      bool: {
                        must: [
                          { range: { 'resourceTemporalExtentDetails.start.date': { lte: '2022-01-01' } } },
                          { range: { 'resourceTemporalExtentDetails.end.date': { gte: '2022-01-01' } } },
                        ],
                      },
                    },
                    {
                      bool: {
                        must: [
                          { range: { 'resourceTemporalExtentDetails.start.date': { gte: '2022-01-01' } } },
                          { range: { 'resourceTemporalExtentDetails.end.date': { lte: '2022-12-31' } } },
                        ],
                      },
                    },
                    {
                      bool: {
                        must: [
                          { range: { 'resourceTemporalExtentDetails.start.date': { gte: '2022-01-01' } } },
                          { range: { 'resourceTemporalExtentDetails.start.date': { lte: '2022-12-31' } } },
                        ],
                      },
                    },
                  ],
                  minimum_should_match: 1,
                },
              },
            ],
          },
        },
        size: 20,
        from: 0,
        _source: [],
      };

      const result = generateSearchQuery({
        searchFieldsObject,
        fieldsToSearch: ['field1', 'field2', 'field3'],
      });

      expect(result).toEqual(expectedQuery);
      expect(result.query?.bool?.must).toHaveLength(1);
      expect(result.query?.bool?.filter).toHaveLength(2);
    });

    it('should build the search query correctly with only search term', () => {
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

      const expectedQuery: estypes.SearchRequest = {
        query: {
          bool: {
            filter: [],
            must: [
              {
                query_string: {
                  query: 'example',
                  default_operator: 'AND',
                  fields: ['field1', 'field2', 'field3'],
                },
              },
            ],
          },
        },
        size: 20,
        from: 0,
        _source: [],
      };

      const result = generateSearchQuery({
        searchFieldsObject,
        fieldsToSearch: ['field1', 'field2', 'field3'],
      });

      expect(result).toEqual(expectedQuery);
      expect(result.query?.bool?.must).toHaveLength(1);
    });

    it('should build the search query correctly with only search term without fields', () => {
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

      const expectedQuery: estypes.SearchRequest = {
        query: {
          bool: {
            filter: [],
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
        _source: [],
      };

      const result = generateSearchQuery({ searchFieldsObject });

      expect(result).toEqual(expectedQuery);
      expect(result.query?.bool?.must).toHaveLength(1);
    });

    it('should build the search query correctly with only date range', () => {
      const searchFieldsObject: ISearchPayload = {
        fields: {
          date: {
            fdy: '2022',
            fdd: '01',
            fdm: '01',
            tdy: '2022',
            tdd: '31',
            tdm: '12',
          },
        },
        sort: '',
        filters: {},
        rowsPerPage: 20,
        page: 1,
      };

      const expectedQuery: estypes.SearchRequest = {
        query: {
          bool: {
            filter: [
              {
                bool: {
                  should: [
                    {
                      bool: {
                        must: [
                          { range: { 'resourceTemporalExtentDetails.start.date': { lte: '2022-01-01' } } },
                          { range: { 'resourceTemporalExtentDetails.end.date': { gte: '2022-01-01' } } },
                        ],
                      },
                    },
                    {
                      bool: {
                        must: [
                          { range: { 'resourceTemporalExtentDetails.start.date': { gte: '2022-01-01' } } },
                          { range: { 'resourceTemporalExtentDetails.end.date': { lte: '2022-12-31' } } },
                        ],
                      },
                    },
                    {
                      bool: {
                        must: [
                          { range: { 'resourceTemporalExtentDetails.start.date': { gte: '2022-01-01' } } },
                          { range: { 'resourceTemporalExtentDetails.start.date': { lte: '2022-12-31' } } },
                        ],
                      },
                    },
                  ],
                  minimum_should_match: 1,
                },
              },
            ],
            must: [],
          },
        },
        size: 20,
        from: 0,
        _source: [],
      };

      const result = generateSearchQuery({ searchFieldsObject });

      expect(result).toEqual(expectedQuery);
      expect(result.query?.bool?.filter).toHaveLength(1);
    });

    it('should build the search query correctly with only Geo Coordinates with out dpt', () => {
      const searchFieldsObject: ISearchPayload = {
        fields: {
          extent: {
            nth: '123',
            sth: '345',
            est: '678',
            wst: '901',
          },
        },
        sort: '',
        filters: {},
        rowsPerPage: 20,
        page: 1,
      };

      const expectedQuery: estypes.SearchRequest = {
        query: {
          bool: {
            filter: [
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
            must: [],
          },
        },
        size: 20,
        from: 0,
        _source: [],
      };

      const result = generateSearchQuery({ searchFieldsObject });

      expect(result).toEqual(expectedQuery);
      expect(result.query?.bool?.filter).toHaveLength(1);
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
            filter: [],
          },
        },
        size: 20,
        from: 0,
        _source: [],
      };

      const result = generateSearchQuery({ searchFieldsObject });

      expect(result.query?.bool?.must).toEqual([]);
      expect(result.query?.bool?.filter).toEqual([]);
      expect(result).toEqual(expectedQuery);
    });
  });

  describe('Search query with best match sort', () => {
    it('should build the search query correctly with best match sort when date range and when fields are not provided', () => {
      const searchFieldsObject: ISearchPayload = {
        fields: {
          keyword: {
            q: 'example',
          },
          date: {
            fdy: '2022',
            fdd: '01',
            fdm: '01',
            tdy: '2022',
            tdd: '31',
            tdm: '12',
          },
          extent: {
            nth: '123',
            sth: '345',
            est: '678',
            wst: '901',
          },
        },
        sort: 'best_match',
        filters: {},
        rowsPerPage: 20,
        page: 1,
      };

      const expectedQuery: estypes.SearchRequest = {
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
            filter: [
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
              {
                bool: {
                  should: [
                    {
                      bool: {
                        must: [
                          { range: { 'resourceTemporalExtentDetails.start.date': { lte: '2022-01-01' } } },
                          { range: { 'resourceTemporalExtentDetails.end.date': { gte: '2022-01-01' } } },
                        ],
                      },
                    },
                    {
                      bool: {
                        must: [
                          { range: { 'resourceTemporalExtentDetails.start.date': { gte: '2022-01-01' } } },
                          { range: { 'resourceTemporalExtentDetails.end.date': { lte: '2022-12-31' } } },
                        ],
                      },
                    },
                    {
                      bool: {
                        must: [
                          { range: { 'resourceTemporalExtentDetails.start.date': { gte: '2022-01-01' } } },
                          { range: { 'resourceTemporalExtentDetails.start.date': { lte: '2022-12-31' } } },
                        ],
                      },
                    },
                  ],
                  minimum_should_match: 1,
                },
              },
            ],
          },
        },
        sort: {
          _score: {
            order: 'desc',
          },
        },
        size: 20,
        from: 0,
        _source: [],
      };

      const result = generateSearchQuery({ searchFieldsObject });

      expect(result).toEqual(expectedQuery);
      expect(result.query?.bool?.must).toHaveLength(1);
      expect(result.query?.bool?.filter).toHaveLength(2);
    });

    it('should build the search query correctly with best match sort when both search term and date range', () => {
      const searchFieldsObject: ISearchPayload = {
        fields: {
          keyword: {
            q: 'example',
          },
          date: {
            fdy: '2022',
            fdd: '01',
            fdm: '01',
            tdy: '2022',
            tdd: '31',
            tdm: '12',
          },
          extent: {
            nth: '123',
            sth: '345',
            est: '678',
            wst: '901',
          },
        },
        sort: 'best_match',
        filters: {},
        rowsPerPage: 20,
        page: 1,
      };

      const expectedQuery: estypes.SearchRequest = {
        query: {
          bool: {
            must: [
              {
                query_string: {
                  query: 'example',
                  default_operator: 'AND',
                  fields: ['field1', 'field2', 'field3'],
                },
              },
            ],
            filter: [
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
              {
                bool: {
                  should: [
                    {
                      bool: {
                        must: [
                          { range: { 'resourceTemporalExtentDetails.start.date': { lte: '2022-01-01' } } },
                          { range: { 'resourceTemporalExtentDetails.end.date': { gte: '2022-01-01' } } },
                        ],
                      },
                    },
                    {
                      bool: {
                        must: [
                          { range: { 'resourceTemporalExtentDetails.start.date': { gte: '2022-01-01' } } },
                          { range: { 'resourceTemporalExtentDetails.end.date': { lte: '2022-12-31' } } },
                        ],
                      },
                    },
                    {
                      bool: {
                        must: [
                          { range: { 'resourceTemporalExtentDetails.start.date': { gte: '2022-01-01' } } },
                          { range: { 'resourceTemporalExtentDetails.start.date': { lte: '2022-12-31' } } },
                        ],
                      },
                    },
                  ],
                  minimum_should_match: 1,
                },
              },
            ],
          },
        },
        sort: {
          _score: {
            order: 'desc',
          },
        },
        size: 20,
        from: 0,
        _source: [],
      };

      const result = generateSearchQuery({
        searchFieldsObject,
        fieldsToSearch: ['field1', 'field2', 'field3'],
      });

      expect(result).toEqual(expectedQuery);
      expect(result.query?.bool?.must).toHaveLength(1);
      expect(result.query?.bool?.filter).toHaveLength(2);
    });

    it('should build the search query correctly with best match sort when only search term', () => {
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

      const expectedQuery: estypes.SearchRequest = {
        query: {
          bool: {
            filter: [],
            must: [
              {
                query_string: {
                  query: 'example',
                  default_operator: 'AND',
                  fields: ['field1', 'field2', 'field3'],
                },
              },
            ],
          },
        },
        sort: {
          _score: {
            order: 'desc',
          },
        },
        size: 20,
        from: 0,
        _source: [],
      };

      const result = generateSearchQuery({
        searchFieldsObject,
        fieldsToSearch: ['field1', 'field2', 'field3'],
      });

      expect(result).toEqual(expectedQuery);
      expect(result.query?.bool?.must).toHaveLength(1);
    });

    it('should build the search query correctly with best match sort when only search term without fields', () => {
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

      const expectedQuery: estypes.SearchRequest = {
        query: {
          bool: {
            filter: [],
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
        sort: {
          _score: {
            order: 'desc',
          },
        },
        size: 20,
        from: 0,
        _source: [],
      };

      const result = generateSearchQuery({ searchFieldsObject });

      expect(result).toEqual(expectedQuery);
      expect(result.query?.bool?.must).toHaveLength(1);
    });

    it('should build the search query correctly with best match sort when only date range', () => {
      const searchFieldsObject: ISearchPayload = {
        fields: {
          date: {
            fdy: '2022',
            fdd: '01',
            fdm: '01',
            tdy: '2022',
            tdd: '31',
            tdm: '12',
          },
        },
        sort: 'best_match',
        filters: {},
        rowsPerPage: 20,
        page: 1,
      };

      const expectedQuery: estypes.SearchRequest = {
        query: {
          bool: {
            filter: [
              {
                bool: {
                  should: [
                    {
                      bool: {
                        must: [
                          { range: { 'resourceTemporalExtentDetails.start.date': { lte: '2022-01-01' } } },
                          { range: { 'resourceTemporalExtentDetails.end.date': { gte: '2022-01-01' } } },
                        ],
                      },
                    },
                    {
                      bool: {
                        must: [
                          { range: { 'resourceTemporalExtentDetails.start.date': { gte: '2022-01-01' } } },
                          { range: { 'resourceTemporalExtentDetails.end.date': { lte: '2022-12-31' } } },
                        ],
                      },
                    },
                    {
                      bool: {
                        must: [
                          { range: { 'resourceTemporalExtentDetails.start.date': { gte: '2022-01-01' } } },
                          { range: { 'resourceTemporalExtentDetails.start.date': { lte: '2022-12-31' } } },
                        ],
                      },
                    },
                  ],
                  minimum_should_match: 1,
                },
              },
            ],
            must: [],
          },
        },
        sort: {
          _score: {
            order: 'desc',
          },
        },
        size: 20,
        from: 0,
        _source: [],
      };

      const result = generateSearchQuery({ searchFieldsObject });

      expect(result).toEqual(expectedQuery);
      expect(result.query?.bool?.filter).toHaveLength(1);
    });

    it('should build the search query correctly with best match sort when only Geo Coordinates with out dpt', () => {
      const searchFieldsObject: ISearchPayload = {
        fields: {
          extent: {
            nth: '123',
            sth: '345',
            est: '678',
            wst: '901',
          },
        },
        sort: 'best_match',
        filters: {},
        rowsPerPage: 20,
        page: 1,
      };

      const expectedQuery: estypes.SearchRequest = {
        query: {
          bool: {
            filter: [
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
            must: [],
          },
        },
        sort: {
          _score: {
            order: 'desc',
          },
        },
        size: 20,
        from: 0,
        _source: [],
      };

      const result = generateSearchQuery({ searchFieldsObject });

      expect(result).toEqual(expectedQuery);
      expect(result.query?.bool?.filter).toHaveLength(1);
    });
  });

  describe('Search query with Oldest study period sort', () => {
    it('should build the search query correctly with Oldest study period sort when date range and when fields are not provided', () => {
      const searchFieldsObject: ISearchPayload = {
        fields: {
          keyword: {
            q: 'example',
          },
          date: {
            fdy: '2022',
            fdd: '01',
            fdm: '01',
            tdy: '2022',
            tdd: '31',
            tdm: '12',
          },
          extent: {
            nth: '123',
            sth: '345',
            est: '678',
            wst: '901',
          },
        },
        sort: 'oldest_study_period',
        filters: {},
        rowsPerPage: 20,
        page: 1,
      };

      const expectedQuery: estypes.SearchRequest = {
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
            filter: [
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
              {
                bool: {
                  should: [
                    {
                      bool: {
                        must: [
                          { range: { 'resourceTemporalExtentDetails.start.date': { lte: '2022-01-01' } } },
                          { range: { 'resourceTemporalExtentDetails.end.date': { gte: '2022-01-01' } } },
                        ],
                      },
                    },
                    {
                      bool: {
                        must: [
                          { range: { 'resourceTemporalExtentDetails.start.date': { gte: '2022-01-01' } } },
                          { range: { 'resourceTemporalExtentDetails.end.date': { lte: '2022-12-31' } } },
                        ],
                      },
                    },
                    {
                      bool: {
                        must: [
                          { range: { 'resourceTemporalExtentDetails.start.date': { gte: '2022-01-01' } } },
                          { range: { 'resourceTemporalExtentDetails.start.date': { lte: '2022-12-31' } } },
                        ],
                      },
                    },
                  ],
                  minimum_should_match: 1,
                },
              },
            ],
          },
        },
        sort: oldestStudySortScript,
        size: 20,
        from: 0,
        _source: [],
      };

      const result = generateSearchQuery({ searchFieldsObject });

      expect(result).toEqual(expectedQuery);
      expect(result.query?.bool?.must).toHaveLength(1);
      expect(result.query?.bool?.filter).toHaveLength(2);
    });

    it('should build the search query correctly with Oldest study period sort when both search term and date range', () => {
      const searchFieldsObject: ISearchPayload = {
        fields: {
          keyword: {
            q: 'example',
          },
          date: {
            fdy: '2022',
            fdd: '01',
            fdm: '01',
            tdy: '2022',
            tdd: '31',
            tdm: '12',
          },
          extent: {
            nth: '123',
            sth: '345',
            est: '678',
            wst: '901',
          },
        },
        sort: 'oldest_study_period',
        filters: {},
        rowsPerPage: 20,
        page: 1,
      };

      const expectedQuery: estypes.SearchRequest = {
        query: {
          bool: {
            must: [
              {
                query_string: {
                  query: 'example',
                  default_operator: 'AND',
                  fields: ['field1', 'field2', 'field3'],
                },
              },
            ],
            filter: [
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
              {
                bool: {
                  should: [
                    {
                      bool: {
                        must: [
                          { range: { 'resourceTemporalExtentDetails.start.date': { lte: '2022-01-01' } } },
                          { range: { 'resourceTemporalExtentDetails.end.date': { gte: '2022-01-01' } } },
                        ],
                      },
                    },
                    {
                      bool: {
                        must: [
                          { range: { 'resourceTemporalExtentDetails.start.date': { gte: '2022-01-01' } } },
                          { range: { 'resourceTemporalExtentDetails.end.date': { lte: '2022-12-31' } } },
                        ],
                      },
                    },
                    {
                      bool: {
                        must: [
                          { range: { 'resourceTemporalExtentDetails.start.date': { gte: '2022-01-01' } } },
                          { range: { 'resourceTemporalExtentDetails.start.date': { lte: '2022-12-31' } } },
                        ],
                      },
                    },
                  ],
                  minimum_should_match: 1,
                },
              },
            ],
          },
        },
        sort: oldestStudySortScript,
        size: 20,
        from: 0,
        _source: [],
      };

      const result = generateSearchQuery({
        searchFieldsObject,
        fieldsToSearch: ['field1', 'field2', 'field3'],
      });

      expect(result).toEqual(expectedQuery);
      expect(result.query?.bool?.must).toHaveLength(1);
      expect(result.query?.bool?.filter).toHaveLength(2);
    });

    it('should build the search query correctly with Oldest study period sort when only search term', () => {
      const searchFieldsObject: ISearchPayload = {
        fields: {
          keyword: {
            q: 'example',
          },
        },
        sort: 'oldest_study_period',
        filters: {},
        rowsPerPage: 20,
        page: 1,
      };

      const expectedQuery: estypes.SearchRequest = {
        query: {
          bool: {
            filter: [],
            must: [
              {
                query_string: {
                  query: 'example',
                  default_operator: 'AND',
                  fields: ['field1', 'field2', 'field3'],
                },
              },
            ],
          },
        },
        sort: oldestStudySortScript,
        size: 20,
        from: 0,
        _source: [],
      };

      const result = generateSearchQuery({
        searchFieldsObject,
        fieldsToSearch: ['field1', 'field2', 'field3'],
      });

      expect(result).toEqual(expectedQuery);
      expect(result.query?.bool?.must).toHaveLength(1);
    });

    it('should build the search query correctly with Oldest study period sort when only search term without fields', () => {
      const searchFieldsObject: ISearchPayload = {
        fields: {
          keyword: {
            q: 'example',
          },
        },
        sort: 'oldest_study_period',
        filters: {},
        rowsPerPage: 20,
        page: 1,
      };

      const expectedQuery: estypes.SearchRequest = {
        query: {
          bool: {
            filter: [],
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
        sort: oldestStudySortScript,
        size: 20,
        from: 0,
        _source: [],
      };

      const result = generateSearchQuery({ searchFieldsObject });

      expect(result).toEqual(expectedQuery);
      expect(result.query?.bool?.must).toHaveLength(1);
    });

    it('should build the search query correctly with Oldest study period sort when only date range', () => {
      const searchFieldsObject: ISearchPayload = {
        fields: {
          date: {
            fdy: '2022',
            fdd: '01',
            fdm: '01',
            tdy: '2022',
            tdd: '31',
            tdm: '12',
          },
        },
        sort: 'oldest_study_period',
        filters: {},
        rowsPerPage: 20,
        page: 1,
      };

      const expectedQuery: estypes.SearchRequest = {
        query: {
          bool: {
            filter: [
              {
                bool: {
                  should: [
                    {
                      bool: {
                        must: [
                          { range: { 'resourceTemporalExtentDetails.start.date': { lte: '2022-01-01' } } },
                          { range: { 'resourceTemporalExtentDetails.end.date': { gte: '2022-01-01' } } },
                        ],
                      },
                    },
                    {
                      bool: {
                        must: [
                          { range: { 'resourceTemporalExtentDetails.start.date': { gte: '2022-01-01' } } },
                          { range: { 'resourceTemporalExtentDetails.end.date': { lte: '2022-12-31' } } },
                        ],
                      },
                    },
                    {
                      bool: {
                        must: [
                          { range: { 'resourceTemporalExtentDetails.start.date': { gte: '2022-01-01' } } },
                          { range: { 'resourceTemporalExtentDetails.start.date': { lte: '2022-12-31' } } },
                        ],
                      },
                    },
                  ],
                  minimum_should_match: 1,
                },
              },
            ],
            must: [],
          },
        },
        sort: oldestStudySortScript,
        size: 20,
        from: 0,
        _source: [],
      };

      const result = generateSearchQuery({ searchFieldsObject });

      expect(result).toEqual(expectedQuery);
      expect(result.query?.bool?.must).toHaveLength(0);
      expect(result.query?.bool?.filter).toHaveLength(1);
    });

    it('should build the search query correctly with Oldest study period sort when only Geo Coordinates with out dpt', () => {
      const searchFieldsObject: ISearchPayload = {
        fields: {
          extent: {
            nth: '123',
            sth: '345',
            est: '678',
            wst: '901',
          },
        },
        sort: 'oldest_study_period',
        filters: {},
        rowsPerPage: 20,
        page: 1,
      };

      const expectedQuery: estypes.SearchRequest = {
        query: {
          bool: {
            filter: [
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
            must: [],
          },
        },
        sort: oldestStudySortScript,
        size: 20,
        from: 0,
        _source: [],
      };

      const result = generateSearchQuery({ searchFieldsObject });

      expect(result).toEqual(expectedQuery);
      expect(result.query?.bool?.filter).toHaveLength(1);
      expect(result.query?.bool?.must).toHaveLength(0);
    });
  });

  describe('Search query with Newest study period sort', () => {
    it('should build the search query correctly with Newest study period sort when date range and when fields are not provided', () => {
      const searchFieldsObject: ISearchPayload = {
        fields: {
          keyword: {
            q: 'example',
          },
          date: {
            fdy: '2022',
            fdd: '01',
            fdm: '01',
            tdy: '2022',
            tdd: '31',
            tdm: '12',
          },
          extent: {
            nth: '123',
            sth: '345',
            est: '678',
            wst: '901',
          },
        },
        sort: 'newest_study_period',
        filters: {},
        rowsPerPage: 20,
        page: 1,
      };

      const expectedQuery: estypes.SearchRequest = {
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
            filter: [
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
              {
                bool: {
                  should: [
                    {
                      bool: {
                        must: [
                          { range: { 'resourceTemporalExtentDetails.start.date': { lte: '2022-01-01' } } },
                          { range: { 'resourceTemporalExtentDetails.end.date': { gte: '2022-01-01' } } },
                        ],
                      },
                    },
                    {
                      bool: {
                        must: [
                          { range: { 'resourceTemporalExtentDetails.start.date': { gte: '2022-01-01' } } },
                          { range: { 'resourceTemporalExtentDetails.end.date': { lte: '2022-12-31' } } },
                        ],
                      },
                    },
                    {
                      bool: {
                        must: [
                          { range: { 'resourceTemporalExtentDetails.start.date': { gte: '2022-01-01' } } },
                          { range: { 'resourceTemporalExtentDetails.start.date': { lte: '2022-12-31' } } },
                        ],
                      },
                    },
                  ],
                  minimum_should_match: 1,
                },
              },
            ],
          },
        },
        sort: newestStudySortScript,
        size: 20,
        from: 0,
        _source: [],
      };

      const result = generateSearchQuery({ searchFieldsObject });

      expect(result).toEqual(expectedQuery);
      expect(result.query?.bool?.must).toHaveLength(1);
      expect(result.query?.bool?.filter).toHaveLength(2);
    });

    it('should build the search query correctly with Newest study period sort when both search term and date range', () => {
      const searchFieldsObject: ISearchPayload = {
        fields: {
          keyword: {
            q: 'example',
          },
          date: {
            fdy: '2022',
            fdd: '01',
            fdm: '01',
            tdy: '2022',
            tdd: '31',
            tdm: '12',
          },
          extent: {
            nth: '123',
            sth: '345',
            est: '678',
            wst: '901',
          },
        },
        sort: 'newest_study_period',
        filters: {},
        rowsPerPage: 20,
        page: 1,
      };

      const expectedQuery: estypes.SearchRequest = {
        query: {
          bool: {
            must: [
              {
                query_string: {
                  query: 'example',
                  default_operator: 'AND',
                  fields: ['field1', 'field2', 'field3'],
                },
              },
            ],
            filter: [
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
              {
                bool: {
                  should: [
                    {
                      bool: {
                        must: [
                          { range: { 'resourceTemporalExtentDetails.start.date': { lte: '2022-01-01' } } },
                          { range: { 'resourceTemporalExtentDetails.end.date': { gte: '2022-01-01' } } },
                        ],
                      },
                    },
                    {
                      bool: {
                        must: [
                          { range: { 'resourceTemporalExtentDetails.start.date': { gte: '2022-01-01' } } },
                          { range: { 'resourceTemporalExtentDetails.end.date': { lte: '2022-12-31' } } },
                        ],
                      },
                    },
                    {
                      bool: {
                        must: [
                          { range: { 'resourceTemporalExtentDetails.start.date': { gte: '2022-01-01' } } },
                          { range: { 'resourceTemporalExtentDetails.start.date': { lte: '2022-12-31' } } },
                        ],
                      },
                    },
                  ],
                  minimum_should_match: 1,
                },
              },
            ],
          },
        },
        sort: newestStudySortScript,
        size: 20,
        from: 0,
        _source: [],
      };

      const result = generateSearchQuery({
        searchFieldsObject,
        fieldsToSearch: ['field1', 'field2', 'field3'],
      });

      expect(result).toEqual(expectedQuery);
      expect(result.query?.bool?.must).toHaveLength(1);
      expect(result.query?.bool?.filter).toHaveLength(2);
    });

    it('should build the search query correctly with Newest study period sort when only search term', () => {
      const searchFieldsObject: ISearchPayload = {
        fields: {
          keyword: {
            q: 'example',
          },
        },
        sort: 'newest_study_period',
        filters: {},
        rowsPerPage: 20,
        page: 1,
      };

      const expectedQuery: estypes.SearchRequest = {
        query: {
          bool: {
            filter: [],
            must: [
              {
                query_string: {
                  query: 'example',
                  default_operator: 'AND',
                  fields: ['field1', 'field2', 'field3'],
                },
              },
            ],
          },
        },
        sort: newestStudySortScript,
        size: 20,
        from: 0,
        _source: [],
      };

      const result = generateSearchQuery({
        searchFieldsObject,
        fieldsToSearch: ['field1', 'field2', 'field3'],
      });

      expect(result).toEqual(expectedQuery);
      expect(result.query?.bool?.must).toHaveLength(1);
    });

    it('should build the search query correctly with Newest study period sort when only search term without fields', () => {
      const searchFieldsObject: ISearchPayload = {
        fields: {
          keyword: {
            q: 'example',
          },
        },
        sort: 'newest_study_period',
        filters: {},
        rowsPerPage: 20,
        page: 1,
      };

      const expectedQuery: estypes.SearchRequest = {
        query: {
          bool: {
            filter: [],
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
        sort: newestStudySortScript,
        size: 20,
        from: 0,
        _source: [],
      };

      const result = generateSearchQuery({ searchFieldsObject });

      expect(result).toEqual(expectedQuery);
      expect(result.query?.bool?.must).toHaveLength(1);
    });

    it('should build the search query correctly with Newest study period sort when only date range', () => {
      const searchFieldsObject: ISearchPayload = {
        fields: {
          date: {
            fdy: '2022',
            fdd: '01',
            fdm: '01',
            tdy: '2022',
            tdd: '31',
            tdm: '12',
          },
        },
        sort: 'newest_study_period',
        filters: {},
        rowsPerPage: 20,
        page: 1,
      };

      const expectedQuery: estypes.SearchRequest = {
        query: {
          bool: {
            filter: [
              {
                bool: {
                  should: [
                    {
                      bool: {
                        must: [
                          { range: { 'resourceTemporalExtentDetails.start.date': { lte: '2022-01-01' } } },
                          { range: { 'resourceTemporalExtentDetails.end.date': { gte: '2022-01-01' } } },
                        ],
                      },
                    },
                    {
                      bool: {
                        must: [
                          { range: { 'resourceTemporalExtentDetails.start.date': { gte: '2022-01-01' } } },
                          { range: { 'resourceTemporalExtentDetails.end.date': { lte: '2022-12-31' } } },
                        ],
                      },
                    },
                    {
                      bool: {
                        must: [
                          { range: { 'resourceTemporalExtentDetails.start.date': { gte: '2022-01-01' } } },
                          { range: { 'resourceTemporalExtentDetails.start.date': { lte: '2022-12-31' } } },
                        ],
                      },
                    },
                  ],
                  minimum_should_match: 1,
                },
              },
            ],
            must: [],
          },
        },
        sort: newestStudySortScript,
        size: 20,
        from: 0,
        _source: [],
      };

      const result = generateSearchQuery({ searchFieldsObject });

      expect(result).toEqual(expectedQuery);
      expect(result.query?.bool?.must).toHaveLength(0);
      expect(result.query?.bool?.filter).toHaveLength(1);
    });

    it('should build the search query correctly with Newest study period sort when only Geo Coordinates with out dpt', () => {
      const searchFieldsObject: ISearchPayload = {
        fields: {
          extent: {
            nth: '123',
            sth: '345',
            est: '678',
            wst: '901',
          },
        },
        sort: 'newest_study_period',
        filters: {},
        rowsPerPage: 20,
        page: 1,
      };

      const expectedQuery: estypes.SearchRequest = {
        query: {
          bool: {
            filter: [
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
            must: [],
          },
        },
        sort: newestStudySortScript,
        size: 20,
        from: 0,
        _source: [],
      };

      const result = generateSearchQuery({ searchFieldsObject });

      expect(result).toEqual(expectedQuery);
      expect(result.query?.bool?.filter).toHaveLength(1);
      expect(result.query?.bool?.must).toHaveLength(0);
    });
  });

  describe('Search query with results per page', () => {
    it('should build the search query correctly with results per page as 50', () => {
      const searchFieldsObject: ISearchPayload = {
        fields: {
          keyword: {
            q: 'example',
          },
          date: {
            fdy: '2022',
            fdd: '01',
            fdm: '01',
            tdy: '2022',
            tdd: '31',
            tdm: '12',
          },
          extent: {
            nth: '123',
            sth: '345',
            est: '678',
            wst: '901',
          },
        },
        sort: 'best_match',
        filters: {},
        rowsPerPage: 50,
        page: 1,
      };

      const expectedQuery: estypes.SearchRequest = {
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
            filter: [
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
              {
                bool: {
                  should: [
                    {
                      bool: {
                        must: [
                          { range: { 'resourceTemporalExtentDetails.start.date': { lte: '2022-01-01' } } },
                          { range: { 'resourceTemporalExtentDetails.end.date': { gte: '2022-01-01' } } },
                        ],
                      },
                    },
                    {
                      bool: {
                        must: [
                          { range: { 'resourceTemporalExtentDetails.start.date': { gte: '2022-01-01' } } },
                          { range: { 'resourceTemporalExtentDetails.end.date': { lte: '2022-12-31' } } },
                        ],
                      },
                    },
                    {
                      bool: {
                        must: [
                          { range: { 'resourceTemporalExtentDetails.start.date': { gte: '2022-01-01' } } },
                          { range: { 'resourceTemporalExtentDetails.start.date': { lte: '2022-12-31' } } },
                        ],
                      },
                    },
                  ],
                  minimum_should_match: 1,
                },
              },
            ],
          },
        },
        sort: {
          _score: {
            order: 'desc',
          },
        },
        size: 50,
        from: 0,
        _source: [],
      };

      const result = generateSearchQuery({ searchFieldsObject });

      expect(result).toEqual(expectedQuery);
      expect(result.query?.bool?.must).toHaveLength(1);
      expect(result.query?.bool?.filter).toHaveLength(2);
    });

    it('should build the search query correctly with results per page as 100', () => {
      const searchFieldsObject: ISearchPayload = {
        fields: {
          keyword: {
            q: 'example',
          },
          date: {
            fdy: '2022',
            fdd: '01',
            fdm: '01',
            tdy: '2022',
            tdd: '31',
            tdm: '12',
          },
          extent: {
            nth: '123',
            sth: '345',
            est: '678',
            wst: '901',
          },
        },
        sort: 'best_match',
        filters: {},
        rowsPerPage: 100,
        page: 1,
      };

      const expectedQuery: estypes.SearchRequest = {
        query: {
          bool: {
            must: [
              {
                query_string: {
                  query: 'example',
                  default_operator: 'AND',
                  fields: ['field1', 'field2', 'field3'],
                },
              },
            ],
            filter: [
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
              {
                bool: {
                  should: [
                    {
                      bool: {
                        must: [
                          { range: { 'resourceTemporalExtentDetails.start.date': { lte: '2022-01-01' } } },
                          { range: { 'resourceTemporalExtentDetails.end.date': { gte: '2022-01-01' } } },
                        ],
                      },
                    },
                    {
                      bool: {
                        must: [
                          { range: { 'resourceTemporalExtentDetails.start.date': { gte: '2022-01-01' } } },
                          { range: { 'resourceTemporalExtentDetails.end.date': { lte: '2022-12-31' } } },
                        ],
                      },
                    },
                    {
                      bool: {
                        must: [
                          { range: { 'resourceTemporalExtentDetails.start.date': { gte: '2022-01-01' } } },
                          { range: { 'resourceTemporalExtentDetails.start.date': { lte: '2022-12-31' } } },
                        ],
                      },
                    },
                  ],
                  minimum_should_match: 1,
                },
              },
            ],
          },
        },
        sort: {
          _score: {
            order: 'desc',
          },
        },
        size: 100,
        from: 0,
        _source: [],
      };

      const result = generateSearchQuery({
        searchFieldsObject,
        fieldsToSearch: ['field1', 'field2', 'field3'],
      });

      expect(result).toEqual(expectedQuery);
      expect(result.query?.bool?.must).toHaveLength(1);
      expect(result.query?.bool?.filter).toHaveLength(2);
    });
  });
  describe('Search query with pagination', () => {
    it('should build the search query correctly with pagination for page 1', () => {
      const searchFieldsObject: ISearchPayload = {
        fields: {
          keyword: {
            q: 'example',
          },
          date: {
            fdy: '2022',
            fdd: '01',
            fdm: '01',
            tdy: '2022',
            tdd: '31',
            tdm: '12',
          },
          extent: {
            nth: '123',
            sth: '345',
            est: '678',
            wst: '901',
          },
        },
        sort: 'best_match',
        rowsPerPage: 20,
        filters: {},
        page: 1,
      };

      const expectedQuery: estypes.SearchRequest = {
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
            filter: [
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
              {
                bool: {
                  should: [
                    {
                      bool: {
                        must: [
                          { range: { 'resourceTemporalExtentDetails.start.date': { lte: '2022-01-01' } } },
                          { range: { 'resourceTemporalExtentDetails.end.date': { gte: '2022-01-01' } } },
                        ],
                      },
                    },
                    {
                      bool: {
                        must: [
                          { range: { 'resourceTemporalExtentDetails.start.date': { gte: '2022-01-01' } } },
                          { range: { 'resourceTemporalExtentDetails.end.date': { lte: '2022-12-31' } } },
                        ],
                      },
                    },
                    {
                      bool: {
                        must: [
                          { range: { 'resourceTemporalExtentDetails.start.date': { gte: '2022-01-01' } } },
                          { range: { 'resourceTemporalExtentDetails.start.date': { lte: '2022-12-31' } } },
                        ],
                      },
                    },
                  ],
                  minimum_should_match: 1,
                },
              },
            ],
          },
        },
        sort: {
          _score: {
            order: 'desc',
          },
        },
        size: 20,
        from: 0,
        _source: [],
      };

      const result = generateSearchQuery({ searchFieldsObject });

      expect(result).toEqual(expectedQuery);
      expect(result.query?.bool?.must).toHaveLength(1);
      expect(result.query?.bool?.filter).toHaveLength(2);
    });

    it('should build the search query correctly with pagination for page 5', () => {
      const searchFieldsObject: ISearchPayload = {
        fields: {
          keyword: {
            q: 'example',
          },
          date: {
            fdy: '2022',
            fdd: '01',
            fdm: '01',
            tdy: '2022',
            tdd: '31',
            tdm: '12',
          },
          extent: {
            nth: '123',
            sth: '345',
            est: '678',
            wst: '901',
          },
        },
        sort: 'best_match',
        rowsPerPage: 20,
        page: 5,
        filters: {},
      };

      const expectedQuery: estypes.SearchRequest = {
        query: {
          bool: {
            must: [
              {
                query_string: {
                  query: 'example',
                  default_operator: 'AND',
                  fields: ['field1', 'field2', 'field3'],
                },
              },
            ],
            filter: [
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
              {
                bool: {
                  should: [
                    {
                      bool: {
                        must: [
                          { range: { 'resourceTemporalExtentDetails.start.date': { lte: '2022-01-01' } } },
                          { range: { 'resourceTemporalExtentDetails.end.date': { gte: '2022-01-01' } } },
                        ],
                      },
                    },
                    {
                      bool: {
                        must: [
                          { range: { 'resourceTemporalExtentDetails.start.date': { gte: '2022-01-01' } } },
                          { range: { 'resourceTemporalExtentDetails.end.date': { lte: '2022-12-31' } } },
                        ],
                      },
                    },
                    {
                      bool: {
                        must: [
                          { range: { 'resourceTemporalExtentDetails.start.date': { gte: '2022-01-01' } } },
                          { range: { 'resourceTemporalExtentDetails.start.date': { lte: '2022-12-31' } } },
                        ],
                      },
                    },
                  ],
                  minimum_should_match: 1,
                },
              },
            ],
          },
        },
        sort: {
          _score: {
            order: 'desc',
          },
        },
        size: 20,
        from: 80,
        _source: [],
      };

      const result = generateSearchQuery({
        searchFieldsObject,
        fieldsToSearch: ['field1', 'field2', 'field3'],
      });

      expect(result).toEqual(expectedQuery);
      expect(result.query?.bool?.must).toHaveLength(1);
      expect(result.query?.bool?.filter).toHaveLength(2);
    });
  });

  describe('Search query with filters', () => {
    it('should build the search query when filter resourceType is all', () => {
      const searchFieldsObject: ISearchPayload = {
        fields: {
          keyword: {
            q: 'example',
          },
        },
        sort: 'best_match',
        filters: { [resourceTypeFilterField]: ['all'] },
        rowsPerPage: 20,
        page: 1,
      };

      const expectedQuery: estypes.SearchRequest = {
        query: {
          bool: {
            filter: [],
            must: [
              {
                query_string: {
                  query: 'example',
                  default_operator: 'AND',
                },
              },
              {
                terms: {
                  resourceType: ['all'],
                },
              },
            ],
          },
        },
        sort: {
          _score: {
            order: 'desc',
          },
        },
        size: 20,
        from: 0,
        _source: [],
      };

      const result = generateSearchQuery({ searchFieldsObject });

      expect(result).toEqual(expectedQuery);
      expect(result.query?.bool?.must).toHaveLength(2);
    });

    it('should build the search query when filter resourceType as dataset', () => {
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

      const expectedQuery: estypes.SearchRequest = {
        query: {
          bool: {
            filter: [],
            must: [
              {
                query_string: {
                  query: 'example',
                  default_operator: 'AND',
                },
              },
              {
                terms: {
                  resourceType: ['dataset'],
                },
              },
            ],
          },
        },
        sort: {
          _score: {
            order: 'desc',
          },
        },
        size: 20,
        from: 0,
        _source: [],
      };

      const result = generateSearchQuery({
        searchFieldsObject,
      });

      expect(result).toEqual(expectedQuery);
      expect(result.query?.bool?.must).toHaveLength(2);
    });

    it('should build the search query when filter resourceType with multiple values', () => {
      const searchFieldsObject: ISearchPayload = {
        fields: {
          keyword: {
            q: 'example',
          },
        },
        sort: 'best_match',
        filters: { [resourceTypeFilterField]: ['dataset', 'series'] },
        rowsPerPage: 20,
        page: 1,
      };

      const expectedQuery: estypes.SearchRequest = {
        query: {
          bool: {
            filter: [],
            must: [
              {
                query_string: {
                  query: 'example',
                  default_operator: 'AND',
                },
              },
              {
                terms: {
                  resourceType: ['dataset', 'series'],
                },
              },
            ],
          },
        },
        sort: {
          _score: {
            order: 'desc',
          },
        },
        size: 20,
        from: 0,
        _source: [],
      };

      const result = generateSearchQuery({
        searchFieldsObject,
      });

      expect(result).toEqual(expectedQuery);
      expect(result.query?.bool?.must).toHaveLength(2);
    });

    it('should build the search query when filtering with study period', () => {
      const searchFieldsObject: ISearchPayload = {
        fields: {
          keyword: {
            q: 'example',
          },
        },
        sort: 'best_match',
        filters: {
          [studyPeriodFilterField]: {
            fdy: '2017',
            tdy: '2022',
          },
        },
        rowsPerPage: 20,
        page: 1,
      };

      const expectedQuery: estypes.SearchRequest = {
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
            filter: [
              {
                bool: {
                  should: [
                    {
                      bool: {
                        must: [
                          { range: { 'resourceTemporalExtentDetails.start.date': { lte: '2017-01-01' } } },
                          { range: { 'resourceTemporalExtentDetails.end.date': { gte: '2017-01-01' } } },
                        ],
                      },
                    },
                    {
                      bool: {
                        must: [
                          { range: { 'resourceTemporalExtentDetails.start.date': { gte: '2017-01-01' } } },
                          { range: { 'resourceTemporalExtentDetails.end.date': { lte: '2022-12-31' } } },
                        ],
                      },
                    },
                    {
                      bool: {
                        must: [
                          { range: { 'resourceTemporalExtentDetails.start.date': { gte: '2017-01-01' } } },
                          { range: { 'resourceTemporalExtentDetails.start.date': { lte: '2022-12-31' } } },
                        ],
                      },
                    },
                  ],
                  minimum_should_match: 1,
                },
              },
            ],
          },
        },
        sort: {
          _score: {
            order: 'desc',
          },
        },
        size: 20,
        from: 0,
        _source: [],
      };

      const result = generateSearchQuery({
        searchFieldsObject,
      });

      expect(result).toEqual(expectedQuery);
      expect(result.query?.bool?.must).toHaveLength(1);
      expect(result.query?.bool?.filter).toHaveLength(1);
    });

    it('should build the search query when filtering with both resourceType and study period', () => {
      const searchFieldsObject: ISearchPayload = {
        fields: {
          keyword: {
            q: 'example',
          },
        },
        sort: 'best_match',
        filters: {
          [resourceTypeFilterField]: ['dataset', 'series'],
          [studyPeriodFilterField]: {
            fdy: '2017',
            tdy: '2022',
          },
        },
        rowsPerPage: 20,
        page: 1,
      };

      const expectedQuery: estypes.SearchRequest = {
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
                terms: {
                  resourceType: ['dataset', 'series'],
                },
              },
            ],
            filter: [
              {
                bool: {
                  should: [
                    {
                      bool: {
                        must: [
                          { range: { 'resourceTemporalExtentDetails.start.date': { lte: '2017-01-01' } } },
                          { range: { 'resourceTemporalExtentDetails.end.date': { gte: '2017-01-01' } } },
                        ],
                      },
                    },
                    {
                      bool: {
                        must: [
                          { range: { 'resourceTemporalExtentDetails.start.date': { gte: '2017-01-01' } } },
                          { range: { 'resourceTemporalExtentDetails.end.date': { lte: '2022-12-31' } } },
                        ],
                      },
                    },
                    {
                      bool: {
                        must: [
                          { range: { 'resourceTemporalExtentDetails.start.date': { gte: '2017-01-01' } } },
                          { range: { 'resourceTemporalExtentDetails.start.date': { lte: '2022-12-31' } } },
                        ],
                      },
                    },
                  ],
                  minimum_should_match: 1,
                },
              },
            ],
          },
        },
        sort: {
          _score: {
            order: 'desc',
          },
        },
        size: 20,
        from: 0,
        _source: [],
      };

      const result = generateSearchQuery({
        searchFieldsObject,
      });

      expect(result).toEqual(expectedQuery);
      expect(result.query?.bool?.must).toHaveLength(2);
      expect(result.query?.bool?.filter).toHaveLength(1);
    });
  });

  describe('Search query for filter aggregations', () => {
    it('should build the search query for resourceType aggregation', () => {
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

      const expectedQuery: estypes.SearchRequest = {
        query: {
          bool: {
            filter: [],
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
        aggs: {
          unique_resource_types: {
            terms: {
              field: 'resourceType',
            },
          },
        },
        size: 0,
      };

      const result = generateFilterQuery(
        {
          searchFieldsObject,
          isAggregation: true,
        },
        { isStudyPeriod: false },
      );

      expect(result).toEqual(expectedQuery);
      expect(result.query?.bool?.must).toHaveLength(1);
    });

    it('should build the search query for resourceType aggregation with date range', () => {
      const searchFieldsObject: ISearchPayload = {
        fields: {
          date: {
            fdy: '2017',
            tdy: '2022',
          },
        },
        sort: 'best_match',
        filters: {},
        rowsPerPage: 20,
        page: 1,
      };

      const expectedQuery: estypes.SearchRequest = {
        query: {
          bool: {
            filter: [
              {
                bool: {
                  should: [
                    {
                      bool: {
                        must: [
                          { range: { 'resourceTemporalExtentDetails.start.date': { lte: '2017-01-01' } } },
                          { range: { 'resourceTemporalExtentDetails.end.date': { gte: '2017-01-01' } } },
                        ],
                      },
                    },
                    {
                      bool: {
                        must: [
                          { range: { 'resourceTemporalExtentDetails.start.date': { gte: '2017-01-01' } } },
                          { range: { 'resourceTemporalExtentDetails.end.date': { lte: '2022-12-31' } } },
                        ],
                      },
                    },
                    {
                      bool: {
                        must: [
                          { range: { 'resourceTemporalExtentDetails.start.date': { gte: '2017-01-01' } } },
                          { range: { 'resourceTemporalExtentDetails.start.date': { lte: '2022-12-31' } } },
                        ],
                      },
                    },
                  ],
                  minimum_should_match: 1,
                },
              },
            ],
          },
        },
        aggs: {
          unique_resource_types: {
            terms: {
              field: 'resourceType',
            },
          },
        },
        size: 0,
      };

      const result = generateFilterQuery(
        {
          searchFieldsObject,
          isAggregation: true,
        },
        { isStudyPeriod: false },
      );

      expect(result).toEqual(expectedQuery);
      expect(result.query?.bool?.filter).toHaveLength(1);
    });

    it('should build the search query for resourceType aggregation with geography coordinates', () => {
      const searchFieldsObject: ISearchPayload = {
        fields: {
          extent: {
            nth: '123',
            sth: '345',
            est: '678',
            wst: '901',
          },
        },
        sort: 'best_match',
        filters: {},
        rowsPerPage: 20,
        page: 1,
      };

      const expectedQuery: estypes.SearchRequest = {
        query: {
          bool: {
            filter: [
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
        aggs: {
          unique_resource_types: {
            terms: {
              field: 'resourceType',
            },
          },
        },
        size: 0,
      };

      const result = generateFilterQuery(
        {
          searchFieldsObject,
          isAggregation: true,
        },
        { isStudyPeriod: false },
      );

      expect(result).toEqual(expectedQuery);
      expect(result.query?.bool?.filter).toHaveLength(1);
    });

    it('should build the search query for resourceType aggregation with both date range & geography coordinates', () => {
      const searchFieldsObject: ISearchPayload = {
        fields: {
          date: {
            fdy: '2017',
            tdy: '2022',
          },
          extent: {
            nth: '123',
            sth: '345',
            est: '678',
            wst: '901',
          },
        },
        sort: 'best_match',
        filters: {},
        rowsPerPage: 20,
        page: 1,
      };

      const expectedQuery: estypes.SearchRequest = {
        query: {
          bool: {
            filter: [
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
              {
                bool: {
                  should: [
                    {
                      bool: {
                        must: [
                          { range: { 'resourceTemporalExtentDetails.start.date': { lte: '2017-01-01' } } },
                          { range: { 'resourceTemporalExtentDetails.end.date': { gte: '2017-01-01' } } },
                        ],
                      },
                    },
                    {
                      bool: {
                        must: [
                          { range: { 'resourceTemporalExtentDetails.start.date': { gte: '2017-01-01' } } },
                          { range: { 'resourceTemporalExtentDetails.end.date': { lte: '2022-12-31' } } },
                        ],
                      },
                    },
                    {
                      bool: {
                        must: [
                          { range: { 'resourceTemporalExtentDetails.start.date': { gte: '2017-01-01' } } },
                          { range: { 'resourceTemporalExtentDetails.start.date': { lte: '2022-12-31' } } },
                        ],
                      },
                    },
                  ],
                  minimum_should_match: 1,
                },
              },
            ],
          },
        },
        aggs: {
          unique_resource_types: {
            terms: {
              field: 'resourceType',
            },
          },
        },
        size: 0,
      };

      const result = generateFilterQuery(
        {
          searchFieldsObject,
          isAggregation: true,
        },
        { isStudyPeriod: false },
      );

      expect(result).toEqual(expectedQuery);
      expect(result.query?.bool?.filter).toHaveLength(2);
    });

    it('should build the search query for resourceType aggregation with study period filter', () => {
      const searchFieldsObject: ISearchPayload = {
        fields: {
          keyword: {
            q: 'example',
          },
        },
        sort: 'best_match',
        filters: {
          [studyPeriodFilterField]: {
            fdy: '2017',
            tdy: '2022',
          },
        },
        rowsPerPage: 20,
        page: 1,
      };

      const expectedQuery: estypes.SearchRequest = {
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
            filter: [
              {
                bool: {
                  should: [
                    {
                      bool: {
                        must: [
                          { range: { 'resourceTemporalExtentDetails.start.date': { lte: '2017-01-01' } } },
                          { range: { 'resourceTemporalExtentDetails.end.date': { gte: '2017-01-01' } } },
                        ],
                      },
                    },
                    {
                      bool: {
                        must: [
                          { range: { 'resourceTemporalExtentDetails.start.date': { gte: '2017-01-01' } } },
                          { range: { 'resourceTemporalExtentDetails.end.date': { lte: '2022-12-31' } } },
                        ],
                      },
                    },
                    {
                      bool: {
                        must: [
                          { range: { 'resourceTemporalExtentDetails.start.date': { gte: '2017-01-01' } } },
                          { range: { 'resourceTemporalExtentDetails.start.date': { lte: '2022-12-31' } } },
                        ],
                      },
                    },
                  ],
                  minimum_should_match: 1,
                },
              },
            ],
          },
        },
        aggs: {
          unique_resource_types: {
            terms: {
              field: 'resourceType',
            },
          },
        },
        size: 0,
      };

      const result = generateFilterQuery(
        {
          searchFieldsObject,
          isAggregation: true,
        },
        { isStudyPeriod: false },
      );

      expect(result).toEqual(expectedQuery);
      expect(result.query?.bool?.must).toHaveLength(1);
      expect(result.query?.bool?.filter).toHaveLength(1);
    });

    it('should build the search query for resourceType aggregation with study period filter ignore date range', () => {
      const searchFieldsObject: ISearchPayload = {
        fields: {
          date: {
            fdy: '2022',
            tdy: '2023',
          },
        },
        sort: 'best_match',
        filters: {
          [studyPeriodFilterField]: {
            fdy: '2017',
            tdy: '2022',
          },
        },
        rowsPerPage: 20,
        page: 1,
      };

      const expectedQuery: estypes.SearchRequest = {
        query: {
          bool: {
            filter: [
              {
                bool: {
                  should: [
                    {
                      bool: {
                        must: [
                          { range: { 'resourceTemporalExtentDetails.start.date': { lte: '2017-01-01' } } },
                          { range: { 'resourceTemporalExtentDetails.end.date': { gte: '2017-01-01' } } },
                        ],
                      },
                    },
                    {
                      bool: {
                        must: [
                          { range: { 'resourceTemporalExtentDetails.start.date': { gte: '2017-01-01' } } },
                          { range: { 'resourceTemporalExtentDetails.end.date': { lte: '2022-12-31' } } },
                        ],
                      },
                    },
                    {
                      bool: {
                        must: [
                          { range: { 'resourceTemporalExtentDetails.start.date': { gte: '2017-01-01' } } },
                          { range: { 'resourceTemporalExtentDetails.start.date': { lte: '2022-12-31' } } },
                        ],
                      },
                    },
                  ],
                  minimum_should_match: 1,
                },
              },
            ],
          },
        },
        aggs: {
          unique_resource_types: {
            terms: {
              field: 'resourceType',
            },
          },
        },
        size: 0,
      };

      const result = generateFilterQuery(
        {
          searchFieldsObject,
          isAggregation: true,
        },
        { isStudyPeriod: false },
      );

      expect(result).toEqual(expectedQuery);
      expect(result.query?.bool?.filter).toHaveLength(1);
    });

    it('should build the search query for resourceType aggregation with study period filter with coordinates', () => {
      const searchFieldsObject: ISearchPayload = {
        fields: {
          extent: {
            nth: '123',
            sth: '345',
            est: '678',
            wst: '901',
          },
        },
        sort: 'best_match',
        filters: {
          [studyPeriodFilterField]: {
            fdy: '2017',
            tdy: '2022',
          },
        },
        rowsPerPage: 20,
        page: 1,
      };

      const expectedQuery: estypes.SearchRequest = {
        query: {
          bool: {
            filter: [
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
              {
                bool: {
                  should: [
                    {
                      bool: {
                        must: [
                          { range: { 'resourceTemporalExtentDetails.start.date': { lte: '2017-01-01' } } },
                          { range: { 'resourceTemporalExtentDetails.end.date': { gte: '2017-01-01' } } },
                        ],
                      },
                    },
                    {
                      bool: {
                        must: [
                          { range: { 'resourceTemporalExtentDetails.start.date': { gte: '2017-01-01' } } },
                          { range: { 'resourceTemporalExtentDetails.end.date': { lte: '2022-12-31' } } },
                        ],
                      },
                    },
                    {
                      bool: {
                        must: [
                          { range: { 'resourceTemporalExtentDetails.start.date': { gte: '2017-01-01' } } },
                          { range: { 'resourceTemporalExtentDetails.start.date': { lte: '2022-12-31' } } },
                        ],
                      },
                    },
                  ],
                  minimum_should_match: 1,
                },
              },
            ],
          },
        },
        aggs: {
          unique_resource_types: {
            terms: {
              field: 'resourceType',
            },
          },
        },
        size: 0,
      };

      const result = generateFilterQuery(
        {
          searchFieldsObject,
          isAggregation: true,
        },
        { isStudyPeriod: false },
      );

      expect(result).toEqual(expectedQuery);
      expect(result.query?.bool?.filter).toHaveLength(2);
    });

    it('should build the search query for study period aggregation', () => {
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

      const expectedQuery: estypes.SearchRequest = {
        query: {
          bool: {
            filter: [],
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
        aggs: {
          min_year: {
            min: {
              field: 'resourceTemporalExtentDetails.start.date',
            },
          },
          max_year: {
            max: {
              field: 'resourceTemporalExtentDetails.end.date',
            },
          },
        },
        size: 0,
      };

      const result = generateFilterQuery(
        {
          searchFieldsObject,
          isAggregation: true,
        },
        { isStudyPeriod: true },
      );

      expect(result).toEqual(expectedQuery);
      expect(result.query?.bool?.must).toHaveLength(1);
    });

    it('should build the search query for study period aggregation with date range', () => {
      const searchFieldsObject: ISearchPayload = {
        fields: {
          date: {
            fdy: '2017',
            tdy: '2022',
          },
        },
        sort: 'best_match',
        filters: {},
        rowsPerPage: 20,
        page: 1,
      };

      const expectedQuery: estypes.SearchRequest = {
        query: {
          bool: {
            filter: [
              {
                bool: {
                  should: [
                    {
                      bool: {
                        must: [
                          { range: { 'resourceTemporalExtentDetails.start.date': { lte: '2017-01-01' } } },
                          { range: { 'resourceTemporalExtentDetails.end.date': { gte: '2017-01-01' } } },
                        ],
                      },
                    },
                    {
                      bool: {
                        must: [
                          { range: { 'resourceTemporalExtentDetails.start.date': { gte: '2017-01-01' } } },
                          { range: { 'resourceTemporalExtentDetails.end.date': { lte: '2022-12-31' } } },
                        ],
                      },
                    },
                    {
                      bool: {
                        must: [
                          { range: { 'resourceTemporalExtentDetails.start.date': { gte: '2017-01-01' } } },
                          { range: { 'resourceTemporalExtentDetails.start.date': { lte: '2022-12-31' } } },
                        ],
                      },
                    },
                  ],
                  minimum_should_match: 1,
                },
              },
            ],
            must: [],
          },
        },
        aggs: {
          min_year: {
            min: {
              field: 'resourceTemporalExtentDetails.start.date',
            },
          },
          max_year: {
            max: {
              field: 'resourceTemporalExtentDetails.end.date',
            },
          },
        },
        size: 0,
      };

      const result = generateFilterQuery(
        {
          searchFieldsObject,
          isAggregation: true,
        },
        { isStudyPeriod: true },
      );

      expect(result).toEqual(expectedQuery);
      expect(result.query?.bool?.filter).toHaveLength(1);
      expect(result.query?.bool?.must).toHaveLength(0);
    });

    it('should build the search query for study period aggregation with geography coordinates', () => {
      const searchFieldsObject: ISearchPayload = {
        fields: {
          extent: {
            nth: '123',
            sth: '345',
            est: '678',
            wst: '901',
          },
        },
        sort: 'best_match',
        filters: {},
        rowsPerPage: 20,
        page: 1,
      };

      const expectedQuery: estypes.SearchRequest = {
        query: {
          bool: {
            filter: [
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
            must: [],
          },
        },
        aggs: {
          min_year: {
            min: {
              field: 'resourceTemporalExtentDetails.start.date',
            },
          },
          max_year: {
            max: {
              field: 'resourceTemporalExtentDetails.end.date',
            },
          },
        },
        size: 0,
      };

      const result = generateFilterQuery(
        {
          searchFieldsObject,
          isAggregation: true,
        },
        { isStudyPeriod: true },
      );

      expect(result).toEqual(expectedQuery);
      expect(result.query?.bool?.filter).toHaveLength(1);
      expect(result.query?.bool?.must).toHaveLength(0);
    });

    it('should build the search query for study period aggregation with both date range and geography coordinates', () => {
      const searchFieldsObject: ISearchPayload = {
        fields: {
          date: {
            fdy: '2017',
            tdy: '2022',
          },
          extent: {
            nth: '123',
            sth: '345',
            est: '678',
            wst: '901',
          },
        },
        sort: 'best_match',
        filters: {},
        rowsPerPage: 20,
        page: 1,
      };

      const expectedQuery: estypes.SearchRequest = {
        query: {
          bool: {
            filter: [
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
              {
                bool: {
                  should: [
                    {
                      bool: {
                        must: [
                          { range: { 'resourceTemporalExtentDetails.start.date': { lte: '2017-01-01' } } },
                          { range: { 'resourceTemporalExtentDetails.end.date': { gte: '2017-01-01' } } },
                        ],
                      },
                    },
                    {
                      bool: {
                        must: [
                          { range: { 'resourceTemporalExtentDetails.start.date': { gte: '2017-01-01' } } },
                          { range: { 'resourceTemporalExtentDetails.end.date': { lte: '2022-12-31' } } },
                        ],
                      },
                    },
                    {
                      bool: {
                        must: [
                          { range: { 'resourceTemporalExtentDetails.start.date': { gte: '2017-01-01' } } },
                          { range: { 'resourceTemporalExtentDetails.start.date': { lte: '2022-12-31' } } },
                        ],
                      },
                    },
                  ],
                  minimum_should_match: 1,
                },
              },
            ],
            must: [],
          },
        },
        aggs: {
          min_year: {
            min: {
              field: 'resourceTemporalExtentDetails.start.date',
            },
          },
          max_year: {
            max: {
              field: 'resourceTemporalExtentDetails.end.date',
            },
          },
        },
        size: 0,
      };

      const result = generateFilterQuery(
        {
          searchFieldsObject,
          isAggregation: true,
        },
        { isStudyPeriod: true },
      );

      expect(result).toEqual(expectedQuery);
      expect(result.query?.bool?.filter).toHaveLength(2);
      expect(result.query?.bool?.must).toHaveLength(0);
    });

    it('should build the search query for study period aggregation with resourceType filter', () => {
      const searchFieldsObject: ISearchPayload = {
        fields: {
          keyword: {
            q: 'example',
          },
        },
        sort: 'best_match',
        filters: { [resourceTypeFilterField]: ['dataset', 'series'] },
        rowsPerPage: 20,
        page: 1,
      };

      const expectedQuery: estypes.SearchRequest = {
        query: {
          bool: {
            filter: [],
            must: [
              {
                query_string: {
                  query: 'example',
                  default_operator: 'AND',
                },
              },
              {
                terms: {
                  resourceType: ['dataset', 'series'],
                },
              },
            ],
          },
        },
        aggs: {
          min_year: {
            min: {
              field: 'resourceTemporalExtentDetails.start.date',
            },
          },
          max_year: {
            max: {
              field: 'resourceTemporalExtentDetails.end.date',
            },
          },
        },
        size: 0,
      };

      const result = generateFilterQuery(
        {
          searchFieldsObject,
          isAggregation: true,
        },
        { isStudyPeriod: true },
      );

      expect(result).toEqual(expectedQuery);
      expect(result.query?.bool?.must).toHaveLength(2);
    });

    it('should build the search query for study period aggregation with resourceType filter and date range', () => {
      const searchFieldsObject: ISearchPayload = {
        fields: {
          date: {
            fdy: '2017',
            tdy: '2022',
          },
        },
        sort: 'best_match',
        filters: { [resourceTypeFilterField]: ['dataset', 'series'] },
        rowsPerPage: 20,
        page: 1,
      };

      const expectedQuery: estypes.SearchRequest = {
        query: {
          bool: {
            filter: [
              {
                bool: {
                  should: [
                    {
                      bool: {
                        must: [
                          { range: { 'resourceTemporalExtentDetails.start.date': { lte: '2017-01-01' } } },
                          { range: { 'resourceTemporalExtentDetails.end.date': { gte: '2017-01-01' } } },
                        ],
                      },
                    },
                    {
                      bool: {
                        must: [
                          { range: { 'resourceTemporalExtentDetails.start.date': { gte: '2017-01-01' } } },
                          { range: { 'resourceTemporalExtentDetails.end.date': { lte: '2022-12-31' } } },
                        ],
                      },
                    },
                    {
                      bool: {
                        must: [
                          { range: { 'resourceTemporalExtentDetails.start.date': { gte: '2017-01-01' } } },
                          { range: { 'resourceTemporalExtentDetails.start.date': { lte: '2022-12-31' } } },
                        ],
                      },
                    },
                  ],
                  minimum_should_match: 1,
                },
              },
            ],
            must: [
              {
                terms: {
                  resourceType: ['dataset', 'series'],
                },
              },
            ],
          },
        },
        aggs: {
          min_year: {
            min: {
              field: 'resourceTemporalExtentDetails.start.date',
            },
          },
          max_year: {
            max: {
              field: 'resourceTemporalExtentDetails.end.date',
            },
          },
        },
        size: 0,
      };

      const result = generateFilterQuery(
        {
          searchFieldsObject,
          isAggregation: true,
        },
        { isStudyPeriod: true },
      );

      expect(result).toEqual(expectedQuery);
      expect(result.query?.bool?.must).toHaveLength(1);
      expect(result.query?.bool?.filter).toHaveLength(1);
    });

    it('should build the search query for study period aggregation with resourceType filter and coordinates', () => {
      const searchFieldsObject: ISearchPayload = {
        fields: {
          extent: {
            nth: '123',
            sth: '345',
            est: '678',
            wst: '901',
          },
        },
        sort: 'best_match',
        filters: { [resourceTypeFilterField]: ['dataset', 'series'] },
        rowsPerPage: 20,
        page: 1,
      };

      const expectedQuery: estypes.SearchRequest = {
        query: {
          bool: {
            filter: [
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
            must: [
              {
                terms: {
                  resourceType: ['dataset', 'series'],
                },
              },
            ],
          },
        },
        aggs: {
          min_year: {
            min: {
              field: 'resourceTemporalExtentDetails.start.date',
            },
          },
          max_year: {
            max: {
              field: 'resourceTemporalExtentDetails.end.date',
            },
          },
        },
        size: 0,
      };

      const result = generateFilterQuery(
        {
          searchFieldsObject,
          isAggregation: true,
        },
        { isStudyPeriod: true },
      );

      expect(result).toEqual(expectedQuery);
      expect(result.query?.bool?.must).toHaveLength(1);
      expect(result.query?.bool?.filter).toHaveLength(1);
    });

    it('should build the search query for study period aggregation with resourceType filter, date range and coordinates', () => {
      const searchFieldsObject: ISearchPayload = {
        fields: {
          date: {
            fdy: '2017',
            tdy: '2022',
          },
          extent: {
            nth: '123',
            sth: '345',
            est: '678',
            wst: '901',
          },
        },
        sort: 'best_match',
        filters: { [resourceTypeFilterField]: ['dataset', 'series'] },
        rowsPerPage: 20,
        page: 1,
      };

      const expectedQuery: estypes.SearchRequest = {
        query: {
          bool: {
            filter: [
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
              {
                bool: {
                  should: [
                    {
                      bool: {
                        must: [
                          { range: { 'resourceTemporalExtentDetails.start.date': { lte: '2017-01-01' } } },
                          { range: { 'resourceTemporalExtentDetails.end.date': { gte: '2017-01-01' } } },
                        ],
                      },
                    },
                    {
                      bool: {
                        must: [
                          { range: { 'resourceTemporalExtentDetails.start.date': { gte: '2017-01-01' } } },
                          { range: { 'resourceTemporalExtentDetails.end.date': { lte: '2022-12-31' } } },
                        ],
                      },
                    },
                    {
                      bool: {
                        must: [
                          { range: { 'resourceTemporalExtentDetails.start.date': { gte: '2017-01-01' } } },
                          { range: { 'resourceTemporalExtentDetails.start.date': { lte: '2022-12-31' } } },
                        ],
                      },
                    },
                  ],
                  minimum_should_match: 1,
                },
              },
            ],
            must: [
              {
                terms: {
                  resourceType: ['dataset', 'series'],
                },
              },
            ],
          },
        },
        aggs: {
          min_year: {
            min: {
              field: 'resourceTemporalExtentDetails.start.date',
            },
          },
          max_year: {
            max: {
              field: 'resourceTemporalExtentDetails.end.date',
            },
          },
        },
        size: 0,
      };

      const result = generateFilterQuery(
        {
          searchFieldsObject,
          isAggregation: true,
        },
        { isStudyPeriod: true },
      );

      expect(result).toEqual(expectedQuery);
      expect(result.query?.bool?.must).toHaveLength(1);
      expect(result.query?.bool?.filter).toHaveLength(2);
    });

    it('should build the search query for study period aggregation with resourceType filter ignoring study period filter', () => {
      const searchFieldsObject: ISearchPayload = {
        fields: {
          keyword: {
            q: 'example',
          },
        },
        sort: 'best_match',
        filters: {
          [resourceTypeFilterField]: ['dataset', 'series'],
          [studyPeriodFilterField]: {
            fdy: '2017',
            tdy: '2022',
          },
        },
        rowsPerPage: 20,
        page: 1,
      };

      const expectedQuery: estypes.SearchRequest = {
        query: {
          bool: {
            filter: [],
            must: [
              {
                query_string: {
                  query: 'example',
                  default_operator: 'AND',
                },
              },
              {
                terms: {
                  resourceType: ['dataset', 'series'],
                },
              },
            ],
          },
        },
        aggs: {
          min_year: {
            min: {
              field: 'resourceTemporalExtentDetails.start.date',
            },
          },
          max_year: {
            max: {
              field: 'resourceTemporalExtentDetails.end.date',
            },
          },
        },
        size: 0,
      };

      const result = generateFilterQuery(
        {
          searchFieldsObject,
          isAggregation: true,
        },
        { isStudyPeriod: true },
      );

      expect(result).toEqual(expectedQuery);
      expect(result.query?.bool?.must).toHaveLength(2);
    });
  });

  describe('Search query for count', () => {
    it('should build the search query to get only count of documents', () => {
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

      const expectedQuery: estypes.SearchRequest = {
        query: {
          bool: {
            filter: [],
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
      };

      const result = generateSearchQuery({
        searchFieldsObject,
        isCount: true,
      });

      expect(result).toEqual(expectedQuery);
      expect(result.query?.bool?.must).toHaveLength(1);
      expect(result.query?.bool?.filter).toHaveLength(0);
    });

    it('should build the search query to get only count of documents with study period', () => {
      const searchFieldsObject: ISearchPayload = {
        fields: {
          date: {
            fdy: '2022',
            fdd: '01',
            fdm: '01',
            tdy: '2022',
            tdd: '31',
            tdm: '12',
          },
        },
        sort: 'best_match',
        filters: {},
        rowsPerPage: 20,
        page: 1,
      };

      const expectedQuery: estypes.SearchRequest = {
        query: {
          bool: {
            filter: [
              {
                bool: {
                  should: [
                    {
                      bool: {
                        must: [
                          { range: { 'resourceTemporalExtentDetails.start.date': { lte: '2022-01-01' } } },
                          { range: { 'resourceTemporalExtentDetails.end.date': { gte: '2022-01-01' } } },
                        ],
                      },
                    },
                    {
                      bool: {
                        must: [
                          { range: { 'resourceTemporalExtentDetails.start.date': { gte: '2022-01-01' } } },
                          { range: { 'resourceTemporalExtentDetails.end.date': { lte: '2022-12-31' } } },
                        ],
                      },
                    },
                    {
                      bool: {
                        must: [
                          { range: { 'resourceTemporalExtentDetails.start.date': { gte: '2022-01-01' } } },
                          { range: { 'resourceTemporalExtentDetails.start.date': { lte: '2022-12-31' } } },
                        ],
                      },
                    },
                  ],
                  minimum_should_match: 1,
                },
              },
            ],
            must: [],
          },
        },
      };

      const result = generateSearchQuery({
        searchFieldsObject,
        isCount: true,
      });

      expect(result).toEqual(expectedQuery);
      expect(result.query?.bool?.filter).toHaveLength(1);
      expect(result.query?.bool?.must).toHaveLength(0);
    });
  });

  describe('Search query to fetch single document details', () => {
    it('should build query with docId to fetch single document details', async () => {
      const result = generateSearchQuery({ docId: '12313-123232-1231231' });

      const expectedQuery: estypes.SearchRequest = {
        query: {
          bool: {
            must: [
              {
                query_string: {
                  query: '12313-123232-1231231',
                  default_operator: 'AND',
                  fields: ['_id'],
                },
              },
            ],
          },
        },
      };

      expect(result).toEqual(expectedQuery);
      expect(result.query?.bool?.must).toHaveLength(1);
    });
  });

  describe('Search query to check if field exists', () => {
    it('should build the search query with exists property to check a single field', () => {
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
        fieldsExist: ['field1'],
      };

      const expectedQuery: estypes.SearchRequest = {
        query: {
          bool: {
            filter: [],
            must: [
              {
                query_string: {
                  query: 'example',
                  default_operator: 'AND',
                },
              },
              {
                exists: { field: 'field1' },
              },
            ],
          },
        },
        size: 20,
        sort: {
          _score: {
            order: 'desc',
          },
        },
        from: 0,
        _source: [],
      };

      const result = generateSearchQuery({
        searchFieldsObject,
      });

      expect(result).toEqual(expectedQuery);
      expect(result.query?.bool?.must).toHaveLength(2);
    });

    it('should build the search query with exists property to check multiple fields', () => {
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
        fieldsExist: ['field1', 'field2'],
      };

      const expectedQuery: estypes.SearchRequest = {
        query: {
          bool: {
            filter: [],
            must: [
              {
                query_string: {
                  query: 'example',
                  default_operator: 'AND',
                },
              },
              {
                exists: { field: 'field1' },
              },
              {
                exists: { field: 'field2' },
              },
            ],
          },
        },
        size: 20,
        sort: {
          _score: {
            order: 'desc',
          },
        },
        from: 0,
        _source: [],
      };

      const result = generateSearchQuery({
        searchFieldsObject,
      });

      expect(result).toEqual(expectedQuery);
      expect(result.query?.bool?.must).toHaveLength(3);
    });
  });

  describe('Search query to fetch required fields', () => {
    it('should build the search query with required fields', () => {
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
        requiredFields: ['field1', 'field2'],
      };

      const expectedQuery: estypes.SearchRequest = {
        query: {
          bool: {
            filter: [],
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
        sort: {
          _score: {
            order: 'desc',
          },
        },
        from: 0,
        _source: ['field1', 'field2'],
      };

      const result = generateSearchQuery({
        searchFieldsObject,
      });

      expect(result).toEqual(expectedQuery);
      expect(result.query?.bool?.must).toHaveLength(1);
    });
  });
});
