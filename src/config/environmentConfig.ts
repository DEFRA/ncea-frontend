'use strict';

/**
 * Validates and sets the environment configuration based on the provided schema.
 * If the environment config is invalid, an error is thrown.
 *
 * @throws {Error} If the environment config is invalid
 *
 * @returns {EnvironmentConfig} The validated environment configuration
 */

import * as joi from '@hapi/joi';
import { EnvironmentConfig } from '../interfaces/environmentConfig.interface';

const envs = ['local', 'development', 'qa', 'production', 'test'];

if ([envs[0], envs[4]].includes(process.env.NODE_ENV!)) {
  /* eslint-disable  @typescript-eslint/no-var-requires */
  require('dotenv').config();
}

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

const config: EnvironmentConfig = {
  port: process.env.PORT,
  env: process.env.NODE_ENV,
  appInsightsKey: process.env.APPINSIGHTS_INSTRUMENTATIONKEY,
  azureKeyVaultURL: process.env.AZURE_KEYVAULT_URL,
  geoNetworkSearchAPI: process.env.GEONETWORK_SEARCH_API,
};

const { error, value } = schema.validate(config);

if (error) {
  throw new Error(`The environment config is invalid: ${error.message}`);
}

const Config = value as EnvironmentConfig;

export { Config };
