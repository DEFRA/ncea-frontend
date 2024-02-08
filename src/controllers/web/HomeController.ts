'use strict';

import { Request, ResponseObject, ResponseToolkit } from '@hapi/hapi';
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
  renderHomeHandler: async (
    request: Request,
    response: ResponseToolkit,
  ): Promise<ResponseObject> => {
    const { quickSearch: quickSearchPath, guidedDateSearch: dateSearchPath } =
      webRoutePaths;
    const formId: string = formIds.quickSearch;
    return response.view('screens/home/template', {
      quickSearchPath,
      formId,
      dateSearchPath,
    });
  },
  doQuickSearchHandler: async (
    request: Request,
    response: ResponseToolkit,
  ): Promise<ResponseObject> => {
    return response.redirect(webRoutePaths.results);
  },
};

export { HomeController };
