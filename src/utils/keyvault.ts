import { getKeyVaultClient } from '../config/azureKeyVaultClient';

/**
 * Retrieves a secret from the Azure Key Vault.
 *
 * @param {string} secretKey - The key of the secret to retrieve.
 * @returns {Promise<string>} - The value of the secret.
 * @throws {Error} - If there is an error retrieving the secret.
 */

const getSecret = async (secretKey: string) => {
  try {
    const secretClient = await getKeyVaultClient();
    const secret = await secretClient.getSecret(secretKey);
    return secret.value;
    /* eslint-disable  @typescript-eslint/no-explicit-any */
  } catch (error: any) {
    throw new Error(`Error retrieving secret ${secretKey}: ${error.message}`);
  }
};

export { getSecret };
