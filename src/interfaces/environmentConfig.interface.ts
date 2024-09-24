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
    endpoint: string;
    clientId: string;
    clientSecret: string;
    authority: string;
    scopes: Array<string>;
    clientIdSecretName: string;
    clientSecretName: string;
  }
}
