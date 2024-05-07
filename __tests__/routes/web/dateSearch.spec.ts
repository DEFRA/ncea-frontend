/**
 * @jest-environment jsdom
 */

'use strict';

import { Server, ServerInjectResponse } from '@hapi/hapi';

import { initializeServer } from '../../../src/infrastructure/server';
import { webRoutePaths } from '../../../src/utils/constants';

jest.mock('../../../src/infrastructure/plugins/appinsights-logger', () => ({
  logger: jest.fn(),
}));

jest.mock('../../../src/utils/keyvault', () => ({
  getSecret: jest.fn(),
}));

describe('Guided Search - Date Questionnaire Screen', () => {
  let server: Server;
  let response: ServerInjectResponse<object>;
  let document: Document;

  beforeAll((done) => {
    initializeServer().then(async (s: Server) => {
      server = s;

      const options = {
        method: 'GET',
        url: webRoutePaths.guidedDateSearch,
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

  describe('Guided Search > Date Questionnaire > Snapshot verification', () => {
    it('should match the date questionnaire screen snapshot', async () => {
      expect(response.payload).toMatchSnapshot();
    });
  });

  describe('Guided Search > Date Questionnaire > Check /results route status code', () => {
    it('should /guided-search route works with status code 200', async () => {
      expect(response.statusCode).toEqual(200);
    });
  });

  describe('Guided Search > Date Questionnaire > Back link block', () => {
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
        expect(anchor?.getAttribute('href')).toEqual(webRoutePaths.home);
        expect(anchor?.textContent?.trim()).toEqual('Back');
      });
    });
  });

  describe('Guided Search > Date Questionnaire block', () => {
    describe('Date Questionnaire block classes', () => {
      it('renders govuk-grid-column-full class', async () => {
        expect(document.querySelector('.govuk-grid-column-full')).toBeTruthy();
      });
    });

    describe('Date Questionnaire block heading', () => {
      it('should render the search container heading', async () => {
        expect(
          document
            ?.querySelectorAll('.govuk-heading-m')?.[0]
            ?.textContent?.trim(),
        ).toBe('When was the data or information collected?');
        expect(
          document
            ?.querySelectorAll('.govuk-heading-m')?.[1]
            ?.textContent?.trim(),
        ).toBe('From');
        expect(
          document
            ?.querySelectorAll('.govuk-heading-m')?.[2]
            ?.textContent?.trim(),
        ).toBe('To');
      });
    });

    describe('Date questionnaire form', () => {
      it('should render the form', async () => {
        const rowElements = document?.querySelectorAll('.govuk-grid-row');
        if (rowElements.length > 1) {
          const formElement = rowElements[1]?.firstElementChild;
          expect(formElement?.tagName.toLowerCase()).toBe('form');
        }
      });
    });

    describe('date questionnaire input field', () => {
      it('should renders with from date day id', () => {
        const inputElement = document?.querySelector('#day');
        expect(inputElement).toBeTruthy();
      });

      it('should renders with from date month id', () => {
        const inputElement = document?.querySelector('#month');
        expect(inputElement).toBeTruthy();
      });

      it('should renders with from date year id', () => {
        const inputElement = document?.querySelector('#year');
        expect(inputElement).toBeTruthy();
      });

      it('should renders with to date day id', () => {
        const inputElement = document?.querySelector('#day');
        expect(inputElement).toBeTruthy();
      });

      it('should renders with to date month id', () => {
        const inputElement = document?.querySelector('#month');
        expect(inputElement).toBeTruthy();
      });

      it('should renders with to date year id', () => {
        const inputElement = document?.querySelector('#year');
        expect(inputElement).toBeTruthy();
      });

      it('should renders a button', () => {
        const buttonElement = document?.querySelector(
          'button[data-module="govuk-button"]',
        );
        expect(buttonElement).toBeTruthy();
      });
    });
  });
});
