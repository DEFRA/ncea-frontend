/**
 * @jest-environment jsdom
 */

'use strict';

import { Server } from '@hapi/hapi';

import { initializeServer } from '../../../src/infrastructure/server';
import supertest from 'supertest';
import { webRoutePaths } from '../../../src/utils/constants';

jest.mock('../../../src/infrastructure/plugins/appinsights-logger', () => ({
  info: jest.fn(),
}));

jest.mock('../../../src/utils/keyvault', () => ({
  getSecret: jest.fn(),
}));

jest.mock('../../../src/config/elasticSearchClient', () => ({
  performQuery: jest.fn(() => {
    return Promise.resolve({ data: 'mocked response' });
  }),
}));

let serverRequest;

const getHTMLDocument = (rawHTML) => {
  const parser = new DOMParser();
  return parser.parseFromString(rawHTML, 'text/html');
};

const invokeRoute = async (route, payload) => {
  const response = await serverRequest.post(route).send(payload);
  const document = getHTMLDocument(response.text);
  return { response, document };
};

describe('Guided Search - Geography Questionnaire Screen POST Request', () => {
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

  describe('Status code & redirect to next route', () => {
    let response;

    beforeAll(async () => {
      const responseObject = await invokeRoute(webRoutePaths.geographySearch, {
        north: '2',
        south: '2',
        east: '2',
        west: '2',
      });
      response = responseObject.response;
    });

    it('should route works with status code 302', async () => {
      expect(response.statusCode).toEqual(302);
    });

    it('should redirect to results page', async () => {
      expect(response.redirect).toBe(true);
      expect(response.header.location).toBe(
        `${webRoutePaths.results}?nth=2&sth=2&est=2&wst=2&pg=1&rpp=20&srt=best_match`,
      );
    });
  });

  describe('HTML elements on the page with guided search POST validation', () => {
    let response;
    let document;

    beforeAll(async () => {
      const responseObject = await invokeRoute(webRoutePaths.geographySearch, {
        north: '2',
        south: '2',
        east: '2',
        west: '',
      });
      document = responseObject.document;
      response = responseObject.response;
    });

    describe('Sanpshot verification & status code', () => {
      it('should match the results screen snapshot', async () => {
        expect(response.text).toMatchSnapshot();
      });

      it('should route works with status code 400', async () => {
        expect(response.statusCode).toEqual(400);
      });
    });

    describe('Back link block', () => {
      describe('Back link classes', () => {
        it('renders the back-link class', async () => {
          expect(document.querySelector('.govuk-back-link')).toBeTruthy();
        });
      });

      describe('Back link items', () => {
        it('should render 1 item', async () => {
          expect(document.querySelectorAll('.govuk-back-link').length).toEqual(
            1,
          );
        });
      });

      describe('Back link  item options', () => {
        it('should render back link to date search page', async () => {
          const anchor = document.querySelector('.govuk-back-link');
          expect(anchor?.tagName.toLowerCase()).toBe('a');
          expect(anchor?.getAttribute('href')).toEqual(
            webRoutePaths.guidedDateSearch,
          );
          expect(anchor?.textContent?.trim()).toEqual('Back');
        });
      });
    });

    describe('Geography Questionnaire > Coordinate questionnaire form', () => {
      describe('Coordinate questionnaire block classes', () => {
        it('renders 8 govuk-grid-row class', async () => {
          expect(document.querySelector('.govuk-grid-row')).toBeTruthy();
          expect(document.querySelectorAll('.govuk-grid-row').length).toEqual(
            8,
          );
        });

        it('renders 2 govuk-grid-column-full class', async () => {
          expect(
            document.querySelector('.govuk-grid-column-full'),
          ).toBeTruthy();
          expect(
            document.querySelectorAll('.govuk-grid-column-full').length,
          ).toEqual(3);
        });

        it('renders 3 govuk-grid-column-one-half class', async () => {
          expect(
            document.querySelector('.govuk-grid-column-one-half'),
          ).toBeTruthy();
          expect(
            document.querySelectorAll('.govuk-grid-column-one-half').length,
          ).toEqual(2);
        });

        it('should render 1 geography-buttons class', async () => {
          expect(document.querySelector('.geography-buttons')).toBeTruthy();
          expect(
            document.querySelectorAll('.geography-buttons').length,
          ).toEqual(1);
        });

        it('should render 1 geography-fields__container class and should contain 5 child elements', async () => {
          const geographyContainer = document?.querySelectorAll(
            '.geography-fields__container',
          );
          expect(
            document?.querySelector('.geography-fields__container')
              ?.childElementCount,
          ).toEqual(5);
          expect(geographyContainer).toBeTruthy();
          expect(geographyContainer.length).toEqual(1);
        });

        it('should render 4 geography-fields__field class', async () => {
          expect(
            document.querySelector('.geography-fields__field'),
          ).toBeTruthy();
          expect(
            document.querySelectorAll('.geography-fields__field').length,
          ).toEqual(4);
        });
      });

      describe('Coordinate questionnaire block heading', () => {
        it('should render the block container heading', async () => {
          expect(
            document?.querySelector('.govuk-heading-l')?.textContent?.trim(),
          ).toBe('What geography does it cover?');
        });

        it('should render the block medium heading', async () => {
          expect(
            document
              ?.querySelector('.coordinate-sub-heading')
              ?.textContent?.trim(),
          ).toBe('Draw area on map');
        });
      });

      describe('Coordinate questionnaire form', () => {
        it('should render the form', async () => {
          const formElement = document?.querySelector(
            '[data-do-browser-storage]',
          );
          expect(formElement).toBeTruthy();
          expect(formElement?.tagName.toLowerCase()).toBe('form');
          expect(formElement?.getAttribute('action')).toBe(
            `${webRoutePaths.geographySearch}?`,
          );
        });
      });

      describe('Coordinate questionnaire input field', () => {
        it('should renders a north text input', () => {
          const inputElement = document?.querySelector('#north');
          expect(inputElement).toBeTruthy();
        });

        it('should renders a south text input', () => {
          const inputElement = document?.querySelector('#south');
          expect(inputElement).toBeTruthy();
        });

        it('should renders a east text input', () => {
          const inputElement = document?.querySelector('#east');
          expect(inputElement).toBeTruthy();
        });

        it('should renders a west text input', () => {
          const inputElement = document?.querySelector('#west');
          expect(inputElement).toBeTruthy();
        });
      });

      describe('Coordinate questionnaire buttons', () => {
        it('should renders 3 buttons', () => {
          const buttons = document?.querySelectorAll('.coordinate-buttons');
          expect(buttons).toBeTruthy();
          expect(buttons.length).toBe(2);
        });

        it('should renders 2 secondary buttons', () => {
          const buttons = document?.querySelectorAll(
            '.govuk-button--secondary',
          );
          expect(buttons).toBeTruthy();
          expect(buttons.length).toBe(1);
        });

        it('should renders 1 submit buttons', () => {
          const buttons = document?.querySelectorAll('button[data-to-disable]');
          expect(buttons).toBeTruthy();
          expect(buttons.length).toBe(1);
        });

      });
    });
  });

  describe('Guided search POST validation', () => {
    it('should fail action - when four coordinates are not present', async () => {
      const responseObject = await invokeRoute(webRoutePaths.geographySearch, {
        north: '2',
        south: '2',
        east: '2',
        west: '',
      });
      expect(responseObject.response.statusCode).toEqual(400);
    });
    it('should fail action - when the coordinates or depth is not a number', async () => {
      const responseObject = await invokeRoute(webRoutePaths.geographySearch, {
        north: 'north',
        south: '2',
        east: '2',
        west: '',
      });
      expect(responseObject.response.statusCode).toEqual(400);
    });
  });
});
