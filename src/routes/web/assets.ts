module.exports = [
  {
    method: 'GET',
    path: '/assets/all.js',
    handler: {
      file: 'node_modules/govuk-frontend/dist/govuk/govuk-frontend.min.js',
    },
  },
  {
    method: 'GET',
    path: '/assets/{path*}',
    handler: {
      directory: {
        path: ['src/public', 'node_modules/govuk-frontend/dist/govuk/assets'],
      },
    },
  },
];
