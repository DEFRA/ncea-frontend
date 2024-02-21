export interface EnvironmentConfig {
  port: string | undefined;
  env: string | undefined;
  appInsightsConnectionString: string | undefined;
  azureKeyVaultURL: string | undefined;
  appInsightsSecretName?: string;
  elasticSearchAPI: string | undefined;
  isLocal?: boolean;
}
