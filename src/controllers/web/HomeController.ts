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

import { Request, ResponseObject, ResponseToolkit } from '@hapi/hapi';
import logger from '../../infrastructure/plugins/appinsights-logger'

const HomeController = {
  renderHomeHandler: async (
    request: Request,
    response: ResponseToolkit
  ): Promise<ResponseObject> => {

    logger.info('inside home controller');

    return response.view('screens/home/template', {
      searchInputError: undefined,
    });
  },
};

export { HomeController };
