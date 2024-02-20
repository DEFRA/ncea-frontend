'use strict';

import Joi from 'joi';

describe('Environment environmentConfig', () => {
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

      require('../../src/config/environmentConfig');

      expect(require('dotenv').config).toHaveBeenCalledTimes(1);
    });

    it('should not call dotenv.config() when NODE_ENV is not set to local', () => {
      process.env.NODE_ENV = 'production';
      jest.mock('dotenv', () => ({
        config: jest.fn(),
      }));

      require('../../src/config/environmentConfig');

      expect(require('dotenv').config).not.toHaveBeenCalled();
    });
  });

  describe('Check environment configuration', () => {
    it('should be accessible and usable', () => {
      const {
        environmentConfig,
      } = require('../../src/config/environmentConfig');
      expect(environmentConfig).toBeDefined();
      expect(typeof environmentConfig).toBe('object');
      expect(Object.keys(environmentConfig).length).toBe(6);
    });

    it('should validate and export the configuration object', () => {
      const mockConfig = {
        PORT: '5000',
        NODE_ENV: 'qa',
        APPLICATIONINSIGHTS_CONNECTION_STRING: 'abc123',
        AZURE_KEYVAULT_URL: 'https://azure-keyvault.com',
        APPINSIGHTS_SECRET_NAME: 'appinsights--connections string',
        ELASTICSEARCH_API: 'https://elasticsearch-api.com',
      };
      process.env = { ...mockConfig };

      const schema = Joi.object().keys({
        port: Joi.string().default('3000'),
        env: Joi.string()
          .valid(...envs)
          .default(envs[0]),
        appInsightsConnectionString: Joi.string().allow('').default(''),
        azureKeyVaultURL: Joi.string().allow('').default(''),
        elasticSearchAPI: Joi.string().allow('').default(''),
        isLocal: Joi.boolean().valid(true, false).default(false),
      });

      const {
        environmentConfig,
      } = require('../../src/config/environmentConfig');

      const { error, value } = schema.validate(environmentConfig);

      expect(error).toBeUndefined();
      expect(value).toEqual(environmentConfig);
    });

    it('should throw an error uf tge configuration object is invalid', () => {
      process.env.NODE_ENV = 'invalid';

      expect(() => {
        require('../../src/config/environmentConfig');
      }).toThrow('The environment config is invalid:');
    });
  });
});
