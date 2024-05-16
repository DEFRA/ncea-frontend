'use strict';

import { Request, ResponseToolkit } from '@hapi/hapi';
import {
  formIds,
  guidedSearchSteps,
  pageTitles,
  queryParamKeys,
  webRoutePaths,
} from '../../../src/utils/constants';
import { HomeController } from '../../../src/controllers/web/HomeController';
import { getSearchResultsCount } from '../../../src/services/handlers/searchApi';
import {
  readQueryParams,
  upsertQueryParams,
} from '../../../src/utils/queryStringHelper';

jest.mock('../../../src/infrastructure/plugins/appinsights-logger', () => ({
  info: jest.fn(),
}));

jest.mock('../../../src/services/handlers/searchApi', () => ({
  getSearchResultsCount: jest.fn(),
}));

describe('Deals with Home Controller', () => {
  describe('Deals with the renderHomeHandler', () => {
    it('should call the home view with context', async () => {
      const request: Request = {} as any;
      const response: ResponseToolkit = { view: jest.fn() } as any;
      await HomeController.renderHomeHandler(request, response);
      const { quickSearchFID } = formIds;
      expect(response.view).toHaveBeenCalledWith('screens/home/template', {
        pageTitle: pageTitles.home,
        quickSearchFID,
        searchInputError: undefined,
      });
    });
  });
  describe('Deals with the intermediateHandler', () => {
    it('should redirect to home if step is undefined', async () => {
      const request: Request = { params: {} } as any;
      const response: ResponseToolkit = { redirect: jest.fn() } as any;
      await HomeController.intermediateHandler(request, response);
      expect(response.redirect).toHaveBeenCalledWith(webRoutePaths.home);
    });
    it('should redirect to home if step is empty', async () => {
      const request: Request = { params: { step: '' } } as any;
      const response: ResponseToolkit = { redirect: jest.fn() } as any;
      await HomeController.intermediateHandler(request, response);
      expect(response.redirect).toHaveBeenCalledWith(webRoutePaths.home);
    });
    it('should redirect to home if step is invalid', async () => {
      const request: Request = { params: { step: 'invalid' } } as any;
      const response: ResponseToolkit = { redirect: jest.fn() } as any;
      await HomeController.intermediateHandler(request, response);
      expect(response.redirect).toHaveBeenCalledWith(webRoutePaths.home);
    });
    it('should redirect to geography page if step is date and search results count > 0', async () => {
      const dateFormFields = {
        'from-date-day': '2',
        'from-date-month': '',
        'from-date-year': '2000',
        'to-date-day': '',
        'to-date-month': '',
        'to-date-year': '2023',
      };
      const request: Request = {
        params: { step: guidedSearchSteps.date },
        payload: { ...dateFormFields },
      } as any;
      const response: ResponseToolkit = { redirect: jest.fn() } as any;
      (getSearchResultsCount as jest.Mock).mockResolvedValue({
        totalResults: 10,
      });
      const queryString: string = upsertQueryParams(
        request.query,
        {
          [queryParamKeys.count]: '10',
        },
        false,
      );
      await HomeController.intermediateHandler(request, response);
      expect(response.redirect).toHaveBeenCalledWith(
        `${webRoutePaths.geographySearch}?${queryString}`,
      );
    });
    it('should redirect to results page if step is date and search results count <= 0', async () => {
      const dateFormFields = {
        'from-date-day': '2',
        'from-date-month': '',
        'from-date-year': '2000',
        'to-date-day': '',
        'to-date-month': '',
        'to-date-year': '2023',
      };
      const request: Request = {
        params: { step: guidedSearchSteps.date },
        payload: { ...dateFormFields },
      } as any;
      const response: ResponseToolkit = { redirect: jest.fn() } as any;
      (getSearchResultsCount as jest.Mock).mockResolvedValue({
        totalResults: 0,
      });

      const queryString: string = readQueryParams(request.query, '', true);
      await HomeController.intermediateHandler(request, response);
      expect(response.redirect).toHaveBeenCalledWith(
        `${webRoutePaths.results}?${queryString}`,
      );
    });
    it('should redirect to results page if an error occurs during count retrieval', async () => {
      const request: Request = {
        params: { step: guidedSearchSteps.date },
        payload: {},
      } as any;
      const response: ResponseToolkit = { redirect: jest.fn() } as any;
      const error = new Error('Mocked error');
      (getSearchResultsCount as jest.Mock).mockRejectedValue(error);

      const queryString: string = readQueryParams(request.query, '', true);
      await HomeController.intermediateHandler(request, response);
      expect(response.redirect).toHaveBeenCalledWith(
        `${webRoutePaths.results}?${queryString}`,
      );
    });
  });
  describe('Deals with the accessibilityHandler', () => {
    it('should call the accessibility view with context', async () => {
      const request: Request = {} as any;
      const response: ResponseToolkit = { view: jest.fn() } as any;
      await HomeController.accessibilityHandler(request, response);
      expect(response.view).toHaveBeenCalledWith('screens/home/accessibility', {
        pageTitle: pageTitles.accessibility,
      });
    });
  });
  describe('Deals with the helpHandler', () => {
    it('should call the help view with context', async () => {
      const request: Request = {} as any;
      const response: ResponseToolkit = { view: jest.fn() } as any;
      await HomeController.helpHandler(request, response);
      expect(response.view).toHaveBeenCalledWith('screens/home/help', {
        pageTitle: pageTitles.help,
      });
    });
  });
  describe('Deals with the termsConditionsHandler', () => {
    it('should call the accessibility view with context', async () => {
      const request: Request = {} as any;
      const response: ResponseToolkit = { view: jest.fn() } as any;
      await HomeController.termsConditionsHandler(request, response);
      expect(response.view).toHaveBeenCalledWith(
        'screens/home/terms_conditions',
        {
          pageTitle: pageTitles.termsAndConditions,
        },
      );
    });
  });
  describe('Deals with the privacyPolicyHandler', () => {
    it('should call the privacy policy view with context', async () => {
      const request: Request = {} as any;
      const response: ResponseToolkit = { view: jest.fn() } as any;
      await HomeController.privacyPolicyHandler(request, response);
      expect(response.view).toHaveBeenCalledWith(
        'screens/home/privacy_policy',
        {
          pageTitle: pageTitles.privacyPolicy,
        },
      );
    });
  });
});
