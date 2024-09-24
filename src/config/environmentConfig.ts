'use strict';

/**
 * Validates and sets the environment configuration based on the provided schema.
 * If the environment config is invalid, an error is thrown.
 *
 * @throws {Error} If the environment config is invalid
 *
 * @returns {EnvironmentConfig} The validated environment configuration
 */

import { EnvironmentConfig } from '../interfaces/environmentConfig.interface';
import { environmentSchema } from '../schema/environmentConfig.schema';

const config: EnvironmentConfig = {
  port: process.env.PORT,
  env: process.env.NODE_ENV,
  appInsightsConnectionString: '',
  azureKeyVaultURL: process.env.AZURE_KEYVAULT_URL,
  appInsightsSecretName: process.env.APPINSIGHTS_SECRET_NAME,
  elasticSearchAPI: process.env.ELASTICSEARCH_API,
  isLocal: process.env.NODE_ENV === 'local',
  gtmId: process.env.GTM_ID,
  elasticSearchUsername: process.env.ES_USERNAME,
  elasticSearchPassword: process.env.ES_PASSWORD,
  webDomain: process.env.WEBDOMAIN,
  classifierApi: {
    endpoint: process.env.CLASSIFIER_API_URL || 'https://dev-ncea-classifier.azure.defra.cloud/',
    clientId: process.env.CLIENT_ID || 'Enter_the_Application_Id_Here',
    clientSecret: process.env.CLIENT_SECRET || 'Enter_the_Application_Secret_Here',
    authority: process.env.AUTHORITY || 'https://Enter_the_Tenant_Subdomain_Here.ciamlogin.com/',
    scopes: [process.env.SCOPES || 'api://Enter_the_Web_Api_Application_Id_Here'],
    clientIdSecretName: '',
    clientSecretName: ''
  }
};

const { error, value } = environmentSchema.validate(config);

if (error) {
  throw new Error(`The environment config is invalid: ${error.message}`);
}

const environmentConfig = value as EnvironmentConfig;

export { environmentConfig };
