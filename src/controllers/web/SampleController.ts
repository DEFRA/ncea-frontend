'use strict';
import { Request, ResponseObject, ResponseToolkit } from '@hapi/hapi';

const SampleController = {
  renderSampleHandler: async (request: Request, response: ResponseToolkit): Promise<ResponseObject> => {
    return response.view('sample', {
      title: 'Hapi ' + request.server.version,
      message: 'Hello Nunjucks!',
    });
  },
};

export { SampleController };
