'use strict';
 
const healthProbesRoutes = [
  {
    method: 'GET',
    path: '/healthy',
    options: {
      handler: (request, h) => {
        return h.response('ok').code(200)
      }
    }
  },
  {
    method: 'GET',
    path: '/healthz',
    options: {
      handler: (request, h) => {
        return h.response('ok').code(200)
      }
    }
  },
];
 
export { healthProbesRoutes };