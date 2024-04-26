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

let serverRequest;

const invokeRoute = async (route, payload, method = 'post') => {
  let response;
  if (method === 'post') {
    response = await serverRequest.post(route).send(payload);
  } else {
    response = await serverRequest.get(route).query({ ...payload });
  }
  const rawHTML = response.text;
  const parser = new DOMParser();
  const document = parser.parseFromString(rawHTML, 'text/html');
  return { response, document };
};

const successPayload = {
  search_term: 'test',
  pageName: 'home',
};

describe('Results Screen', () => {
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

  describe('Sanpshot verification & status code', () => {
    let response;

    beforeAll(async () => {
      const responseObject = await invokeRoute(
        webRoutePaths.results,
        successPayload,
      );
      response = responseObject.response;
    });

    it('should match the results screen snapshot', async () => {
      expect(response.text).toMatchSnapshot();
    });

    it('should route works with status code 302', async () => {
      expect(response.statusCode).toEqual(302);
    });
  });

  describe('Quick search POST verification on results page', () => {
    let document;
    let response;
    const redirectedRoute = `${webRoutePaths.results}?q=test&jry=qs&pg=1&rpp=20&srt=best_match&rty=all`;

    beforeAll(async () => {
      const responseObject = await invokeRoute(
        webRoutePaths.results,
        successPayload,
      );
      response = responseObject.response;
      const redirectedResponseObject = await invokeRoute(
        response.headers.location,
        {
          q: 'test',
          jry: 'qs',
          pg: '1',
          rpp: '20',
          srt: 'best_match',
          rty: 'all',
        },
      );
      document = redirectedResponseObject.document;
    });

    describe('Check the redirection', () => {
      it('should redirect to the results get route with query params', async () => {
        expect(response.status).toBe(302);
        expect(response.headers.location).toBe(redirectedRoute);
      });
    });

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
          '.govuk-breadcrumbs__list',
        );
        expect(breadcrumbList?.childElementCount).toEqual(2);
      });
    });

    describe('Breadcrumb list item options', () => {
      it('should render home list item first child as an anchor', async () => {
        const item = document.querySelector(
          '.govuk-breadcrumbs__list',
        )?.firstElementChild;
        const anchor = item?.firstElementChild;
        expect(anchor?.tagName.toLowerCase()).toBe('a');
        expect(anchor?.getAttribute('class')).toEqual(
          'govuk-breadcrumbs__link',
        );
        expect(anchor?.getAttribute('href')).toEqual(webRoutePaths.home);
        expect(anchor?.textContent?.trim()).toEqual('Home');
      });

      it('should not render search results list item second child as an anchor', async () => {
        const item = document.querySelector(
          '.govuk-breadcrumbs__list',
        )?.lastElementChild;
        expect(item.querySelector('a')).toBeNull();
        expect(item?.textContent?.trim()).toEqual('Search results');
      });
    });
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
          '.quick_search-container',
        );
        expect(bannerContainer?.childElementCount).toEqual(2);
      });

      it('should not render caption on results screen', async () => {
        expect(
          document?.querySelector('.quick_search-container__caption-m'),
        ).toBeNull();
      });
    });

    describe('Search container block heading', () => {
      it('should render the search container heading', async () => {
        expect(
          document
            ?.querySelector('.quick_search-container__heading-m')
            ?.textContent?.trim(),
        ).toBe('Search');
      });

      it('should render the custom large class for heading', async () => {
        expect(
          document
            ?.querySelector('.quick_search-container__heading-m')
            ?.classList.contains('quick_search-container__heading-m--large'),
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
        expect(formElement?.getAttribute('action')).toBe(webRoutePaths.results);
      });

      it('should render the form classes', async () => {
        const formElement =
          document?.querySelector('.search-block')?.firstElementChild;
        expect(
          formElement?.classList.contains('search-block__form'),
        ).toBeTruthy();
        expect(
          formElement?.firstElementChild?.classList.contains(
            'govuk-form-group',
          ),
        ).toBeTruthy();
      });
    });

    describe('Search container input field', () => {
      it('does render the input wrapper', () => {
        const wrapper = document?.querySelector(
          '.govuk-form-group > .govuk-input__wrapper',
        );
        expect(wrapper).toBeTruthy();
      });

      it('should render the input element', async () => {
        const inputElement = document?.querySelector(
          '.govuk-form-group > .govuk-input__wrapper',
        )?.firstElementChild;
        expect(inputElement?.tagName.toLowerCase()).toBe('input');
      });

      it('should renders with custom class', () => {
        const inputElement = document?.querySelector(
          '.govuk-form-group > .govuk-input__wrapper',
        )?.firstElementChild;
        expect(
          inputElement?.classList.contains('search-block__input'),
        ).toBeTruthy();
      });

      it('should renders with id', () => {
        const inputElement = document?.querySelector('.search-block__input');
        expect(inputElement?.getAttribute('id')).toEqual('search_term');
      });

      it('should renders with name', () => {
        const inputElement = document?.querySelector('.search-block__input');
        expect(inputElement?.getAttribute('name')).toEqual('search_term');
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
          '.govuk-form-group > .govuk-input__wrapper > .govuk-input__suffix',
        );
        expect(suffix).toBeTruthy();
      });

      it('should renders a button in the suffix', () => {
        const buttonElement = document?.querySelector(
          '.govuk-form-group > .govuk-input__wrapper > .govuk-input__suffix',
        )?.firstElementChild;
        expect(buttonElement?.tagName?.toLowerCase()).toBe('button');
      });

      it('should renders a button with custom class in the suffix', () => {
        const buttonElement = document?.querySelector(
          '.govuk-form-group > .govuk-input__wrapper > .govuk-input__suffix',
        )?.firstElementChild;
        expect(
          buttonElement?.classList?.contains('search-block__button'),
        ).toBeTruthy();
      });
    });
  });

  describe('Quick search POST validation on results page', () => {
    it('fail action - empty search term', async () => {
      const responseObject = await invokeRoute(webRoutePaths.results, {
        search_term: '',
        pageName: 'results',
      });
      expect(responseObject.response.statusCode).toEqual(400);
    });
    it('fail action - min length validation', async () => {
      const responseObject = await invokeRoute(webRoutePaths.results, {
        search_term: 'foo',
        pageName: 'results',
      });
      expect(responseObject.response.statusCode).toEqual(400);
    });
  });

  describe('Quick search POST validation on home page', () => {
    let document;

    beforeAll(async () => {
      const responseObject = await invokeRoute(webRoutePaths.results, {
        search_term: '',
        pageName: 'home',
      });
      document = responseObject.document;
    });

    describe('Breadcrumb classes', () => {
      it('should not render the breadcrumb class', async () => {
        expect(document.querySelector('.govuk-breadcrumbs')).toBeNull();
      });
    });

    describe('Hero content block classes', () => {
      it('renders custom full width class', async () => {
        expect(document.querySelector('.full-width-banner')).toBeTruthy();
      });

      it('renders custom banner container class', async () => {
        expect(document.querySelector('.banner-container')).toBeTruthy();
      });
    });

    describe('Hero content elements', () => {
      it('should render 2 child elements', async () => {
        const bannerContainer = document?.querySelector('.banner-container');
        expect(bannerContainer?.childElementCount).toEqual(2);
      });
    });

    describe('Hero content block heading', () => {
      it('should render the hero content heading', async () => {
        expect(
          document
            ?.querySelector('.banner-container__heading-xl')
            ?.textContent?.trim(),
        ).toBe('Natural Capital Search Service');
      });
    });

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
      it('should render 3 child elements', async () => {
        const bannerContainer = document?.querySelector(
          '.quick_search-container',
        );
        expect(bannerContainer?.childElementCount).toEqual(3);
      });

      it('should render caption on home screen', async () => {
        expect(
          document?.querySelector('.quick_search-container__caption-m'),
        ).toBeTruthy();
      });
    });

    describe('Search container block heading', () => {
      it('should render the search container heading', async () => {
        expect(
          document
            ?.querySelector('.quick_search-container__heading-m')
            ?.textContent?.trim(),
        ).toBe('Quick Search');
      });

      it('should not render the custom large class for heading', async () => {
        expect(
          document
            ?.querySelector('.quick_search-container__heading-m')
            ?.classList.contains('quick_search-container__heading-m--large'),
        ).toBeFalsy();
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
        expect(formElement?.getAttribute('action')).toBe(webRoutePaths.results);
      });

      it('should render the form classes', async () => {
        const formElement =
          document?.querySelector('.search-block')?.firstElementChild;
        expect(
          formElement?.classList.contains('search-block__form'),
        ).toBeTruthy();
        expect(
          formElement?.firstElementChild?.classList.contains(
            'govuk-form-group',
          ),
        ).toBeTruthy();
      });
    });

    describe('Search container input field', () => {
      it('does render the input wrapper', () => {
        const wrapper = document?.querySelector(
          '.govuk-form-group > .govuk-input__wrapper',
        );
        expect(wrapper).toBeTruthy();
      });

      it('should render the input element', async () => {
        const inputElement = document?.querySelector(
          '.govuk-form-group > .govuk-input__wrapper',
        )?.firstElementChild;
        expect(inputElement?.tagName.toLowerCase()).toBe('input');
      });

      it('should renders with custom class', () => {
        const inputElement = document?.querySelector(
          '.govuk-form-group > .govuk-input__wrapper',
        )?.firstElementChild;
        expect(
          inputElement?.classList.contains('search-block__input'),
        ).toBeTruthy();
      });

      it('should renders with id', () => {
        const inputElement = document?.querySelector('.search-block__input');
        expect(inputElement?.getAttribute('id')).toEqual('search_term');
      });

      it('should renders with name', () => {
        const inputElement = document?.querySelector('.search-block__input');
        expect(inputElement?.getAttribute('name')).toEqual('search_term');
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
          '.govuk-form-group > .govuk-input__wrapper > .govuk-input__suffix',
        );
        expect(suffix).toBeTruthy();
      });

      it('should renders a button in the suffix', () => {
        const buttonElement = document?.querySelector(
          '.govuk-form-group > .govuk-input__wrapper > .govuk-input__suffix',
        )?.firstElementChild;
        expect(buttonElement?.tagName?.toLowerCase()).toBe('button');
      });

      it('should renders a button with custom class in the suffix', () => {
        const buttonElement = document?.querySelector(
          '.govuk-form-group > .govuk-input__wrapper > .govuk-input__suffix',
        )?.firstElementChild;
        expect(
          buttonElement?.classList?.contains('search-block__button'),
        ).toBeTruthy();
      });
    });

    describe('YouTube video block classes', () => {
      it('renders custom video container class', async () => {
        expect(document.querySelector('.video-container')).toBeTruthy();
      });

      it('renders custom video frame class', async () => {
        expect(document.querySelector('.video-container__frame')).toBeTruthy();
      });
    });

    describe('YouTube video block elements', () => {
      it('should render 2 child elements', async () => {
        const videoContainer = document?.querySelector('.video-container');
        expect(videoContainer?.childElementCount).toEqual(2);
      });
    });

    describe('YouTube video block heading', () => {
      it('should render the video content heading', async () => {
        expect(
          document
            ?.querySelector('.video-container__heading-m')
            ?.textContent?.trim(),
        ).toBe('What is natural capital?');
      });
    });

    describe('YouTube video frame options', () => {
      it('should render youtube video in iframe', async () => {
        const videoFrame = document?.querySelector('.video-container__frame');
        expect(videoFrame?.firstElementChild?.tagName.toLowerCase()).toBe(
          'iframe',
        );
      });

      it('should render youtube video url', async () => {
        const videoFrame = document?.querySelector('.video-container__frame');
        expect(videoFrame?.firstElementChild?.getAttribute('src')).toBe(
          'https://www.youtube.com/embed/4wx0rMruSJo?si=h-SD8VoSUSNwqo1S',
        );
      });
    });

    describe('Questionnaire search container block heading', () => {
      it('should render the questionnaire search container heading', async () => {
        expect(
          document
            ?.querySelectorAll('.govuk-heading-m')?.[1]
            ?.textContent?.trim(),
        ).toBe('Questionnaire search');
      });

      it('should not render the custom large class for heading', async () => {
        expect(
          document
            ?.querySelectorAll('.govuk-heading-m')?.[1]
            ?.classList.contains('govuk-heading-m--large'),
        ).toBeFalsy();
      });
    });

    describe('Questionnaire search block action', () => {
      it('should render the questionnaire search button', () => {
        const anchorElement = document?.querySelector('.govuk-button--start');
        expect(anchorElement?.tagName?.toLowerCase()).toBe('a');
      });
    });
  });
});
