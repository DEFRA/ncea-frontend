/**
 * @jest-environment jsdom
 */

'use strict';

import { Server, ServerInjectResponse } from '@hapi/hapi';

import { initializeServer, startServer } from '../../../src/infrastructure/server';
import { webRoutePaths } from '../../../src/utils/constants';
import { getSearchResults } from '../../../src/services/handlers/searchResultsApi';
import {ApiResponse} from '../../../src/Models/ApiResponse';

jest.mock('../../../src/services/handlers/searchResultsApi');
jest.mock('../../../src/infrastructure/plugins/appinsights-logger', () => ({
  logger: jest.fn()
}));

describe('Results Screen', () => {
  let server: Server;
  let response: ServerInjectResponse<object>;
  let document: Document;

  beforeAll(async() => {
    server = await initializeServer();
    await startServer();
    
    (getSearchResults as jest.Mock).mockResolvedValue(
      new ApiResponse({}, 200, true)
    );
  });

  afterAll((done) => {
    server.stop().then(() => done());
  });

  describe('/POST quick search', () => {
    it('handler flow', async () => {
      const options = {
        method: 'POST',
        url: webRoutePaths.results,
        payload: JSON.stringify({
          q: 'test',
          pageName: 'home'
        }),
      };
      server.inject(options).then(resp => {
        response = resp
        const rawHTML = response.payload;
        const parser = new DOMParser();
        document = parser.parseFromString(rawHTML, 'text/html');

        expect(response.statusCode).toEqual(200);
        expect(response.payload).toMatchSnapshot();
 
        expect(document.querySelector('.govuk-breadcrumbs')).toBeTruthy();
    
        expect(document.querySelector('.govuk-breadcrumbs__list')).toBeTruthy();
     
        const breadcrumbList = document?.querySelector(
          '.govuk-breadcrumbs__list'
        );
        expect(breadcrumbList?.childElementCount).toEqual(2);
     
        const item = document.querySelector('.govuk-breadcrumbs__list')
          ?.firstElementChild;
        const anchor = item?.firstElementChild;
        expect(anchor?.tagName.toLowerCase()).toBe('a');
        expect(anchor?.getAttribute('class')).toEqual(
          'govuk-breadcrumbs__link'
        );
        expect(anchor?.getAttribute('href')).toEqual(webRoutePaths.home);
        expect(anchor?.textContent?.trim()).toEqual('Home');
        expect(anchor?.tagName.toLowerCase()).toBe('a');
        expect(anchor?.getAttribute('class')).toEqual(
          'govuk-breadcrumbs__link'
        );
        expect(anchor?.getAttribute('href')).toEqual('#');
        expect(anchor?.textContent?.trim()).toEqual('Search results');
      
        expect(document.querySelector('.quick_search-container')).toBeTruthy();
      
        expect(document.querySelector('.search-block')).toBeTruthy();
      
        const searchBlock = document.querySelector('.search-block');
        expect(searchBlock?.getAttribute('data-module')).toEqual('search');
      
        const bannerContainer = document?.querySelector(
          '.quick_search-container'
        );
        expect(bannerContainer?.childElementCount).toEqual(2);
      
        expect(
          document?.querySelector('.quick_search-container__caption-m')
        ).toBeNull();
      
        expect(
          document
            ?.querySelector('.quick_search-container__heading-m')
            ?.textContent?.trim()
        ).toBe('Search');
      
        expect(
          document
            ?.querySelector('.quick_search-container__heading-m')
            ?.classList.contains('quick_search-container__heading-m--large')
        ).toBeTruthy();
     
        const formElement =
          document?.querySelector('.search-block')?.firstElementChild;
        expect(formElement?.tagName.toLowerCase()).toBe('form');
 
        expect(formElement?.getAttribute('role')).toBe('search');
        expect(formElement?.getAttribute('action')).toBe('/search');
      
        expect(
          formElement?.classList.contains('search-block__form')
        ).toBeTruthy();
        expect(
          formElement?.firstElementChild?.classList.contains('govuk-form-group')
        ).toBeTruthy();
      
        const wrapper = document?.querySelector(
          '.govuk-form-group > .govuk-input__wrapper'
        );
        expect(wrapper).toBeTruthy();
      
        const inputElement = document?.querySelector(
          '.govuk-form-group > .govuk-input__wrapper'
        )?.firstElementChild;
        expect(inputElement?.tagName.toLowerCase()).toBe('input');
      
        expect(
          inputElement?.classList.contains('search-block__input')
        ).toBeTruthy();
      
        const inputElement1 = document?.querySelector('.search-block__input');
        expect(inputElement1?.getAttribute('id')).toEqual('search');
      
        expect(inputElement1?.getAttribute('name')).toEqual('q');
      
        expect(inputElement1?.getAttribute('type')).toEqual('text');
      
        expect(inputElement1?.getAttribute('spellcheck')).toEqual('false');
      
        const suffix = document?.querySelector(
          '.govuk-form-group > .govuk-input__wrapper > .govuk-input__suffix'
        );
        expect(suffix).toBeTruthy();
      
        const buttonElement = document?.querySelector(
          '.govuk-form-group > .govuk-input__wrapper > .govuk-input__suffix'
        )?.firstElementChild;
        expect(buttonElement?.tagName?.toLowerCase()).toBe('button');
      
        expect(
          buttonElement?.classList?.contains('search-block__button')
        ).toBeTruthy();
      });
    });
    it('fail action - empty search term', async () => {
      const options = {
        method: 'POST',
        url: webRoutePaths.results,
        payload: JSON.stringify({
          q: '',
          pageName: 'home'
        }),
      };
      server.inject(options).then(response => {
        expect(response.statusCode).toEqual(400);
        expect(response.payload).toMatchSnapshot();
      });
    });
    it('fail action - min length validation', async () => {
      const options = {
        method: 'POST',
        url: webRoutePaths.results,
        payload: JSON.stringify({
          q: 'foo',
          pageName: 'home'
        }),
      };
      server.inject(options).then(response => {
        expect(response.statusCode).toEqual(400);
        expect(response.payload).toMatchSnapshot();
      });
    });
  });
});