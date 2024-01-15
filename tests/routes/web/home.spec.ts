/**
 * @jest-environment jsdom
 */

'use strict';

import { Server } from '@hapi/hapi';

import { initializeServer } from '../../../src/infrastructure/server';
import { webRoutePaths } from '../../../src/utils/constants';

describe('Home Screen', () => {
  let server: Server;

  beforeAll((done) => {
    initializeServer().then((s: Server) => {
      server = s;
      done();
    });
  });

  afterAll((done) => {
    server.stop().then(() => done());
  });

  describe('Home > Sanpshot verification', () => {
    it('should match the home screen snapshot', async () => {
      const options = {
        method: 'GET',
        url: webRoutePaths.home,
      };

      const response = await server.inject(options);
      expect(response.payload).toMatchSnapshot();
    });
  });

  describe('Home > Check home route status code', () => {
    it('should / route works with status code 200', async () => {
      const options = {
        method: 'GET',
        url: webRoutePaths.home,
      };

      const response = await server.inject(options);
      expect(response.statusCode).toEqual(200);
    });
  });

  describe('Home > Hero block', () => {
    describe('Hero content block classes', () => {
      it('renders custom full width class', async () => {
        const options = {
          method: 'GET',
          url: webRoutePaths.home,
        };

        const response = await server.inject(options);
        const rawHTML = response.payload;
        const parser = new DOMParser();
        const document = parser.parseFromString(rawHTML, 'text/html');
        expect(document.querySelector('.full-width-banner')).toBeTruthy();
      });

      it('renders custom banner container class', async () => {
        const options = {
          method: 'GET',
          url: webRoutePaths.home,
        };

        const response = await server.inject(options);
        const rawHTML = response.payload;
        const parser = new DOMParser();
        const document = parser.parseFromString(rawHTML, 'text/html');
        expect(document.querySelector('.banner-container')).toBeTruthy();
      });
    });

    describe('Hero content elements', () => {
      it('should render 2 child elements', async () => {
        const options = {
          method: 'GET',
          url: webRoutePaths.home,
        };

        const response = await server.inject(options);
        const rawHTML = response.payload;
        const parser = new DOMParser();
        const document = parser.parseFromString(rawHTML, 'text/html');
        const bannerContainer = document?.querySelector('.banner-container');
        expect(bannerContainer?.childElementCount).toEqual(2);
      });
    });

    describe('Hero content block heading', () => {
      it('should render the hero content heading', async () => {
        const options = {
          method: 'GET',
          url: webRoutePaths.home,
        };

        const response = await server.inject(options);
        const rawHTML = response.payload;
        const parser = new DOMParser();
        const document = parser.parseFromString(rawHTML, 'text/html');
        expect(
          document
            ?.querySelector('.banner-container__heading-xl')
            ?.textContent?.trim()
        ).toBe('Natural Capital Search Service');
      });
    });
  });

  describe('Home > YouTube video block', () => {
    describe('YouTube video block classes', () => {
      it('renders custom video container class', async () => {
        const options = {
          method: 'GET',
          url: webRoutePaths.home,
        };

        const response = await server.inject(options);
        const rawHTML = response.payload;
        const parser = new DOMParser();
        const document = parser.parseFromString(rawHTML, 'text/html');
        expect(document.querySelector('.video-container')).toBeTruthy();
      });

      it('renders custom video frame class', async () => {
        const options = {
          method: 'GET',
          url: webRoutePaths.home,
        };

        const response = await server.inject(options);
        const rawHTML = response.payload;
        const parser = new DOMParser();
        const document = parser.parseFromString(rawHTML, 'text/html');
        expect(document.querySelector('.video-container__frame')).toBeTruthy();
      });
    });

    describe('YouTube video block elements', () => {
      it('should render 2 child elements', async () => {
        const options = {
          method: 'GET',
          url: webRoutePaths.home,
        };

        const response = await server.inject(options);
        const rawHTML = response.payload;
        const parser = new DOMParser();
        const document = parser.parseFromString(rawHTML, 'text/html');
        const videoContainer = document?.querySelector('.video-container');
        expect(videoContainer?.childElementCount).toEqual(2);
      });
    });

    describe('YouTube video block heading', () => {
      it('should render the video content heading', async () => {
        const options = {
          method: 'GET',
          url: webRoutePaths.home,
        };

        const response = await server.inject(options);
        const rawHTML = response.payload;
        const parser = new DOMParser();
        const document = parser.parseFromString(rawHTML, 'text/html');
        expect(
          document
            ?.querySelector('.video-container__caption-m')
            ?.textContent?.trim()
        ).toBe('What is natural capital?');
      });
    });

    describe('YouTube video frame options', () => {
      it('should render youtube video in iframe', async () => {
        const options = {
          method: 'GET',
          url: webRoutePaths.home,
        };

        const response = await server.inject(options);
        const rawHTML = response.payload;
        const parser = new DOMParser();
        const document = parser.parseFromString(rawHTML, 'text/html');
        const videoFrame = document?.querySelector('.video-container__frame');
        expect(videoFrame?.firstElementChild?.tagName.toLowerCase()).toBe(
          'iframe'
        );
      });

      it('should render youtube video url', async () => {
        const options = {
          method: 'GET',
          url: webRoutePaths.home,
        };

        const response = await server.inject(options);
        const rawHTML = response.payload;
        const parser = new DOMParser();
        const document = parser.parseFromString(rawHTML, 'text/html');
        const videoFrame = document?.querySelector('.video-container__frame');
        expect(videoFrame?.firstElementChild?.getAttribute('src')).toBe(
          'https://www.youtube.com/embed/4wx0rMruSJo?si=h-SD8VoSUSNwqo1S'
        );
      });
    });
  });
});
