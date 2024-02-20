export interface EnvironmentConfig {
  port: string | undefined;
  env: string | undefined;
  appInsightsConnectionString: string | undefined;
  azureKeyVaultURL: string | undefined;
  appInsightsSecretName: string | undefined;
  elasticSearchAPI: string | undefined;
  isLocal?: boolean;
}
