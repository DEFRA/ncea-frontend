import { getKeyVaultClient } from '../../src/config/azureKeyVaultClient';
import { getSecret } from '../../src/utils/keyvault';

jest.mock('../../src/config/azureKeyVaultClient', () => ({
  getKeyVaultClient: jest.fn(),
}));

describe('Azure Key Vault > Get Secrets', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should resolve with the secret value when successful', async () => {
    const secretKey = 'mockedSecretKey';
    const secretValue = 'mockedSecretValue';
    const mockSecretClient = {
      getSecret: jest.fn().mockResolvedValue({
        value: secretValue,
      }),
    };
    (getKeyVaultClient as jest.Mock).mockReturnValue(mockSecretClient);

    const result = await getSecret(secretKey);

    expect(result).toBe(secretValue);
    expect(getKeyVaultClient).toHaveBeenCalled();
    expect(getKeyVaultClient).toHaveBeenCalledTimes(1);
    expect(mockSecretClient.getSecret).toHaveBeenCalledWith(secretKey);
  });

  it('should throw an error when getKeyVaultClient fails', async () => {
    const secretKey = 'mockedSecretKey';
    const mockErrorMessage = 'Mocked error';
    const mockGetSecret = jest
      .fn()
      .mockRejectedValue(new Error(mockErrorMessage));
    const mockSecretClient = { getSecret: mockGetSecret };
    (getKeyVaultClient as jest.Mock).mockReturnValue({
      getSecret: mockGetSecret,
    });

    try {
      await getSecret(secretKey);
      await expect(getSecret(secretKey)).toHaveBeenCalled();
      await expect(getSecret(secretKey)).toHaveBeenCalledTimes(1);
    } catch (error) {
      await expect(getSecret(secretKey)).rejects.toThrow(
        `Error retrieving secret ${secretKey}: ${mockErrorMessage}`
      );
    }
  });
});
