import Joi from 'joi';
import dotenv from 'dotenv';

const envs = ['local', 'development', 'qa', 'production', 'test'];

if ([envs[0], envs[4]].includes(process.env.NODE_ENV!)) {
  dotenv.config();
}

export const environmentSchema: Joi.ObjectSchema = Joi.object({
  port: Joi.string().default('3000').messages({
    'string.base': 'Port must be a string',
  }),
  env: Joi.string()
    .valid(...envs)
    .default(envs[0])
    .messages({
      'string.base': 'Environment must be a string',
      'any.only': 'Provided Environment is not valid',
    }),
  appInsightsConnectionString: Joi.string().allow('').default('').messages({
    'string.base': 'Insights key must be a string',
  }),
  azureKeyVaultURL: Joi.string().uri().allow('').default('').messages({
    'string.uri': 'Azure Key Vault URI must be a valid URL or an empty string',
  }),
  geoNetworkSearchAPI: Joi.string().uri().allow('').default('').messages({
    'string.uri': 'GeoNetwork Search API must be a valid URL or an empty string',
  }),
});
