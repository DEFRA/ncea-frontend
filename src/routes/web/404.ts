module.exports = [
  {
    method: '*',
    path: '/{p*}', // catch-all path
    handler: function (request, reply) {
      return reply.view('screens/404').code(404);
    },
  },
];
