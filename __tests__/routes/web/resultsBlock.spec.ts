/**
 * @jest-environment jsdom
 */

'use strict';

import { Server } from '@hapi/hapi';

import { getSearchResults } from '../../../src/services/handlers/searchApi';
import { initializeServer } from '../../../src/infrastructure/server';
import supertest from 'supertest';
import { webRoutePaths } from '../../../src/utils/constants';
import {
  searchResultsWithData,
  searchResultsWithEmptyData,
} from '../../data/searchResultsResponse';

jest.mock('../../../src/services/handlers/searchApi', () => ({
  getSearchResults: jest.fn(),
}));

jest.mock('../../../src/infrastructure/plugins/appinsights-logger', () => ({
  info: jest.fn(),
}));

let serverRequest;

const invokeRoute = async (route, payload) => {
  const response = await serverRequest.post(route).send(payload);
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
        const responseObject = await invokeRoute(webRoutePaths.getResults, {
          fields: { 'quick-search': { search_term: 'test' } },
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
        const responseObject = await invokeRoute(webRoutePaths.getResults, {
          fields: { 'quick-search': { search_term: 'test' } },
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
        const responseObject = await invokeRoute(webRoutePaths.getResults, {
          fields: { 'quick-search': { search_term: 'test' } },
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
        const responseObject = await invokeRoute(webRoutePaths.getResults, {
          fields: {
            'date-search': { 'from-date-year': '2022', 'to-date-year': '2022' },
          },
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

      it('should render two secondary buttons', async () => {
        expect(
          document.querySelectorAll('.govuk-button--secondary')?.length,
        ).toBe(2);
      });
    });

    describe('Search results with error', () => {
      let response;
      let document;

      beforeAll(async () => {
        (getSearchResults as jest.Mock).mockRejectedValue(
          new Error('mocked error'),
        );
        const responseObject = await invokeRoute(webRoutePaths.getResults, {
          fields: {
            'date-search': { 'from-date-year': '2022', 'to-date-year': '2022' },
          },
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
