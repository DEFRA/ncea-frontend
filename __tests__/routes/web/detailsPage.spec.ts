/**
 * @jest-environment jsdom
 */

'use strict';

import { Server } from '@hapi/hapi';

import { getDocumentDetails } from '../../../src/services/handlers/searchApi';
import { initializeServer } from '../../../src/infrastructure/server';
import supertest from 'supertest';
import { webRoutePaths } from '../../../src/utils/constants';
import {
  formattedDetailsFullResponse,
  formattedDetailsResponse,
} from '../../data/documentDetailsResponse';

jest.mock('../../../src/services/handlers/searchApi', () => ({
  getDocumentDetails: jest.fn(),
}));

jest.mock('../../../src/infrastructure/plugins/appinsights-logger', () => ({
  info: jest.fn(),
}));

jest.mock('../../../src/utils/keyvault', () => ({
  getSecret: jest.fn(),
}));

let serverRequest;
const detailsFullResponse = formattedDetailsFullResponse?.items?.[0];
const detailsPartialResponse = formattedDetailsResponse?.items?.[0];

const invokeRoute = async (route) => {
  const response = await serverRequest.get(route);
  const rawHTML = response.text;
  const parser = new DOMParser();
  const document = parser.parseFromString(rawHTML, 'text/html');
  return { response, document };
};

describe('Details route template', () => {
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

  describe('Document details with data', () => {
    let response;
    let document;

    beforeAll(async () => {
      (getDocumentDetails as jest.Mock).mockResolvedValue(detailsFullResponse);
      const responseObject = await invokeRoute(
        `${webRoutePaths.results}/{1234-56789213123-1233-1234}`,
      );
      response = responseObject.response;
      document = responseObject.document;
    });

    describe('Check status code and snapshot', () => {
      it('should match the results screen snapshot', async () => {
        expect(response.text).toMatchSnapshot();
      });

      it('should route works with status code 200', async () => {
        expect(response.statusCode).toEqual(200);
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
      it('should render 3 list items', async () => {
        const breadcrumbList = document?.querySelector(
          '.govuk-breadcrumbs__list',
        );
        expect(breadcrumbList?.childElementCount).toEqual(3);
      });
    });

    describe('Breadcrumb list item options', () => {
      it('should render home list item as a first child', async () => {
        const breadcrumbItems = document.querySelector(
          '.govuk-breadcrumbs__list',
        )?.children;
        const anchor = breadcrumbItems[0]?.firstElementChild;
        expect(anchor?.tagName.toLowerCase()).toBe('a');
        expect(anchor?.getAttribute('class')).toEqual(
          'govuk-breadcrumbs__link',
        );
        expect(anchor?.getAttribute('href')).toEqual(webRoutePaths.home);
        expect(anchor?.textContent?.trim()).toEqual('Home');
      });

      it('should render search results list item as a second child', async () => {
        const breadcrumbItems = document.querySelector(
          '.govuk-breadcrumbs__list',
        )?.children;
        const anchor = breadcrumbItems[1]?.firstElementChild;
        expect(anchor?.tagName.toLowerCase()).toBe('a');
        expect(anchor?.getAttribute('class')).toEqual(
          'govuk-breadcrumbs__link',
        );
        expect(anchor?.getAttribute('href')).toEqual(`${webRoutePaths.results}?`);
        expect(anchor?.textContent?.trim()).toEqual('Search results');
      });

      it('should render search results list item as a second child', async () => {
        const breadcrumbItems = document.querySelector(
          '.govuk-breadcrumbs__list',
        )?.children;
        const anchor = breadcrumbItems[2]?.firstElementChild;
        expect(anchor?.tagName.toLowerCase()).toBe('a');
        expect(anchor?.getAttribute('class')).toEqual(
          'govuk-breadcrumbs__link',
        );
        expect(anchor?.getAttribute('href')).toEqual('#');
        expect(anchor?.textContent?.trim()).toEqual(detailsFullResponse?.title);
      });
    });

    describe('Hero block content', () => {
      it('should render the title', async () => {
        const titleElement = document.querySelector('.details-title');
        expect(titleElement?.textContent?.trim()).toBe(
          detailsFullResponse?.title,
        );
        expect(titleElement?.tagName.toLowerCase()).toBe('h1');
      });

      it('should render the alternate title', async () => {
        const altTitleBlockElement =
          document.querySelector('.details-alt_title');
        expect(altTitleBlockElement).toBeDefined();
        const altTitleBlockHeadingElement = document.querySelector(
          '.govuk-details__summary-text',
        );
        const altTitleBlockValueElement = document.querySelector(
          '.govuk-details__text',
        );
        expect(altTitleBlockHeadingElement?.textContent?.trim()).toBe(
          'Alternate title (additional business name or alternative language)',
        );
        expect(altTitleBlockHeadingElement?.tagName.toLowerCase()).toBe('span');
        expect(altTitleBlockValueElement?.textContent?.trim()).toBe(
          detailsFullResponse?.alternateTitle,
        );
        expect(altTitleBlockValueElement?.tagName.toLowerCase()).toBe('div');
      });

      it('should render the Go to resource button and modal', async () => {
        const buttonElement = document.querySelector('.govuk-button');
        expect(buttonElement).toBeTruthy();
        expect(buttonElement.hasAttribute('disabled')).toBeFalsy();
        expect(document.querySelector('.modal')).toBeTruthy();
      });

      it('should not render the Go to resource button parent div with a class', async () => {
        const parentElement =
          document.querySelector('.govuk-button')?.parentElement;
        expect(parentElement).toBeTruthy();
        expect(parentElement?.tagName?.toLowerCase()).toBe('div');
        expect(
          parentElement?.classList?.contains('open-data-block--disabled'),
        ).toBeFalsy();
      });

      it('should not render the Go to resource text', async () => {
        expect(document.querySelector('.open-data-block--tag')).toBeFalsy();
      });
    });

    describe('Tab block details', () => {
      it('should render the 7 tabs', async () => {
        const tabList = document?.querySelector('.govuk-tabs__list');
        expect(tabList?.childElementCount).toEqual(7);
      });
    });

    describe('General tab and it`s content', () => {
      let generalTabElement, containerElement;
      beforeAll(async () => {
        generalTabElement = document?.getElementById('general');
        containerElement = generalTabElement?.firstElementChild;
      });

      it('should render the general tab', async () => {
        const tabList = document?.querySelector('.govuk-tabs__list');
        const tabListItems = tabList?.children;
        const tabItem = tabListItems?.[0]?.firstElementChild;
        expect(tabItem?.textContent?.trim()).toBe('General');
        expect(tabItem?.tagName.toLowerCase()).toBe('a');
        expect(tabItem?.getAttribute('class')).toEqual('govuk-tabs__tab');
        expect(tabItem?.getAttribute('href')).toEqual('#general');
      });

      it('should render the abstract details', async () => {
        expect(generalTabElement).toBeTruthy();
        expect(containerElement).toBeTruthy();
        const rowElement = containerElement?.children?.[0];
        const labelElement = rowElement?.children?.[0];
        const valueElement = rowElement?.children?.[1];
        expect(labelElement?.tagName.toLowerCase()).toBe('h2');
        expect(labelElement?.textContent?.trim()).toBe('Abstract');
        expect(valueElement?.tagName.toLowerCase()).toBe('span');
        expect(valueElement?.textContent?.trim()).toBe(
          detailsFullResponse?.content,
        );
      });

      it('should render the study periods details', async () => {
        expect(generalTabElement).toBeTruthy();
        expect(containerElement).toBeTruthy();
        const rowElement = containerElement?.children?.[1];
        const labelElement = rowElement?.children?.[0];
        const valueElement = rowElement?.children?.[1];
        expect(labelElement?.tagName.toLowerCase()).toBe('h2');
        expect(labelElement?.textContent?.trim()).toBe('Study periods');
        expect(valueElement?.tagName.toLowerCase()).toBe('span');
        expect(valueElement?.textContent?.trim()).toBe(
          detailsFullResponse?.studyPeriod,
        );
      });

      it('should render the topic categories details', async () => {
        expect(generalTabElement).toBeTruthy();
        expect(containerElement).toBeTruthy();
        const rowElement = containerElement?.children?.[2];
        const labelElement = rowElement?.children?.[0];
        const valueElement = rowElement?.children?.[1];
        expect(labelElement?.tagName.toLowerCase()).toBe('h2');
        expect(labelElement?.textContent?.trim()).toBe('Topic categories');
        expect(valueElement?.tagName.toLowerCase()).toBe('span');
        expect(valueElement?.textContent?.trim()).toBe(
          detailsFullResponse?.topicCategories,
        );
      });

      it('should render the keywords details', async () => {
        expect(generalTabElement).toBeTruthy();
        expect(containerElement).toBeTruthy();
        const rowElement = containerElement?.children?.[3];
        const labelElement = rowElement?.children?.[0];
        const valueElement = rowElement?.children?.[1];
        expect(labelElement?.tagName.toLowerCase()).toBe('h2');
        expect(labelElement?.textContent?.trim()).toBe('Keywords');
        expect(valueElement?.tagName.toLowerCase()).toBe('span');
        expect(valueElement?.textContent?.trim()).toBe(
          detailsFullResponse?.keywords,
        );
      });

      it('should render the language details', async () => {
        expect(generalTabElement).toBeTruthy();
        expect(containerElement).toBeTruthy();
        const rowElement = containerElement?.children?.[4];
        const labelElement = rowElement?.children?.[0];
        const valueElement = rowElement?.children?.[1];
        expect(labelElement?.tagName.toLowerCase()).toBe('h2');
        expect(labelElement?.textContent?.trim()).toBe('Languages');
        expect(valueElement?.tagName.toLowerCase()).toBe('span');
        expect(valueElement?.textContent?.trim()).toBe(
          detailsFullResponse?.language,
        );
      });
    });
  });

  describe('Document details with partial data', () => {
    let response;
    let document;

    beforeAll(async () => {
      (getDocumentDetails as jest.Mock).mockResolvedValue(
        detailsPartialResponse,
      );
      const responseObject = await invokeRoute(
        `${webRoutePaths.results}/{1234-56789213123-1233-1234}`,
      );
      response = responseObject.response;
      document = responseObject.document;
    });

    describe('Check status code and snapshot', () => {
      it('should match the results screen snapshot', async () => {
        expect(response.text).toMatchSnapshot();
      });

      it('should route works with status code 200', async () => {
        expect(response.statusCode).toEqual(200);
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
      it('should render 3 list items', async () => {
        const breadcrumbList = document?.querySelector(
          '.govuk-breadcrumbs__list',
        );
        expect(breadcrumbList?.childElementCount).toEqual(3);
      });
    });

    describe('Breadcrumb list item options', () => {
      it('should render home list item as a first child', async () => {
        const breadcrumbItems = document.querySelector(
          '.govuk-breadcrumbs__list',
        )?.children;
        const anchor = breadcrumbItems[0]?.firstElementChild;
        expect(anchor?.tagName.toLowerCase()).toBe('a');
        expect(anchor?.getAttribute('class')).toEqual(
          'govuk-breadcrumbs__link',
        );
        expect(anchor?.getAttribute('href')).toEqual(webRoutePaths.home);
        expect(anchor?.textContent?.trim()).toEqual('Home');
      });

      it('should render search results list item as a second child', async () => {
        const breadcrumbItems = document.querySelector(
          '.govuk-breadcrumbs__list',
        )?.children;
        const anchor = breadcrumbItems[1]?.firstElementChild;
        expect(anchor?.tagName.toLowerCase()).toBe('a');
        expect(anchor?.getAttribute('class')).toEqual(
          'govuk-breadcrumbs__link',
        );
        expect(anchor?.getAttribute('href')).toEqual(`${webRoutePaths.results}?`);
        expect(anchor?.textContent?.trim()).toEqual('Search results');
      });

      it('should render search results list item as a second child', async () => {
        const breadcrumbItems = document.querySelector(
          '.govuk-breadcrumbs__list',
        )?.children;
        const anchor = breadcrumbItems[2]?.firstElementChild;
        expect(anchor?.tagName.toLowerCase()).toBe('a');
        expect(anchor?.getAttribute('class')).toEqual(
          'govuk-breadcrumbs__link',
        );
        expect(anchor?.getAttribute('href')).toEqual('#');
        expect(anchor?.textContent?.trim()).toEqual(
          detailsPartialResponse?.title,
        );
      });
    });

    describe('Hero block content', () => {
      it('should render the title', async () => {
        const titleElement = document.querySelector('.details-title');
        expect(titleElement?.textContent?.trim()).toBe(
          detailsPartialResponse?.title,
        );
        expect(titleElement?.tagName.toLowerCase()).toBe('h1');
      });

      it('should not render the alternate title', async () => {
        const altTitleBlockElement =
          document.querySelector('.details-alt_title');
        expect(altTitleBlockElement).toBeNull();
      });

      it('should render the Go to resource button with disabled state and with out modal', async () => {
        const buttonElement = document.querySelector('.govuk-button');
        expect(buttonElement).toBeTruthy();
        expect(buttonElement.hasAttribute('disabled')).toBeTruthy();
        expect(document.querySelector('.modal')).toBeFalsy();
      });

      it('should not render the Go to resource button parent div with a class', async () => {
        const parentElement =
          document.querySelector('.govuk-button')?.parentElement;
        expect(parentElement).toBeTruthy();
        expect(parentElement?.tagName?.toLowerCase()).toBe('div');
        expect(
          parentElement?.classList?.contains('open-data-block--disabled'),
        ).toBeTruthy();
      });

      it('should render the Go to resource text', async () => {
        const openDataTagElement = document.querySelector(
          '.open-data-block--tag',
        );
        expect(openDataTagElement).toBeDefined();
        expect(openDataTagElement?.tagName?.toLowerCase()).toBe('span');
        expect(openDataTagElement?.textContent?.trim()).toBe(
          'Access to this data resource is by application to the owner - please refer to access tab for further details',
        );
      });
    });

    describe('Tab block details', () => {
      it('should render the 7 tabs', async () => {
        const tabList = document?.querySelector('.govuk-tabs__list');
        expect(tabList?.childElementCount).toEqual(7);
      });
    });

    describe('General tab and it`s content', () => {
      let generalTabElement, containerElement;
      beforeAll(async () => {
        generalTabElement = document?.getElementById('general');
        containerElement = generalTabElement?.firstElementChild;
      });

      it('should render the general tab', async () => {
        const tabList = document?.querySelector('.govuk-tabs__list');
        const tabListItems = tabList?.children;
        const tabItem = tabListItems?.[0]?.firstElementChild;
        expect(tabItem?.textContent?.trim()).toBe('General');
        expect(tabItem?.tagName.toLowerCase()).toBe('a');
        expect(tabItem?.getAttribute('class')).toEqual('govuk-tabs__tab');
        expect(tabItem?.getAttribute('href')).toEqual('#general');
      });

      it('should render the abstract details', async () => {
        expect(generalTabElement).toBeTruthy();
        expect(containerElement).toBeTruthy();
        const rowElement = containerElement?.children?.[0];
        const labelElement = rowElement?.children?.[0];
        const valueElement = rowElement?.children?.[1];
        expect(labelElement?.tagName.toLowerCase()).toBe('h2');
        expect(labelElement?.textContent?.trim()).toBe('Abstract');
        expect(valueElement?.tagName.toLowerCase()).toBe('strong');
        expect(valueElement?.textContent?.trim()).toBe('NOT PROVIDED');
      });

      it('should render the study periods details', async () => {
        expect(generalTabElement).toBeTruthy();
        expect(containerElement).toBeTruthy();
        const rowElement = containerElement?.children?.[1];
        const labelElement = rowElement?.children?.[0];
        const valueElement = rowElement?.children?.[1];
        expect(labelElement?.tagName.toLowerCase()).toBe('h2');
        expect(labelElement?.textContent?.trim()).toBe('Study periods');
        expect(valueElement?.tagName.toLowerCase()).toBe('strong');
        expect(valueElement?.textContent?.trim()).toBe('NOT PROVIDED');
      });

      it('should render the topic categories details', async () => {
        expect(generalTabElement).toBeTruthy();
        expect(containerElement).toBeTruthy();
        const rowElement = containerElement?.children?.[2];
        const labelElement = rowElement?.children?.[0];
        const valueElement = rowElement?.children?.[1];
        expect(labelElement?.tagName.toLowerCase()).toBe('h2');
        expect(labelElement?.textContent?.trim()).toBe('Topic categories');
        expect(valueElement?.tagName.toLowerCase()).toBe('strong');
        expect(valueElement?.textContent?.trim()).toBe('NOT PROVIDED');
      });

      it('should render the keywords details', async () => {
        expect(generalTabElement).toBeTruthy();
        expect(containerElement).toBeTruthy();
        const rowElement = containerElement?.children?.[3];
        const labelElement = rowElement?.children?.[0];
        const valueElement = rowElement?.children?.[1];
        expect(labelElement?.tagName.toLowerCase()).toBe('h2');
        expect(labelElement?.textContent?.trim()).toBe('Keywords');
        expect(valueElement?.tagName.toLowerCase()).toBe('strong');
        expect(valueElement?.textContent?.trim()).toBe('NOT PROVIDED');
      });

      it('should render the language details', async () => {
        expect(generalTabElement).toBeTruthy();
        expect(containerElement).toBeTruthy();
        const rowElement = containerElement?.children?.[4];
        const labelElement = rowElement?.children?.[0];
        const valueElement = rowElement?.children?.[1];
        expect(labelElement?.tagName.toLowerCase()).toBe('h2');
        expect(labelElement?.textContent?.trim()).toBe('Languages');
        expect(valueElement?.tagName.toLowerCase()).toBe('span');
        expect(valueElement?.textContent?.trim()).toBe(
          detailsFullResponse?.language,
        );
      });
    });
  });
});
