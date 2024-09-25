export interface EnvironmentConfig {
  port: string | undefined;
  env: string | undefined;
  appInsightsConnectionString: string | undefined;
  azureKeyVaultURL: string | undefined;
  appInsightsSecretName?: string;
  elasticSearchAPI: string | undefined;
  isLocal?: boolean;
  gtmId?: string;
  elasticSearchUsername?: string;
  elasticSearchPassword?: string;
  webDomain?: string;
  classifierApi: {
    endpoint: string | undefined;
    clientId: string | undefined;
    clientSecret: string | undefined;
    authority: string | undefined;
    scopes: string | undefined;
    clientIdSecretName: string;
    clientSecretName: string;
  }
}
