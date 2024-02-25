/**
 * @jest-environment jsdom
 */

'use strict';

import { Server } from '@hapi/hapi';

import { initializeServer } from '../../../src/infrastructure/server';
import supertest from 'supertest';
import { webRoutePaths } from '../../../src/utils/constants';

let serverRequest;

const invokeRoute = async (route) => {
  const response = await serverRequest
    .get(route)
    .set('referer', 'some_referer');
  const rawHTML = response.text;
  const parser = new DOMParser();
  const document = parser.parseFromString(rawHTML, 'text/html');
  return { response, document };
};

describe('Empty results template', () => {
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

  describe('Validate empty quick search journey results page', () => {
    let response;
    let document;

    beforeAll(async () => {
      const responseObject = await invokeRoute(webRoutePaths.emptyQuickSearch);
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
      ).toEqual('0 results found');
    });

    it('should render results empty heading properly', async () => {
      expect(
        document.querySelector('.search-result__heading')?.textContent?.trim(),
      ).toEqual('There are no matching results');
    });

    it('should render results empty content properly', async () => {
      expect(
        document.querySelector('.search-result__content')?.textContent?.trim(),
      ).toEqual('Search with different keywords.');
    });
  });

  describe('Validate empty guided search journey results page', () => {
    let response;
    let document;

    beforeAll(async () => {
      const responseObject = await invokeRoute(webRoutePaths.emptyGuidedSearch);
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
      ).toEqual('0 results found');
    });

    it('should render results empty heading properly', async () => {
      expect(
        document.querySelector('.search-result__heading')?.textContent?.trim(),
      ).toEqual('There are no matching results');
    });

    it('should render results empty content properly', async () => {
      expect(
        document.querySelector('.search-result__content')?.textContent?.trim(),
      ).toEqual('Choose different answers to see results.');
    });

    it('should render two secondary buttons', async () => {
      expect(
        document.querySelectorAll('.govuk-button--secondary')?.length,
      ).toBe(2);
    });
  });
});
