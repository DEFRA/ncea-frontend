import { Config } from './environmentConfig';
import { DefaultAzureCredential } from '@azure/identity';
import { SecretClient } from '@azure/keyvault-secrets';

/**
 * Function: getKeyVaultClient
 *
 * This function returns a new instance of SecretClient from the '@azure/keyvault-secrets' package.
 * It uses the Config object from './environmentConfig' to get the azureKeyVaultURL and the DefaultAzureCredential
 * from the '@azure/identity' package to authenticate the client.
 *
 * @returns {SecretClient} - A new instance of SecretClient.
 */
const getKeyVaultClient = () => new SecretClient(Config.azureKeyVaultURL!, new DefaultAzureCredential());

export { getKeyVaultClient };
