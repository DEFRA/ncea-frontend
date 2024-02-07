'use strict';

/**
 * This code snippet exports a module named HomeController.
 * The renderHomeHandler method is an asynchronous function that takes a Request object and a ResponseToolkit object as parameters.
 * It returns a Promise that resolves to a ResponseObject.
 *
 * The renderHomeHandler method is responsible for rendering the home template by calling the view method on the response object.
 * The view method takes the name of the template as an argument and returns a ResponseObject.
 *
 */

import { formValidatorOptions, webRoutePaths } from '../../utils/constants';
import { Request, ResponseObject, ResponseToolkit } from '@hapi/hapi';

const HomeController = {
  renderHomeHandler: async (request: Request, response: ResponseToolkit): Promise<ResponseObject> => {
    const { quickSearch: quickSearchPath, guidedDateSearch: dateSearchPath } = webRoutePaths;
    const { quickSearch: quickSearchOptions } = formValidatorOptions;
    return response.view('screens/home/template', {
      quickSearchPath,
      dateSearchPath,
      quickSearchOptions,
    });
  },
};

export { HomeController };
