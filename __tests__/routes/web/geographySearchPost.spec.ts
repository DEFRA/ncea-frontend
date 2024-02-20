/**
 * @jest-environment jsdom
 */

'use strict';

import { Server } from '@hapi/hapi';

import { initializeServer } from '../../../src/infrastructure/server';
import supertest from 'supertest';
import { webRoutePaths } from '../../../src/utils/constants';

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
        depth: '',
      });
      response = responseObject.response;
    });

    it('should route works with status code 302', async () => {
      expect(response.statusCode).toEqual(302);
    });

    it('should redirect to results page', async () => {
      expect(response.redirect).toBe(true);
      expect(response.header.location).toBe(webRoutePaths.results);
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
        depth: '',
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

    describe('Breadcrumb block', () => {
      describe('Breadcrumb classes', () => {
        it('renders the container class', async () => {
          expect(document.querySelector('.govuk-breadcrumbs')).toBeTruthy();
        });

        it('renders the breadcrumb list class', async () => {
          expect(
            document.querySelector('.govuk-breadcrumbs__list'),
          ).toBeTruthy();
        });
      });

      describe('Breadcrumb list items', () => {
        it('should render 1 list item', async () => {
          const breadcrumbList = document?.querySelector(
            '.govuk-breadcrumbs__list',
          );
          expect(breadcrumbList?.childElementCount).toEqual(1);
        });
      });

      describe('Breadcrumb list item options', () => {
        it('should render home list item as a first child', async () => {
          const item = document.querySelector(
            '.govuk-breadcrumbs__list',
          )?.firstElementChild;
          const anchor = item?.firstElementChild;
          expect(anchor?.tagName.toLowerCase()).toBe('a');
          expect(anchor?.getAttribute('class')).toEqual(
            'govuk-breadcrumbs__link',
          );
          expect(anchor?.getAttribute('href')).toEqual(
            webRoutePaths.guidedDateSearch,
          );
          expect(anchor?.textContent?.trim()).toEqual('Back');
        });
      });
    });

    describe('Geography Questionnaire > Coordinate questionnaire form', () => {
      describe('Coordinate questionnaire block classes', () => {
        it('renders 4 govuk-grid-row class', async () => {
          expect(document.querySelector('.govuk-grid-row')).toBeTruthy();
          expect(document.querySelectorAll('.govuk-grid-row').length).toEqual(
            6,
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
          ).toEqual(3);
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

        it('should render 5 geography-fields__field class', async () => {
          expect(
            document.querySelector('.geography-fields__field'),
          ).toBeTruthy();
          expect(
            document.querySelectorAll('.geography-fields__field').length,
          ).toEqual(5);
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
            document?.querySelector('.govuk-heading-m')?.textContent?.trim(),
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
            webRoutePaths.geographySearch,
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
          const buttons = document?.querySelectorAll(
            'button[data-module="govuk-button"], a[data-module="govuk-button"]',
          );
          expect(buttons).toBeTruthy();
          expect(buttons.length).toBe(3);
        });

        it('should renders 2 secondary buttons', () => {
          const buttons = document?.querySelectorAll(
            '.govuk-button--secondary',
          );
          expect(buttons).toBeTruthy();
          expect(buttons.length).toBe(2);
        });

        it('should renders 1 submit buttons', () => {
          const buttons = document?.querySelectorAll('button[data-to-disable]');
          expect(buttons).toBeTruthy();
          expect(buttons.length).toBe(1);
        });

        it('should layout buttons in two columns', () => {
          const buttonBlock = document?.querySelector('.geography-buttons');
          expect(
            buttonBlock?.firstElementChild?.classList.contains(
              'geography-buttons__left',
            ),
          ).toBeTruthy();
          expect(
            buttonBlock?.lastElementChild?.classList.contains(
              'geography-buttons__right',
            ),
          ).toBeTruthy();
        });

        it('should have 1 button in left layout', () => {
          const buttonBlock = document?.querySelector(
            '.geography-buttons__left',
          );
          expect(buttonBlock?.childElementCount).toBe(1);
          const childElements = buttonBlock?.children;
          Array.from(childElements!).forEach((childElement: any) => {
            expect(childElement.tagName.toLowerCase()).toEqual('a');
          });
        });

        it('should have 2 buttons in right layout', () => {
          const buttonBlock = document?.querySelector(
            '.geography-buttons__right',
          );
          expect(buttonBlock?.childElementCount).toBe(2);
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
        depth: '',
      });
      expect(responseObject.response.statusCode).toEqual(400);
    });
    it('should fail action - when the coordinates or depth is not a number', async () => {
      const responseObject = await invokeRoute(webRoutePaths.geographySearch, {
        north: 'north',
        south: '2',
        east: '2',
        west: '',
        depth: '',
      });
      expect(responseObject.response.statusCode).toEqual(400);
    });
  });
});
