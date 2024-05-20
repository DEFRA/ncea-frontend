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

const invokeRoute = async (route) => {
  const response = await serverRequest.get(route);
  const rawHTML = response.text;
  const parser = new DOMParser();
  const document = parser.parseFromString(rawHTML, 'text/html');
  return { response, document };
};

describe('Accessibility Screen', () => {
  let server: Server;
  let response;
  let document: Document;

  beforeAll((done) => {
    initializeServer().then(async (s: Server) => {
      server = s;
      serverRequest = supertest(server.listener);

      const responseObject = await invokeRoute(
        webRoutePaths.accessibilityStatement,
      );
      response = responseObject.response;
      document = responseObject.document;
      done();
    });
  });

  afterAll((done) => {
    server.stop().then(() => done());
  });

  describe('Accessibility > Sanpshot verification', () => {
    it('should match the accessibility screen snapshot', async () => {
      expect(response?.text).toMatchSnapshot();
    });
  });

  describe('Accessibility > Check accessibility route status code', () => {
    it('should / route works with status code 200', async () => {
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
    it('should render 2 list items', async () => {
      const breadcrumbList = document?.querySelector(
        '.govuk-breadcrumbs__list',
      );
      expect(breadcrumbList?.childElementCount).toEqual(2);
    });
  });

  describe('Breadcrumb list item options', () => {
    it('should render home list item first child as an anchor tag', async () => {
      const breadcrumbItems = document?.querySelector(
        '.govuk-breadcrumbs__list',
      )?.children;
      const anchor = breadcrumbItems?.[0]?.firstElementChild;
      expect(anchor?.tagName.toLowerCase()).toBe('a');
      expect(anchor?.getAttribute('class')).toEqual('govuk-breadcrumbs__link');
      expect(anchor?.getAttribute('href')).toEqual(webRoutePaths.home);
      expect(anchor?.textContent?.trim()).toEqual('Home');
    });

    it('should not render accessibility statement list item second child not as an anchor', async () => {
      const item = document.querySelector(
        '.govuk-breadcrumbs__list',
      )?.lastElementChild;
      expect(item?.querySelector('a')).toBeNull();
      expect(item?.textContent?.trim()).toEqual('Accessibility statement');
    });
  });

  describe('Content section 1', () => {
    it('should render the heading Accessibility statement', async () => {
      const heading = document.querySelector('.ncea-static-page__heading-m');
      expect(heading?.textContent?.trim()).toEqual('Accessibility statement');
    });
    it('should render 3 items', async () => {
      const contentSections = document.querySelectorAll(
        '.ncea-static-page__content',
      );
      const content = contentSections?.[0];
      expect(content?.childElementCount).toBe(3);
    });
    it('should render 3 items content', async () => {
      const contentSections = document.querySelectorAll(
        '.ncea-static-page__content',
      );
      const content = contentSections?.[0];
      const items = content?.querySelectorAll(
        'p.ncea-static-page__content-item',
      );
      expect(items?.[0]?.textContent?.trim()).toEqual(
        'This accessibility statement applies to the Natural Capital Search Service.',
      );
      expect(items?.[1]?.textContent?.trim()).toEqual(
        'This service is run by the NCEA programme, on behalf of the Department for Environment, Food and Rural Affairs (Defra).',
      );
      expect(items?.[2]?.textContent?.trim()).toEqual(
        "We want as many people as possible to be able to use this website. It has been designed using GDS components and patterns, which are accessible. We've also made the website text as simple as possible to understand.",
      );
    });
  });

  describe('Content section 2', () => {
    it('should render the heading', async () => {
      const headings = document.querySelectorAll(
        '.ncea-static-page__heading-s',
      );
      const heading = headings[0];
      expect(heading?.textContent?.trim()).toEqual(
        "What we're doing to improve accessibility",
      );
    });
    it('should render 3 items', async () => {
      const contentSections = document.querySelectorAll(
        '.ncea-static-page__content',
      );
      const content = contentSections?.[1];
      expect(content?.childElementCount).toBe(3);
    });
    it('should render 3 items content', async () => {
      const contentSections = document.querySelectorAll(
        '.ncea-static-page__content',
      );
      const content = contentSections?.[1];
      const items = content?.querySelectorAll(
        'p.ncea-static-page__content-item',
      );
      expect(items?.[0]?.textContent?.trim()).toEqual(
        'This service is currently in private beta. It does not yet fully meet Web Content Accessibility Guidelines version 2.2 AA standard.',
      );
      expect(items?.[1]?.textContent?.trim()).toEqual(
        'An accessibility audit will take place during private beta. After the audit, we will work alongside other government departments and agencies to fix content which fails to meet the Web Content Accessibility Guidelines version 2.2 AA standard.',
      );
      expect(items?.[2]?.textContent?.trim()).toEqual(
        'An updated accessibility statement will be published after this date.',
      );
    });
  });

  describe('Content section 3', () => {
    it('should render the heading', async () => {
      const headings = document.querySelectorAll(
        '.ncea-static-page__heading-s',
      );
      const heading = headings[1];
      expect(heading?.textContent?.trim()).toEqual(
        'Feedback and contact information',
      );
    });
    it('should render 1 item', async () => {
      const contentSections = document.querySelectorAll(
        '.ncea-static-page__content',
      );
      const content = contentSections?.[2];
      expect(content?.childElementCount).toBe(1);
    });
    it('should render 1 item content', async () => {
      const contentSections = document.querySelectorAll(
        '.ncea-static-page__content',
      );
      const content = contentSections?.[2];
      const items = content?.querySelectorAll(
        'p.ncea-static-page__content-item',
      );
      expect(items?.[0]?.textContent?.trim()).toEqual(
        'If you would like to give feedback or report accessibility problems with this service, email us at NCEAemail@email.com.',
      );
    });
  });

  describe('Content section 4', () => {
    it('should render the heading', async () => {
      const headings = document.querySelectorAll(
        '.ncea-static-page__heading-s',
      );
      const heading = headings[2];
      expect(heading?.textContent?.trim()).toEqual(
        'Preparation of this accessibility statement',
      );
    });
    it('should render 1 item', async () => {
      const contentSections = document.querySelectorAll(
        '.ncea-static-page__content',
      );
      const content = contentSections?.[3];
      expect(content?.childElementCount).toBe(2);
    });
    it('should render 1 item content', async () => {
      const contentSections = document.querySelectorAll(
        '.ncea-static-page__content',
      );
      const content = contentSections?.[3];
      const items = content?.querySelectorAll(
        'p.ncea-static-page__content-item',
      );
      expect(items?.[0]?.textContent?.trim()).toEqual(
        'This statement was prepared on 26 April 2024.',
      );
      expect(items?.[1]?.textContent?.trim()).toEqual(
        'Last updated 29 April 2024.',
      );
    });
  });
});
