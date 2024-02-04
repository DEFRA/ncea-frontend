export interface EnvironmentConfig {
  port: string | undefined;
  env: string | undefined;
  appInsightsKey: string | undefined;
  azureKeyVaultURL: string | undefined;
  elasticSearchAPI: string | undefined;
  isLocal?: boolean;
}
