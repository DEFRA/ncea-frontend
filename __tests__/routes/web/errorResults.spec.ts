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

  describe('Validate error results page', () => {
    let response;
    let document;

    beforeAll(async () => {
      const responseObject = await invokeRoute(webRoutePaths.searchError);
      response = responseObject.response;
      document = responseObject.document;
    });

    it('should match the error screen snapshot', async () => {
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
