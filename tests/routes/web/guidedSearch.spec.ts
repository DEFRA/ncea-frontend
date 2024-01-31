/**
 * @jest-environment jsdom
 */

'use strict';

import { Server, ServerInjectResponse } from '@hapi/hapi';

import { initializeServer } from '../../../src/infrastructure/server';
import { webRoutePaths } from '../../../src/utils/constants';

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

  describe('Guided Search > Date Questionnaire > Sanpshot verification', () => {
    it('should match the date questionnaire screen snapshot', async () => {
      expect(response.payload).toMatchSnapshot();
    });
  });

  describe('Guided Search > Date Questionnaire > Check /results route status code', () => {
    it('should /guided-search route works with status code 200', async () => {
      expect(response.statusCode).toEqual(200);
    });
  });

  describe('Guided Search > Date Questionnaire > Breadcrumb block', () => {
    describe('Breadcrumb classes', () => {
      it('renders the container class', async () => {
        expect(document.querySelector('.govuk-breadcrumbs')).toBeTruthy();
      });

      it('renders the breadcrumb list class', async () => {
        expect(document.querySelector('.govuk-breadcrumbs__list')).toBeTruthy();
      });
    });

    describe('Breadcrumb list items', () => {
      it('should render 2 list items', async () => {
        const breadcrumbList = document?.querySelector(
          '.govuk-breadcrumbs__list'
        );
        expect(breadcrumbList?.childElementCount).toEqual(2);
      });
    });

    describe('Breadcrumb list item options', () => {
      it('should render home list item as a first child', async () => {
        const item = document.querySelector('.govuk-breadcrumbs__list')
          ?.firstElementChild;
        const anchor = item?.firstElementChild;
        expect(anchor?.tagName.toLowerCase()).toBe('a');
        expect(anchor?.getAttribute('class')).toEqual(
          'govuk-breadcrumbs__link'
        );
        expect(anchor?.getAttribute('href')).toEqual(webRoutePaths.home);
        expect(anchor?.textContent?.trim()).toEqual('Home');
      });

      it('should render search results list item as a second child', async () => {
        const item = document.querySelector('.govuk-breadcrumbs__list')
          ?.lastElementChild;
        const anchor = item?.firstElementChild;
        expect(anchor?.tagName.toLowerCase()).toBe('a');
        expect(anchor?.getAttribute('class')).toEqual(
          'govuk-breadcrumbs__link'
        );
        expect(anchor?.getAttribute('href')).toEqual('#');
        expect(anchor?.textContent?.trim()).toEqual('Questionnaire search');
      });
    });
  });

  describe('Guided Search > Date Questionnaire block', () => {
    describe('Date Questionnaire block classes', () => {
      it('renders govuk-grid-column-two-thirds class', async () => {
        expect(
          document.querySelector('.govuk-grid-column-two-thirds')
        ).toBeTruthy();
      });
    });

    describe('Date Questionnaire block heading', () => {
      it('should render the search container heading', async () => {
        expect(
          document
            ?.querySelectorAll('.govuk-heading-m')?.[0]
            ?.textContent?.trim()
        ).toBe('When was the data or information collected?');
        expect(
          document
            ?.querySelectorAll('.govuk-heading-m')?.[1]
            ?.textContent?.trim()
        ).toBe('From');
        expect(
          document
            ?.querySelectorAll('.govuk-heading-m')?.[2]
            ?.textContent?.trim()
        ).toBe('To');
      });
    });

    describe('Date questionnaire form', () => {
      it('should render the form', async () => {
        const formElement =
          document?.querySelector('.govuk-grid-row')?.firstElementChild;
        expect(formElement?.tagName.toLowerCase()).toBe('form');
      });
    });

    describe('date questionnaire input field', () => {
      it('should renders with from date day id', () => {
        const inputElement = document?.querySelector('#from-date-day');
        expect(inputElement).toBeTruthy();
      });

      it('should renders with from date month id', () => {
        const inputElement = document?.querySelector('#from-date-month');
        expect(inputElement).toBeTruthy();
      });

      it('should renders with from date year id', () => {
        const inputElement = document?.querySelector('#from-date-year');
        expect(inputElement).toBeTruthy();
      });

      it('should renders with to date day id', () => {
        const inputElement = document?.querySelector('#to-date-day');
        expect(inputElement).toBeTruthy();
      });

      it('should renders with to date month id', () => {
        const inputElement = document?.querySelector('#to-date-month');
        expect(inputElement).toBeTruthy();
      });

      it('should renders with to date year id', () => {
        const inputElement = document?.querySelector('#to-date-year');
        expect(inputElement).toBeTruthy();
      });

      it('should renders a button', () => {
        const buttonElement = document?.querySelector(
          'button[data-module="govuk-button"]'
        );
        expect(buttonElement).toBeTruthy();
      });
    });
  });
});
