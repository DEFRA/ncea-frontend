import { SecretClient } from '@azure/keyvault-secrets';
import { DefaultAzureCredential } from '@azure/identity';
import { Config } from '../../src/config/environmentConfig';
import { getKeyVaultClient } from '../../src/config/azureKeyVaultClient';

jest.mock('@azure/keyvault-secrets', () => ({
  SecretClient: jest.fn().mockImplementation(() => ({
    getSecret: jest.fn(),
  })),
}));

jest.mock('@azure/identity', () => ({
  DefaultAzureCredential: jest.fn(),
}));

jest.mock('../../src/config/environmentConfig', () => ({
  Config: {
    azureKeyVaultURL: 'https://example-vault.vault.azure.net',
  },
}));

describe('Azure Key Vault Client', () => {
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  it('should create a new instance of SecretClient with the correct parameters', () => {
    const mockSecretClient = {} as SecretClient;
    const mockDefaultAzureCredential = {} as DefaultAzureCredential;

    (SecretClient as jest.Mock).mockImplementationOnce(() => mockSecretClient);
    (DefaultAzureCredential as jest.Mock).mockImplementationOnce(
      () => mockDefaultAzureCredential
    );

    const secretClient = getKeyVaultClient();

    expect(secretClient).toBe(mockSecretClient);

    expect(SecretClient).toHaveBeenCalledTimes(1);
    expect(SecretClient).toHaveBeenCalledWith(
      Config.azureKeyVaultURL,
      mockDefaultAzureCredential
    );
  });
});
