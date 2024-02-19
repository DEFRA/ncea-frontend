import { Request, ResponseToolkit } from '@hapi/hapi';

const errorRoutes = [
  {
    method: '*',
    path: '/{p*}', // catch-all path
    handler: function (request: Request, reply: ResponseToolkit) {
      return reply.view('screens/404').code(404);
    },
  },
];

export { errorRoutes };
