import Hapi from '@hapi/hapi';
import inert from '@hapi/inert';
import vision from '@hapi/vision';
import {
  customHapiPino,
  customHapiRoutes,
  customHapiViews,
} from '../../src/infrastructure/plugins';

jest.mock('@hapi/hapi', () => ({
  server: jest.fn(() => ({
    register: jest.fn(),
    initialize: jest.fn(),
    start: jest.fn(),
    info: { uri: 'http://localhost:4000', port: '4000' },
  })),
  Server: jest.fn(),
}));

describe('Server initialization', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize the server correctly', async () => {
    const { initializeServer } = require('../../src/infrastructure/server');

    jest.mock('../../src/config/environmentConfig', () => ({
      environmentConfig: {
        env: 'development',
        port: 3000,
      },
    }));

    const server = await initializeServer();
    expect(Hapi.server).toHaveBeenCalledWith({
      host: 'localhost',
      port: 3000,
      routes: {
        validate: {
          options: {
            abortEarly: false,
          },
        },
      },
    });

    expect(server.register).toHaveBeenCalledTimes(2);
    expect(server.register).toHaveBeenCalledWith([inert, vision]);
    expect(server.register).toHaveBeenCalledWith([
      customHapiViews,
      customHapiRoutes,
      customHapiPino,
    ]);
    expect(server.initialize).toHaveBeenCalled();
  });

  it('should start the server correctly', async () => {
    const { startServer } = require('../../src/infrastructure/server');
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    const server = await startServer();
    expect(server.start).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith(
      `Server running at: ${server.info.uri}`,
    );
    consoleSpy.mockRestore();
  });

  it('should initialize the server with the correct port base on NODE_ENV', async () => {
    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'test';

    const { initializeServer } = require('../../src/infrastructure/server');
    const server = await initializeServer();
    expect(server.info.port).toBe('4000');

    process.env.NODE_ENV = originalNodeEnv;
  });
});