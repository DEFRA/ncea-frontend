import { DefaultAzureCredential } from '@azure/identity';
import { SecretClient } from '@azure/keyvault-secrets';

import { environmentConfig } from './environmentConfig';

/**
 * Instance of SecretClient
 */
let keyVaultClient: SecretClient | null = null;

/**
 * Function: getKeyVaultClient
 *
 * This function returns a new instance of SecretClient from the '@azure/keyvault-secrets' package.
 * It uses the environmentConfig object from './environmentConfig' to get the azureKeyVaultURL and the DefaultAzureCredential
 * from the '@azure/identity' package to authenticate the client.
 *
 * @returns {SecretClient} - A new instance of SecretClient.
 */
const getKeyVaultClient = (): SecretClient => {
  if (!keyVaultClient) {
    keyVaultClient = new SecretClient(
      environmentConfig.azureKeyVaultURL as string,
      new DefaultAzureCredential(),
    );
  }
  return keyVaultClient;
};

export { getKeyVaultClient };
