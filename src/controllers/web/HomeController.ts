'use strict';

import { Request, ResponseObject, ResponseToolkit } from '@hapi/hapi';

const HomeController = {
  renderHomeHandler: async (request: Request, response: ResponseToolkit): Promise<ResponseObject> => {
    return response.view('screens/home/template');
  },
};

export { HomeController };
