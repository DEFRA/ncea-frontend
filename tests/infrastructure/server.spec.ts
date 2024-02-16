import Hapi from '@hapi/hapi';

jest.mock('@hapi/hapi', () => ({
  server: jest.fn(() => ({
    register: jest.fn(),
    initialize: jest.fn(),
    start: jest.fn(),
    info: { uri: 'http://localhost:4000', port: '4000' },
  })),
  Server: jest.fn(),
}));

jest.mock('../../src/infrastructure/plugins/appinsights-logger', () => ({
  logger: jest.fn()
}));

describe('Server initialization', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize the server correctly', async () => {
    const { initializeServer } = require('../../src/infrastructure/server');

    jest.mock('../../src/config/environmentConfig', () => ({
      Config: {
        env: 'development',
        port: 3000,
        appInsightsConnectionString: 'test'
      },
    }));

    const server = await initializeServer();
    expect(Hapi.server).toHaveBeenCalledWith({
      host: '0.0.0.0',
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
    expect(server.register).toHaveBeenCalledWith([
      require('@hapi/inert'),
      require('@hapi/vision'),
    ]);
    expect(server.register).toHaveBeenCalledWith([
      require('../../src/infrastructure/plugins/views'),
      require('../../src/infrastructure/plugins/router'),
      require('../../src/infrastructure/plugins/logger'),
    ]);
    expect(server.initialize).toHaveBeenCalled();
  });

  it('should start the server correctly', async () => {
    const { startServer } = require('../../src/infrastructure/server');
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    const server = await startServer();
    expect(server.start).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith(
      `Server running at: ${server.info.uri}`
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
