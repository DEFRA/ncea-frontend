'use strict';

import * as joi from '@hapi/joi';

describe('Environment Config', () => {
  let originalEnv: NodeJS.ProcessEnv;
  const envs = ['local', 'development', 'qa', 'production', 'test'];

  beforeAll(() => {
    originalEnv = { ...process.env };
  });

  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  describe('Check local environment configuration', () => {
    it('should call dotenv.config() when NODE_ENV is set to local', () => {
      process.env.NODE_ENV = 'local';
      jest.mock('dotenv', () => ({
        config: jest.fn(),
      }));

      // const configSpy = jest.spyOn(dotenv, 'config');

      require('../../src/config/environmentConfig');

      expect(require('dotenv').config).toHaveBeenCalledTimes(1);
    });

    it('should not call dotenv.config() when NODE_ENV is not set to local', () => {
      process.env.NODE_ENV = 'production';
      jest.mock('dotenv', () => ({
        config: jest.fn(),
      }));

      // const configSpy = jest.spyOn(dotenv, 'config');

      require('../../src/config/environmentConfig');

      expect(require('dotenv').config).not.toHaveBeenCalled();
    });
  });

  describe('Check environment configuration', () => {
    it('should be accessible and usable', () => {
      const { Config } = require('../../src/config/environmentConfig');
      expect(Config).toBeDefined();
      expect(typeof Config).toBe('object');
      expect(Object.keys(Config).length).toBe(5);
    });

    it('should validate and export the configuration object', () => {
      const mockConfig = {
        PORT: '5000',
        NODE_ENV: 'qa',
        APPINSIGHTS_INSTRUMENTATIONKEY: 'abc123',
        AZURE_KEYVAULT_URL: 'https://azure-keyvault.com',
        GEONETWORK_SEARCH_API: 'https://geonetwork-api.com',
      };
      process.env = { ...mockConfig };

      const schema = joi.object().keys({
        port: joi.string().default('3000'),
        env: joi
          .string()
          .valid(...envs)
          .default(envs[0]),
        appInsightsKey: joi.string().allow('').default(''),
        azureKeyVaultURL: joi.string().allow('').default(''),
        geoNetworkSearchAPI: joi.string().allow('').default(''),
      });

      const { Config } = require('../../src/config/environmentConfig');

      const { error, value } = schema.validate(Config);

      expect(error).toBeUndefined();
      expect(value).toEqual(Config);
    });

    it('should throw an error uf tge configuration object is invalid', () => {
      process.env.NODE_ENV = 'invalid';

      expect(() => {
        require('../../src/config/environmentConfig');
      }).toThrow('The environment config is invalid:');
    });
  });
});
