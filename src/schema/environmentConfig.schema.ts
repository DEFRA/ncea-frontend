import Joi from 'joi';
import dotenv from 'dotenv';

const envs = ['local', 'sandbox', 'dev', 'qa', 'test', 'preprod', 'prod'];

if ([envs[0]].includes(process.env.NODE_ENV)) {
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
  appInsightsSecretName: Joi.string().allow('').default('').messages({
    'string.base': 'Insights secret name must be a string',
  }),
  azureKeyVaultURL: Joi.string().uri().allow('').default('').messages({
    'string.uri': 'Azure Key Vault URI must be a valid URL or an empty string',
  }),
  elasticSearchAPI: Joi.string().uri().allow('').default('').messages({
    'string.uri': 'Elasticsearch API must be a valid URL or an empty string',
  }),
  isLocal: Joi.boolean().valid(true, false).default(false).messages({
    'boolean.base': 'Is Local must be a boolean value',
    'any.only': 'Is Local is not valid',
  }),
  gtmId: Joi.string().allow('').default('').messages({
    'string.base': 'GTM ID must be a string',
  }),  
  elasticSearchUsername: Joi.string().allow('').default('').messages({
    'string.base': 'The Elasticsearch username must be a string.',
  }),
  elasticSearchPassword: Joi.string().allow('').default('').messages({
    'string.base': 'The Elasticsearch password must be a string.',
  }),
  webDomain: Joi.string().allow('').default('').messages({
    'string.base': 'The web domain must be a string.',
  }),
  classifierApi: Joi.object({
    endpoint: Joi.string().uri().allow('').default('').messages({
      'string.uri': 'Classifier API must be a valid URL or an empty string',
    }),
    clientId: Joi.string().allow('').default('').messages({
      'string.base': 'Classifier API client id must be a string',
    }),
    clientSecret: Joi.string().allow('').default('').messages({
      'string.base': 'Classifier API client id must be a string',
    }),
    authority: Joi.string().allow('').default('').messages({
      'string.base': 'Classifier API app authority must be a string',
    }),
    scopes: Joi.array().items(Joi.string()).min(1).required().messages({
      "any.required": "scopes must include only strings",
      "string.base": "scopes must include only strings"
    }),
    clientIdSecretName: Joi.string().allow('').default('').messages({
      'string.base': 'Classifier API client id secret name must be a string',
    }),
    clientSecretName: Joi.string().allow('').default('').messages({
      'string.base': 'Classifier API client secret name must be a string',
    }),
  })
});
