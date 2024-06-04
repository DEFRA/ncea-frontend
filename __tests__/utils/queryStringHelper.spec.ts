import { RequestQuery } from '@hapi/hapi';
import {
  getQueryStringParams,
  upsertQueryParams,
  readQueryParams,
  getDateParams,
  getExtentParams,
  getFilterParams,
  generateCountPayload,
  generateQueryBuilderFields,
  generateQueryBuilderPayload,
  deleteQueryParams,
} from '../../src/utils/queryStringHelper';

describe('queryStringHelper functions', () => {
  describe('getQueryStringParams', () => {
    test('should return empty URLSearchParams if no requestQuery provided', () => {
      const result = getQueryStringParams('' as unknown as RequestQuery);
      expect(result.toString()).toBe('');
    });

    test('should return URLSearchParams with query string parameters', () => {
      const requestQuery = { q: 'query', page: '1', rowsPerPage: '20' };
      const result = getQueryStringParams(requestQuery);
      expect(result.toString()).toBe('q=query&page=1&rowsPerPage=20');
    });
  });

  describe('upsertQueryParams', () => {
    test('should insert new query parameters', () => {
      const requestQuery = { q: 'query' };
      const queryParamsObject = { jry: 'qs' };
      const result = upsertQueryParams(requestQuery, queryParamsObject);
      expect(result).toBe('q=query&jry=qs&pg=1&rpp=20&srt=best_match');
    });

    test('should update existing query parameters', () => {
      const requestQuery = { jry: 'qs', q: 'oldQuery' };
      const queryParamsObject = { q: 'newQuery' };
      const result = upsertQueryParams(requestQuery, queryParamsObject);
      expect(result).toBe('jry=qs&q=newQuery&pg=1&rpp=20&srt=best_match');
    });

    test('should include default parameters if specified', () => {
      const requestQuery = { q: 'oldQuery' };
      const queryParamsObject = {};
      const result = upsertQueryParams(requestQuery, queryParamsObject, true);
      expect(result).toBe('q=oldQuery&pg=1&rpp=20&srt=best_match');
    });

    test('should not include default parameters if not specified', () => {
      const requestQuery = { q: 'oldQuery' };
      const queryParamsObject = {};
      const result = upsertQueryParams(requestQuery, queryParamsObject, false);
      expect(result).toBe('q=oldQuery');
    });

    test('should remove the key if the value is empty', () => {
      const requestQuery = { q: 'oldQuery', t: '123' };
      const queryParamsObject = { t: '' };
      const result = upsertQueryParams(requestQuery, queryParamsObject, false);
      expect(result).toBe('q=oldQuery');
    });
  });

  describe('deleteQueryParams', () => {
    test('should delete query parameters if exists', () => {
      const requestQuery = { sy: '2002', q: 'query', pg: '1' };
      const result = deleteQueryParams(requestQuery, ['sy']);
      expect(result).toBe('q=query&pg=1&rpp=20&srt=best_match');
    });

    test('should delete multiple query parameters if exists', () => {
      const requestQuery = { sy: '2002', ty: '2023', q: 'query', pg: '1' };
      const result = deleteQueryParams(requestQuery, ['sy', 'ty']);
      expect(result).toBe('q=query&pg=1&rpp=20&srt=best_match');
    });

    test('should delete query parameters if exists and return without default parameters', () => {
      const requestQuery = { sy: '2002', q: 'query' };
      const result = deleteQueryParams(requestQuery, ['sy'], false);
      expect(result).toBe('q=query');
    });
  });

  describe('readQueryParams', () => {
    test('should read specific query parameter', () => {
      const requestQuery = { q: 'query', page: '1' };
      const result = readQueryParams(requestQuery, 'page');
      expect(result).toBe('1');
    });

    test('should return empty string if key does not exist', () => {
      const requestQuery = { q: 'query', page: '1' };
      const result = readQueryParams(requestQuery, 'rowsPerPage');
      expect(result).toBe('');
    });

    test('should include default parameters if specified', () => {
      const requestQuery = { q: 'query' };
      const result = readQueryParams(requestQuery, '', true);
      expect(result).toBe('q=query&pg=1&rpp=20&srt=best_match');
    });

    test('should not include default parameters if not specified', () => {
      const requestQuery = { q: 'query' };
      const result = readQueryParams(requestQuery);
      expect(result).toBe('q=query');
    });
  });

  describe('getDateParams', () => {
    test('should return date parameters from URLSearchParams', () => {
      const searchParams = new URLSearchParams(
        'fdd=01&fdm=01&fdy=2023&tdd=31&tdm=12&tdy=2023',
      );
      const result = getDateParams(searchParams);
      expect(result).toEqual({
        fdd: '01',
        fdm: '01',
        fdy: '2023',
        tdd: '31',
        tdm: '12',
        tdy: '2023',
      });
    });

    test('should return empty object if no date parameters', () => {
      const searchParams = new URLSearchParams();
      const result = getDateParams(searchParams);
      expect(result).toEqual({
        fdd: '',
        fdm: '',
        fdy: '',
        tdd: '',
        tdm: '',
        tdy: '',
      });
    });
  });

  describe('getExtentParams', () => {
    test('should return extent parameters from URLSearchParams', () => {
      const searchParams = new URLSearchParams('nth=1&sth=2&est=3&wst=4');
      const result = getExtentParams(searchParams);
      expect(result).toEqual({
        nth: '1',
        sth: '2',
        est: '3',
        wst: '4',
      });
    });

    test('should return empty object if no extent parameters', () => {
      const searchParams = new URLSearchParams();
      const result = getExtentParams(searchParams);
      expect(result).toEqual({
        nth: '',
        sth: '',
        est: '',
        wst: '',
      });
    });
  });

  describe('getFilterParams', () => {
    test('should return resourceType filter parameter from URLSearchParams', () => {
      const searchParams = new URLSearchParams('rty=test');
      const result = getFilterParams(searchParams);
      expect(result).toEqual({
        endDate: '',
        startDate: '',
        resourceType: 'test',
      });
    });

    test('should return empty object if no filter parameters', () => {
      const searchParams = new URLSearchParams();
      const result = getFilterParams(searchParams);
      expect(result).toEqual({
        resourceType: '',
        endDate: '',
        startDate: '',
      });
    });
  });

  describe('generateCountPayload', () => {
    test('should generate count payload with default values', () => {
      const requestQuery = { q: 'query', page: '1' };
      const result = generateCountPayload(requestQuery);
      expect(result).toEqual({
        fields: {
          keyword: { q: 'query' },
        },
        sort: '',
        rowsPerPage: 0,
        filters: {},
        page: null,
      });
    });
  });

  describe('generateQueryBuilderFields', () => {
    test('should generate fields with keyword only', () => {
      const requestQuery = { q: 'query' };
      const result = generateQueryBuilderFields(requestQuery);
      expect(result).toEqual({
        keyword: { q: 'query' },
      });
    });

    test('should generate fields with keyword and date parameters', () => {
      const requestQuery = {
        q: 'query',
        fdd: '01',
        fdm: '01',
        fdy: '2023',
        tdd: '31',
        tdm: '12',
        tdy: '2023',
      };
      const result = generateQueryBuilderFields(requestQuery);
      expect(result).toEqual({
        keyword: { q: 'query' },
        date: {
          fdd: '01',
          fdm: '01',
          fdy: '2023',
          tdd: '31',
          tdm: '12',
          tdy: '2023',
        },
      });
    });

    test('should generate fields with keyword and extent parameters', () => {
      const requestQuery = {
        q: 'query',
        nth: '1',
        sth: '2',
        est: '3',
        wst: '4',
      };
      const result = generateQueryBuilderFields(requestQuery);
      expect(result).toEqual({
        keyword: { q: 'query' },
        extent: {
          nth: '1',
          sth: '2',
          est: '3',
          wst: '4',
        },
      });
    });

    test('should generate fields with keyword, date, and extent parameters', () => {
      const requestQuery = {
        q: 'query',
        fdd: '01',
        fdm: '01',
        fdy: '2023',
        tdd: '31',
        tdm: '12',
        tdy: '2023',
        nth: '1',
        sth: '2',
        est: '3',
        wst: '4',
      };
      const result = generateQueryBuilderFields(requestQuery);
      expect(result).toEqual({
        keyword: { q: 'query' },
        date: {
          fdd: '01',
          fdm: '01',
          fdy: '2023',
          tdd: '31',
          tdm: '12',
          tdy: '2023',
        },
        extent: {
          nth: '1',
          sth: '2',
          est: '3',
          wst: '4',
        },
      });
    });

    test('should generate empty fields if no query parameters provided', () => {
      const requestQuery = {};
      const result = generateQueryBuilderFields(requestQuery);
      expect(result).toEqual({});
    });
  });

  describe('generateQueryBuilderPayload', () => {
    test('should generate payload with default values', () => {
      const requestQuery = { q: 'query' };
      const result = generateQueryBuilderPayload(requestQuery);
      expect(result).toEqual({
        fields: {
          keyword: { q: 'query' },
        },
        sort: 'best_match',
        page: 1,
        rowsPerPage: 20,
        filters: {},
      });
    });

    test('should generate payload with specified sort, page, and rowsPerPage', () => {
      const requestQuery = {
        q: 'query',
        srt: 'date',
        pg: '2',
        rpp: '10',
      };
      const result = generateQueryBuilderPayload(requestQuery);
      expect(result).toEqual({
        fields: {
          keyword: { q: 'query' },
        },
        sort: 'date',
        page: 2,
        rowsPerPage: 10,
        filters: {},
      });
    });

    test('should generate payload with filter parameters', () => {
      const requestQuery = { q: 'query', rty: 'article' };
      const result = generateQueryBuilderPayload(requestQuery);
      expect(result).toEqual({
        fields: {
          keyword: { q: 'query' },
        },
        sort: 'best_match',
        page: 1,
        rowsPerPage: 20,
        filters: {
          resourceTypeFilter: ['article'],
        },
      });
    });

    test('should generate payload with all available parameters', () => {
      const requestQuery = {
        q: 'query',
        fdd: '01',
        fdm: '01',
        fdy: '2023',
        tdd: '31',
        tdm: '12',
        tdy: '2023',
        nth: '1',
        sth: '2',
        est: '3',
        wst: '4',
        srt: 'date',
        pg: '2',
        rpp: '10',
        rty: 'article',
      };
      const result = generateQueryBuilderPayload(requestQuery);
      expect(result).toEqual({
        fields: {
          keyword: { q: 'query' },
          date: {
            fdd: '01',
            fdm: '01',
            fdy: '2023',
            tdd: '31',
            tdm: '12',
            tdy: '2023',
          },
          extent: {
            nth: '1',
            sth: '2',
            est: '3',
            wst: '4',
          },
        },
        sort: 'date',
        page: 2,
        rowsPerPage: 10,
        filters: {
          resourceTypeFilter: ['article'],
        },
      });
    });
  });
});
