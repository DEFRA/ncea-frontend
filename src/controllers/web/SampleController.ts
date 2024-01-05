'use strict';

import { Request, ResponseObject, ResponseToolkit } from '@hapi/hapi';
import { getSamplePosts } from '../../services/handlers/samplePostApi';

const SampleController = {
  renderSampleHandler: async (
    request: Request,
    response: ResponseToolkit
  ): Promise<ResponseObject> => {
    const posts = await getSamplePosts();
    console.log(posts.data);

    return response.view('sample', {
      title: 'Hapi ' + request.server.version,
      message: 'Hello Nunjucks!',
    });
  },
};

export { SampleController };
