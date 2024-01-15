'use strict';

// import { getSamplePosts } from '../../services/handlers/samplePostApi';
import { Request, ResponseObject, ResponseToolkit } from '@hapi/hapi';

const SampleController = {
  renderSampleHandler: async (request: Request, response: ResponseToolkit): Promise<ResponseObject> => {
    // const posts = await getSamplePosts();

    return response.view('sample', {
      title: 'Hapi ' + request.server.version,
      message: 'Hello Nunjucks!',
    });
  },
};

export { SampleController };
