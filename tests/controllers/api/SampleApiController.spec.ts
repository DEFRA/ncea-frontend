import { SampleApiController } from '../../../src/controllers/api/SampleApiController';
import { Server } from '@hapi/hapi';

describe('Sample API Controller', () => {
  let server: Server;

  beforeEach(async () => {
    server = new Server();

    server.route({
      method: 'GET',
      path: '/api/sample',
      handler: SampleApiController.apiSampleHandler,
    });

    await server.initialize();
  });

  afterEach(async () => {
    await server.stop();
  });

  it('should return a response with the correct title and message', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/api/sample',
    });

    expect(response.statusCode).toBe(200);

    const payload = JSON.parse(response.payload);

    expect(payload.title).toBe(`Hapi ${server.version}`);
    expect(payload.message).toBe('Hello Nunjucks!');
  });
});
