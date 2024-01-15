import { Server } from '@hapi/hapi';
import { initializeServer, startServer } from '../../src/infrastructure/server';

let server: Server;

beforeAll(async () => {
  server = await initializeServer();
});

afterAll(async () => {
  await server.stop();
});

describe('should initialize the HTTP server', () => {
  it('should response 404 when request unregistered route', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/',
    });

    expect(response.statusCode).toEqual(200);
  });
});

describe('should have start the HTTP server', () => {
  it('should have start the server', async () => {
    await startServer();
    expect(server.info.port).toBe(4000);
    expect(typeof server).toBe('object');
  });
});
