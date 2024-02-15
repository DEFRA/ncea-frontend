export interface EnvironmentConfig {
  port: string | undefined;
  env: string | undefined;
  appInsightsConnectionString: string | undefined;
  azureKeyVaultURL: string | undefined;
  geoNetworkSearchAPI: string | undefined;
}
