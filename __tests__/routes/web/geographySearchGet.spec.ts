/**
 * @jest-environment jsdom
 */

'use strict';

import { Server, ServerInjectResponse } from '@hapi/hapi';

import { initializeServer } from '../../../src/infrastructure/server';
import { webRoutePaths } from '../../../src/utils/constants';

jest.mock('../../../src/infrastructure/plugins/appinsights-logger', () => ({
  info: jest.fn(),
}));

jest.mock('../../../src/utils/keyvault', () => ({
  getSecret: jest.fn(),
}));

describe('Guided Search - Geography Questionnaire Screen GET Request', () => {
  let server: Server;
  let response: ServerInjectResponse<object>;
  let document: Document;

  beforeAll((done) => {
    initializeServer().then(async (s: Server) => {
      server = s;

      const options = {
        method: 'GET',
        url: webRoutePaths.geographySearch,
      };

      response = await server.inject(options);
      const rawHTML = response.payload;
      const parser = new DOMParser();
      document = parser.parseFromString(rawHTML, 'text/html');
      done();
    });
  });

  afterAll((done) => {
    server.stop().then(() => done());
  });

  describe('Geography Questionnaire > Sanpshot verification', () => {
    it('should match the geography questionnaire screen snapshot', async () => {
      expect(response.payload).toMatchSnapshot();
    });
  });

  describe('Geography Questionnaire > Check route status code', () => {
    it('should /coordinate-search route works with status code 200', async () => {
      expect(response.statusCode).toEqual(200);
    });
  });

  describe('Geography Questionnaire > Back link block', () => {
    describe('Back link classes', () => {
      it('renders the back-link class', async () => {
        expect(document.querySelector('.govuk-back-link')).toBeTruthy();
      });
    });

    describe('Back link items', () => {
      it('should render 1 item', async () => {
        expect(document.querySelectorAll('.govuk-back-link')?.length).toEqual(
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
      it('renders 9 govuk-grid-row class', async () => {
        expect(document.querySelector('.govuk-grid-row')).toBeTruthy();
        expect(document.querySelectorAll('.govuk-grid-row').length).toEqual(9);
      });

      it('renders 2 govuk-grid-column-full class', async () => {
        expect(document.querySelector('.govuk-grid-column-full')).toBeTruthy();
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
        expect(document.querySelectorAll('.geography-buttons').length).toEqual(
          1,
        );
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
        expect(document.querySelector('.geography-fields__field')).toBeTruthy();
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
        expect(buttons.length).toBe(3);
      });

      it('should renders 2 secondary buttons', () => {
        const buttons = document?.querySelectorAll('.govuk-button--secondary');
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
        const buttonBlock = document?.querySelector('.geography-buttons__left');
        expect(buttonBlock?.childElementCount).toBe(1);
        const childElements = buttonBlock?.children;
        Array.from(childElements!).forEach((childElement) => {
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
