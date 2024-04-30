/**
 * @jest-environment jsdom
 */

'use strict';

import { IAggregationOption } from '../../../src/interfaces/searchResponse.interface';
import { Server } from '@hapi/hapi';

import { initializeServer } from '../../../src/infrastructure/server';
import supertest from 'supertest';
import { webRoutePaths } from '../../../src/utils/constants';
import {
  getResourceTypeOptions,
  getSearchResults,
} from '../../../src/services/handlers/searchApi';
import {
  searchResultsWithData,
  searchResultsWithEmptyData,
} from '../../data/searchResultsResponse';

jest.mock('../../../src/services/handlers/searchApi', () => ({
  getSearchResults: jest.fn(),
  getResourceTypeOptions: jest.fn(),
}));

jest.mock('../../../src/infrastructure/plugins/appinsights-logger', () => ({
  info: jest.fn(),
}));

jest.mock('../../../src/utils/keyvault', () => ({
  getSecret: jest.fn(),
}));

let serverRequest;

const invokeRoute = async (route, query) => {
  const response = await serverRequest.get(route).query({ ...query });
  const rawHTML = response.text;
  const parser = new DOMParser();
  const document = parser.parseFromString(rawHTML, 'text/html');
  return { response, document };
};

describe('Results block template', () => {
  let server: Server;

  beforeAll(async () => {
    initializeServer().then(async (s: Server) => {
      server = s;
      serverRequest = supertest(server.listener);
    });
  });

  afterAll((done) => {
    server.stop().then(() => done());
  });

  describe('Quick search journey', () => {
    describe('Search results with data', () => {
      let response;
      let document;

      beforeAll(async () => {
        (getSearchResults as jest.Mock).mockResolvedValue(
          searchResultsWithData,
        );
        const expectedResourceTypeOptions: IAggregationOption[] = [
          { value: 'filter1', text: 'Filter1' },
          { value: 'filter2', text: 'Filter2' },
        ];
        (getResourceTypeOptions as jest.Mock).mockResolvedValue(
          expectedResourceTypeOptions,
        );
        const responseObject = await invokeRoute(webRoutePaths.results, {
          q: 'marine',
          jry: 'qs',
          pg: '1',
          rpp: '20',
          srt: 'best_match',
          rty: 'all',
        });
        response = responseObject.response;
        document = responseObject.document;
      });

      it('should match the results screen snapshot', async () => {
        expect(response.text).toMatchSnapshot();
      });

      it('should route works with status code 200', async () => {
        expect(response.statusCode).toEqual(200);
      });

      it('should render results stats properly', async () => {
        expect(
          document.querySelector('.results-stats')?.textContent?.trim(),
        ).toEqual(`${searchResultsWithData.total} results`);
      });

      it('should render the result items properly', async () => {
        const resultItemsBlock = document.querySelector(
          '.search-result__items',
        );
        const resultItems = resultItemsBlock.children;
        expect(resultItems.length).toBe(searchResultsWithData.total);
        Array.from(resultItems).forEach((resultItem: any, index) => {
          const dateValue = searchResultsWithData?.items[index]?.studyPeriod;

          expect(
            resultItem
              .querySelector('.search-result__heading')
              ?.textContent?.trim(),
          ).toEqual(searchResultsWithData?.items[index]?.title);

          expect(
            resultItem
              .querySelector('.search-result__published-label')
              ?.textContent?.trim(),
          ).toBe('Published by');
          expect(
            resultItem
              .querySelector('.search-result__published-value')
              ?.textContent?.trim(),
          ).toBe(searchResultsWithData?.items[index]?.publishedBy);

          expect(
            resultItem
              .querySelector('.search-result__study-label')
              ?.textContent?.trim(),
          ).toBe('Study period');

          expect(
            resultItem
              .querySelector('.search-result__study-value')
              ?.textContent?.trim(),
          ).toBe(dateValue);
        });
      });
    });

    describe('Search results with empty data', () => {
      let response;
      let document;

      beforeAll(async () => {
        (getSearchResults as jest.Mock).mockResolvedValue(
          searchResultsWithEmptyData,
        );
        const expectedResourceTypeOptions: IAggregationOption[] = [
          { value: 'filter1', text: 'Filter1' },
          { value: 'filter2', text: 'Filter2' },
        ];
        (getResourceTypeOptions as jest.Mock).mockResolvedValue(
          expectedResourceTypeOptions,
        );
        const responseObject = await invokeRoute(webRoutePaths.results, {
          q: 'marine',
          jry: 'qs',
          pg: '1',
          rpp: '20',
          srt: 'best_match',
          rty: 'all',
        });
        response = responseObject.response;
        document = responseObject.document;
      });

      it('should match the results screen snapshot', async () => {
        expect(response.text).toMatchSnapshot();
      });

      it('should route works with status code 200', async () => {
        expect(response.statusCode).toEqual(200);
      });

      it('should render results stats properly', async () => {
        expect(
          document.querySelector('.results-stats')?.textContent?.trim(),
        ).toEqual(`${searchResultsWithEmptyData.total} results found`);
      });

      it('should render results empty heading properly', async () => {
        expect(
          document
            .querySelector('.search-result__heading')
            ?.textContent?.trim(),
        ).toEqual('There are no matching results');
      });

      it('should render results empty content properly', async () => {
        expect(
          document
            .querySelector('.search-result__content')
            ?.textContent?.trim(),
        ).toEqual('Search with different keywords.');
      });
    });

    describe('Search results with error', () => {
      let response;
      let document;

      beforeAll(async () => {
        (getSearchResults as jest.Mock).mockRejectedValue(
          new Error('mocked error'),
        );
        const responseObject = await invokeRoute(webRoutePaths.results, {
          q: 'marine',
          jry: 'qs',
          pg: '1',
          rpp: '20',
          srt: 'best_match',
          rty: 'all',
        });
        response = responseObject.response;
        document = responseObject.document;
      });

      it('should match the results screen snapshot', async () => {
        expect(response.text).toMatchSnapshot();
      });

      it('should route works with status code 200', async () => {
        expect(response.statusCode).toEqual(200);
      });

      it('should render the error message', async () => {
        expect(
          document.querySelector('.govuk-caption-m')?.textContent?.trim(),
        ).toEqual('Unable to fetch the search results. Please try again.');
      });
    });
  });

  describe('Guided search journey', () => {
    describe('Search results with empty data', () => {
      let response;
      let document;

      beforeAll(async () => {
        (getSearchResults as jest.Mock).mockResolvedValue(
          searchResultsWithEmptyData,
        );
        const expectedResourceTypeOptions: IAggregationOption[] = [
          { value: 'filter1', text: 'Filter1' },
          { value: 'filter2', text: 'Filter2' },
        ];
        (getResourceTypeOptions as jest.Mock).mockResolvedValue(
          expectedResourceTypeOptions,
        );
        const responseObject = await invokeRoute(webRoutePaths.results, {
          fdy: '2000',
          tdy: '2023',
          jry: 'gs',
          pg: '1',
          rpp: '20',
          srt: 'best_match',
          rty: 'all',
        });
        response = responseObject.response;
        document = responseObject.document;
      });

      it('should match the results screen snapshot', async () => {
        expect(response.text).toMatchSnapshot();
      });

      it('should route works with status code 200', async () => {
        expect(response.statusCode).toEqual(200);
      });

      it('should render results stats properly', async () => {
        expect(
          document.querySelector('.results-stats')?.textContent?.trim(),
        ).toEqual(`${searchResultsWithEmptyData.total} results found`);
      });

      it('should render results empty heading properly', async () => {
        expect(
          document
            .querySelector('.search-result__heading')
            ?.textContent?.trim(),
        ).toEqual('There are no matching results');
      });

      it('should render results empty content properly', async () => {
        expect(
          document
            .querySelector('.search-result__content')
            ?.textContent?.trim(),
        ).toEqual('Choose different answers to see results.');
      });

      it('should render three secondary buttons', async () => {
        expect(
          document.querySelectorAll('.govuk-button--secondary')?.length,
        ).toBe(3);
      });
    });

    describe('Search results with error', () => {
      let response;
      let document;

      beforeAll(async () => {
        (getSearchResults as jest.Mock).mockRejectedValue(
          new Error('mocked error'),
        );
        const responseObject = await invokeRoute(webRoutePaths.results, {
          fdy: '2000',
          tdy: '2023',
          jry: 'gs',
          pg: '1',
          rpp: '20',
          srt: 'best_match',
          rty: 'all',
        });
        response = responseObject.response;
        document = responseObject.document;
      });

      it('should match the results screen snapshot', async () => {
        expect(response.text).toMatchSnapshot();
      });

      it('should route works with status code 200', async () => {
        expect(response.statusCode).toEqual(200);
      });

      it('should render the error message', async () => {
        expect(
          document.querySelector('.govuk-caption-m')?.textContent?.trim(),
        ).toEqual('Unable to fetch the search results. Please try again.');
      });
    });
  });
});
