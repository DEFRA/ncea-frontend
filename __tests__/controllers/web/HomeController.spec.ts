'use strict';

import { Request, ResponseToolkit } from '@hapi/hapi';
import { HomeController } from '../../../src/controllers/web/HomeController';
import { formIds, webRoutePaths } from '../../../src/utils/constants';
import { quickSearchJoiError } from '../../data/quickSearch';
import Joi from 'joi';

describe('Deals with Home Controller > renderHomeHandler', () => {
  it('should call the home view with context', async () => {
    const request: Request = {} as any;
    const response: ResponseToolkit = { view: jest.fn() } as any;
    await HomeController.renderHomeHandler(request, response);
    const { home: quickSearchPath, guidedDateSearch: dateSearchPath } =
      webRoutePaths;
    const formId: string = formIds.quickSearch;
    expect(response.view).toHaveBeenCalledWith('screens/home/template', {
      quickSearchPath,
      formId,
      dateSearchPath,
      searchInputError: undefined,
    });
  });
});
describe('Deals with Home Controller > doQuickSearchHandler', () => {
  it('should redirect to results page', async () => {
    const request: Request = {} as any;
    const response: ResponseToolkit = { redirect: jest.fn() } as any;
    await HomeController.doQuickSearchHandler(request, response);
    expect(response.redirect).toHaveBeenCalledWith(webRoutePaths.results);
  });
});

describe('Deals with Home Controller > quickSearchFailActionHandler > home page', () => {
  const response: ResponseToolkit = {
    view: jest.fn().mockReturnValue({
      code: jest.fn().mockReturnThis(),
      takeover: jest.fn(),
    }),
  } as any;
  const request: Request = {
    payload: {
      pageName: 'home',
    },
  } as any;
  beforeAll(() => {
    return HomeController.quickSearchFailActionHandler(
      request,
      response,
      quickSearchJoiError,
    );
  });

  it('should render the home page with error messages', async () => {
    const {
      home,
      guidedDateSearch: dateSearchPath,
      getResults: getResultsPath,
    } = webRoutePaths;
    const formId: string = formIds.quickSearch;
    const searchInputError = {
      text: 'Please enter keywords into the search field.',
    };
    const context = {
      quickSearchPath: home,
      formId,
      dateSearchPath,
      getResultsPath,
      searchInputError,
    };
    expect(response.view).toHaveBeenCalledWith(
      'screens/home/template',
      context,
    );
  });
});

describe('Deals with Home Controller > quickSearchFailActionHandler > results page', () => {
  const response: ResponseToolkit = {
    view: jest.fn().mockReturnValue({
      code: jest.fn().mockReturnThis(),
      takeover: jest.fn(),
    }),
  } as any;
  const request: Request = {
    payload: {
      pageName: 'results',
    },
  } as any;
  beforeAll(() => {
    return HomeController.quickSearchFailActionHandler(
      request,
      response,
      quickSearchJoiError,
    );
  });

  it('should render the results page with error messages', async () => {
    const {
      results,
      guidedDateSearch: dateSearchPath,
      getResults: getResultsPath,
    } = webRoutePaths;
    const formId: string = formIds.quickSearch;
    const searchInputError = {
      text: 'Please enter keywords into the search field.',
    };
    const context = {
      quickSearchPath: results,
      formId,
      dateSearchPath,
      getResultsPath,
      searchInputError,
    };
    expect(response.view).toHaveBeenCalledWith(
      'screens/results/template',
      context,
    );
  });
});

describe('Deals with Home Controller > quickSearchFailActionHandler > no error', () => {
  const response: ResponseToolkit = {
    view: jest.fn().mockReturnValue({
      code: jest.fn().mockReturnThis(),
      takeover: jest.fn(),
    }),
  } as any;
  const request: Request = {
    payload: {
      pageName: 'home',
    },
  } as any;
  beforeAll(() => {
    return HomeController.quickSearchFailActionHandler(
      request,
      response,
      undefined as unknown as Joi.ValidationError,
    );
  });

  it('should render the home page with error messages', async () => {
    const {
      home,
      guidedDateSearch: dateSearchPath,
      getResults: getResultsPath,
    } = webRoutePaths;
    const formId: string = formIds.quickSearch;
    const searchInputError = undefined;
    const context = {
      quickSearchPath: home,
      formId,
      dateSearchPath,
      getResultsPath,
      searchInputError,
    };
    expect(response.view).toHaveBeenCalledWith(
      'screens/home/template',
      context,
    );
  });
});
