import Joi from 'joi';
import { environmentSchema } from '../../../src/models/schema/environmentConfig.schema';

describe('Environment Configuration Schema', () => {
  describe('Check the Defaults', () => {
    it('should set default values for missing fields', () => {
      const { value } = environmentSchema.validate({});
      expect(value.port).toEqual('3000');
      expect(value.env).toEqual('local');
      expect(value.appInsightsKey).toEqual('');
      expect(value.azureKeyVaultURL).toEqual('');
      expect(value.geoNetworkSearchAPI).toEqual('');
    });

    it('should keep provided values for fields if available', () => {
      const partialConfig = {
        port: '5000',
        env: 'qa',
      };

      const { value } = environmentSchema.validate(partialConfig);
      expect(value.port).toEqual('5000');
      expect(value.env).toEqual('qa');
      expect(value.appInsightsKey).toEqual('');
      expect(value.azureKeyVaultURL).toEqual('');
      expect(value.geoNetworkSearchAPI).toEqual('');
    });
  });

  describe('Check the Validation', () => {
    it('should validate a valid environment configuration', () => {
      const validConfig = {
        port: '4000',
        env: 'development',
        appInsightsKey: 'your-key',
        azureKeyVaultURL: 'https://example-vault.vault.azure.net',
        geoNetworkSearchAPI: 'https://example.com/api',
      };

      const { error, value } = environmentSchema.validate(validConfig);
      expect(error).toBeUndefined();
      expect(value).toEqual(validConfig);
    });

    it('should invalidate a configuration with invalid port', () => {
      const invalidConfig = {
        port: 4000, // Should be a string
        env: 'development',
      };

      const { error } = environmentSchema.validate(invalidConfig);
      expect(error).toBeDefined();
      expect(error?.details[0].message).toContain('Port must be a string');
    });

    it('should invalidate a configuration with invalid environment', () => {
      const invalidConfig = {
        port: '3000',
        env: 'invalid', // Should be one of ['local', 'development', 'qa', 'production', 'test']
      };

      const { error } = environmentSchema.validate(invalidConfig);
      expect(error).toBeDefined();
      expect(error?.details[0].message).toContain(
        'Provided Environment is not valid'
      );
    });

    it('should invalidate a configuration with key vault url as string instead of URL', () => {
      const invalidConfig = {
        port: '3000',
        env: 'local',
        azureKeyVaultURL: 'url',
      };

      const { error } = environmentSchema.validate(invalidConfig);
      expect(error).toBeDefined();
      expect(error?.details[0].message).toContain(
        'Azure Key Vault URI must be a valid URL or an empty string'
      );
    });

    it('should invalidate a configuration with geo network search api as string instead of URL', () => {
      const invalidConfig = {
        port: '3000',
        env: 'local',
        geoNetworkSearchAPI: 'url',
      };

      const { error } = environmentSchema.validate(invalidConfig);
      expect(error).toBeDefined();
      expect(error?.details[0].message).toContain(
        'GeoNetwork Search API must be a valid URL or an empty string'
      );
    });
  });
});
