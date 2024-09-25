const msal = require('@azure/msal-node');
import { environmentConfig } from '../../config/environmentConfig';
export const tokenRequest = {
    scopes: [`api://${environmentConfig.classifierApi.scopes}/.default`],
};

export const apiConfig = {
    uri: environmentConfig.classifierApi.endpoint,
};

const msalConfig = {
    auth: {
        clientId: environmentConfig.classifierApi.clientId,
        authority: `https://login.microsoftonline.com/${environmentConfig.classifierApi.authority}`,
        clientSecret: environmentConfig.classifierApi.clientSecret
    },
    system: {
        loggerOptions: {
            loggerCallback(loglevel, message, containsPii) {
                console.log(message);
            },
            piiLoggingEnabled: false,
            logLevel: 'Info',
        },
    },
};

const cca = new msal.ConfidentialClientApplication(msalConfig);

/**
 * Acquires token with client credentials.
 * @param {object} tokenRequest
 */
export const getToken = async(tokenRequest) => {
    return await cca.acquireTokenByClientCredential(tokenRequest);
}