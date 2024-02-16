'use strict';

import { Server } from '@hapi/hapi';

import { initializeServer } from '../../../src/infrastructure/server';

jest.mock('../../../src/infrastructure/plugins/appinsights-logger', () => ({
  logger: jest.fn()
}));

describe('Sample Routes', () => {
  let server: Server;

  beforeAll((done) => {
    initializeServer().then((s: Server) => {
      server = s;
      done();
    });
  });

  afterAll((done) => {
    server.stop().then(() => done());
  });

  it('should GET /sample route works', async () => {
    const options = {
      method: 'GET',
      url: '/sample',
    };

    const response = await server.inject(options);
    expect(response.statusCode).toEqual(200);
  });
});
