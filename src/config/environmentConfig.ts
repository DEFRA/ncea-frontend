'use strict';

import * as joi from '@hapi/joi';

if (process.env.NODE_ENV === 'local') {
  require('dotenv').config();
}

const envs = ['local', 'development', 'qa', 'production', 'test'];

const schema = joi.object().keys({
  port: joi.number().default(3000),
  env: joi
    .string()
    .valid(...envs)
    .default(envs[0]),
  appInsightsKey: joi.string().allow('').default(''),
  azureKeyVaultURL: joi.string().allow('').default(''),
  geoNetworkSearchAPI: joi.string().allow('').default(''),
});

const config = {
  port: process.env.PORT,
  env: process.env.NODE_ENV,
  appInsightsKey: process.env.APPINSIGHTS_INSTRUMENTATIONKEY,
  azureKeyVaultURL: process.env.AZURE_KEYVAULT_URL,
  geoNetworkSearchAPI: process.env.GEONETWORK_SEARCH_API,
};

const { error, value: Config } = schema.validate(config);

if (error) {
  throw new Error(`The environment config is invalid. ${error.message}`);
}

export { Config };
