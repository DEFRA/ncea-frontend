/**
 * @jest-environment jsdom
 */

'use strict';

import { Server, ServerInjectResponse } from '@hapi/hapi';

import { initializeServer } from '../../../src/infrastructure/server';
import { webRoutePaths } from '../../../src/utils/constants';

describe('Results Screen', () => {
  let server: Server;
  let response: ServerInjectResponse<object>;
  let document: Document;

  beforeAll((done) => {
    initializeServer().then(async (s: Server) => {
      server = s;

      const options = {
        method: 'GET',
        url: webRoutePaths.results,
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

  describe('Results > Sanpshot verification', () => {
    it('should match the results screen snapshot', async () => {
      expect(response.payload).toMatchSnapshot();
    });
  });

  describe('Results > Check /results route status code', () => {
    it('should / route works with status code 200', async () => {
      expect(response.statusCode).toEqual(200);
    });
  });

  describe('Results > Breadcrumb block', () => {
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
        expect(anchor?.textContent?.trim()).toEqual('Search results');
      });
    });
  });

  describe('Results > Search block', () => {
    describe('Search block classes', () => {
      it('renders custom quick search container class', async () => {
        expect(document.querySelector('.quick_search-container')).toBeTruthy();
      });

      it('renders custom search block class', async () => {
        expect(document.querySelector('.search-block')).toBeTruthy();
      });
    });

    describe('Search block custom options', () => {
      it('renders attributes correctly', async () => {
        const searchBlock = document.querySelector('.search-block');
        expect(searchBlock?.getAttribute('data-module')).toEqual('search');
      });
    });

    describe('Search container content elements', () => {
      it('should render 2 child elements', async () => {
        const bannerContainer = document?.querySelector(
          '.quick_search-container'
        );
        expect(bannerContainer?.childElementCount).toEqual(2);
      });

      it('should not render caption on results screen', async () => {
        expect(
          document?.querySelector('.quick_search-container__caption-m')
        ).toBeNull();
      });
    });

    describe('Search container block heading', () => {
      it('should render the search container heading', async () => {
        expect(
          document
            ?.querySelector('.quick_search-container__heading-m')
            ?.textContent?.trim()
        ).toBe('Search');
      });

      it('should render the custom large class for heading', async () => {
        expect(
          document
            ?.querySelector('.quick_search-container__heading-m')
            ?.classList.contains('quick_search-container__heading-m--large')
        ).toBeTruthy();
      });
    });

    describe('Search container form', () => {
      it('should render the form', async () => {
        const formElement =
          document?.querySelector('.search-block')?.firstElementChild;
        expect(formElement?.tagName.toLowerCase()).toBe('form');
      });

      it('should render the form with options', async () => {
        const formElement =
          document?.querySelector('.search-block')?.firstElementChild;
        expect(formElement?.getAttribute('role')).toBe('search');
        expect(formElement?.getAttribute('action')).toBe('/search');
      });

      it('should render the form classes', async () => {
        const formElement =
          document?.querySelector('.search-block')?.firstElementChild;
        expect(
          formElement?.classList.contains('search-block__form')
        ).toBeTruthy();
        expect(
          formElement?.firstElementChild?.classList.contains('govuk-form-group')
        ).toBeTruthy();
      });
    });

    describe('Search container input field', () => {
      it('does render the input wrapper', () => {
        const wrapper = document?.querySelector(
          '.govuk-form-group > .govuk-input__wrapper'
        );
        expect(wrapper).toBeTruthy();
      });

      it('should render the input element', async () => {
        const inputElement = document?.querySelector(
          '.govuk-form-group > .govuk-input__wrapper'
        )?.firstElementChild;
        expect(inputElement?.tagName.toLowerCase()).toBe('input');
      });

      it('should renders with custom class', () => {
        const inputElement = document?.querySelector(
          '.govuk-form-group > .govuk-input__wrapper'
        )?.firstElementChild;
        expect(
          inputElement?.classList.contains('search-block__input')
        ).toBeTruthy();
      });

      it('should renders with id', () => {
        const inputElement = document?.querySelector('.search-block__input');
        expect(inputElement?.getAttribute('id')).toEqual('search');
      });

      it('should renders with name', () => {
        const inputElement = document?.querySelector('.search-block__input');
        expect(inputElement?.getAttribute('name')).toEqual('q');
      });

      it('should renders with type="text" by default', () => {
        const inputElement = document?.querySelector('.search-block__input');
        expect(inputElement?.getAttribute('type')).toEqual('text');
      });

      it('should renders with spellcheck attribute set to false', () => {
        const inputElement = document?.querySelector('.search-block__input');
        expect(inputElement?.getAttribute('spellcheck')).toEqual('false');
      });
    });

    describe('Search container when it includes a suffix', () => {
      it('should renders the suffix inside the wrapper', () => {
        const suffix = document?.querySelector(
          '.govuk-form-group > .govuk-input__wrapper > .govuk-input__suffix'
        );
        expect(suffix).toBeTruthy();
      });

      it('should renders a button in the suffix', () => {
        const buttonElement = document?.querySelector(
          '.govuk-form-group > .govuk-input__wrapper > .govuk-input__suffix'
        )?.firstElementChild;
        expect(buttonElement?.tagName?.toLowerCase()).toBe('button');
      });

      it('should renders a button with custom class in the suffix', () => {
        const buttonElement = document?.querySelector(
          '.govuk-form-group > .govuk-input__wrapper > .govuk-input__suffix'
        )?.firstElementChild;
        expect(
          buttonElement?.classList?.contains('search-block__button')
        ).toBeTruthy();
      });
    });
  });
});
