'use strict';

import { Request, ResponseObject, ResponseToolkit } from '@hapi/hapi';

const HomeController = {
  renderHomeHandler: async (request: Request, response: ResponseToolkit): Promise<ResponseObject> => {
    // request.server.updateSharedData('my_first_key', '123');
    // const getSharedData = request.server.getSharedData();
    // console.log(getSharedData['my_first_key']);
    return response.view('screens/home/template');
  },
};

export { HomeController };
