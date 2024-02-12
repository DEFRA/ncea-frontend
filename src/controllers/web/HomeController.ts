'use strict';

import Joi from 'joi';
import { Lifecycle, Request, ResponseObject, ResponseToolkit } from '@hapi/hapi';

import { formIds, webRoutePaths } from '../../utils/constants';

/**
 * This code snippet exports a module named HomeController.
 * The renderHomeHandler method is an asynchronous function that takes a Request object and a ResponseToolkit object as parameters.
 * It returns a Promise that resolves to a ResponseObject.
 *
 * The renderHomeHandler method is responsible for rendering the home template by calling the view method on the response object.
 * The view method takes the name of the template as an argument and returns a ResponseObject.
 *
 */

const HomeController = {
  renderHomeHandler: (request: Request, response: ResponseToolkit): ResponseObject => {
    const { home: quickSearchPath, guidedDateSearch: dateSearchPath } = webRoutePaths;
    const formId: string = formIds.quickSearch;
    return response.view('screens/home/template', {
      quickSearchPath,
      formId,
      dateSearchPath,
      searchInputError: undefined,
    });
  },
  quickSearchFailActionHandler: (
    request: Request,
    response: ResponseToolkit,
    error: Joi.ValidationError,
  ): Lifecycle.ReturnValue => {
    const { home, results, guidedDateSearch: dateSearchPath, getResults: getResultsPath } = webRoutePaths;
    const formId: string = formIds.quickSearch;
    const searchError: string | undefined = error?.details?.[0]?.message ?? undefined;
    const payload = request.payload as Record<string, string>;
    const searchInputError = searchError
      ? {
          text: searchError,
        }
      : (undefined as unknown as Joi.ValidationError);
    const context = {
      quickSearchPath: payload?.pageName === 'home' ? home : results,
      formId,
      dateSearchPath,
      getResultsPath,
      searchInputError,
    };
    const view: string = payload?.pageName === 'home' ? 'screens/home/template' : 'screens/results/template';
    return response.view(view, context).code(400).takeover();
  },
  doQuickSearchHandler: (request: Request, response: ResponseToolkit): ResponseObject => {
    return response.redirect(webRoutePaths.results);
  },
};

export { HomeController };
