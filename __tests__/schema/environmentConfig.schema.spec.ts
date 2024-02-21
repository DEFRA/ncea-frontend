import { environmentSchema } from '../../src/schema/environmentConfig.schema';

describe('Environment Configuration Schema', () => {
  describe('Check the Defaults', () => {
    it('should set default values for missing fields', () => {
      const { value } = environmentSchema.validate({});
      expect(value.port).toEqual('3000');
      expect(value.env).toEqual('local');
      expect(value.appInsightsConnectionString).toEqual('');
      expect(value.azureKeyVaultURL).toEqual('');
      expect(value.appInsightsSecretName).toEqual('');
      expect(value.elasticSearchAPI).toEqual('');
      expect(value.isLocal).toEqual(false);
    });

    it('should keep provided values for fields if available', () => {
      const partialConfig = {
        port: '5000',
        env: 'qa',
      };

      const { value } = environmentSchema.validate(partialConfig);
      expect(value.port).toEqual('5000');
      expect(value.env).toEqual('qa');
      expect(value.appInsightsConnectionString).toEqual('');
      expect(value.azureKeyVaultURL).toEqual('');
      expect(value.appInsightsSecretName).toEqual('');
      expect(value.elasticSearchAPI).toEqual('');
      expect(value.isLocal).toEqual(false);
    });
  });

  describe('Check the Validation', () => {
    it('should validate a valid environment configuration', () => {
      const validConfig = {
        port: '4000',
        env: 'dev',
        appInsightsConnectionString: 'your-key',
        azureKeyVaultURL: 'https://example-vault.vault.azure.net',
        appInsightsSecretName: 'secret-name',
        elasticSearchAPI: 'https://example.com/api',
        isLocal: false,
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
      expect(error?.details[0]?.message).toContain('Port must be a string');
    });

    it('should invalidate a configuration with invalid environment', () => {
      const invalidConfig = {
        port: '3000',
        env: 'invalid', // Should be one of ['local', 'development', 'qa', 'production', 'test']
      };

      const { error } = environmentSchema.validate(invalidConfig);
      expect(error).toBeDefined();
      expect(error?.details[0]?.message).toContain(
        'Provided Environment is not valid',
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
      expect(error?.details[0]?.message).toContain(
        'Azure Key Vault URI must be a valid URL or an empty string',
      );
    });

    it('should invalidate a configuration with elasticsearch api as string instead of URL', () => {
      const invalidConfig = {
        port: '3000',
        env: 'local',
        elasticSearchAPI: 'url',
      };

      const { error } = environmentSchema.validate(invalidConfig);
      expect(error).toBeDefined();
      expect(error?.details[0]?.message).toContain(
        'Elasticsearch API must be a valid URL or an empty string',
      );
    });

    it('should invalidate a configuration with isLocal as string instead of boolea', () => {
      const invalidConfig = {
        port: '3000',
        env: 'local',
        isLocal: 'invalid',
      };

      const { error } = environmentSchema.validate(invalidConfig);
      expect(error).toBeDefined();
      expect(error?.details[0]?.message).toContain('Is Local is not valid');
    });
  });
});
