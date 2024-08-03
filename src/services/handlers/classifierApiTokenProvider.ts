const msal = require('@azure/msal-node');
import { environmentConfig } from '../../config/environmentConfig';

const tokenRequest = {
    scopes: [`${environmentConfig.classifierApi.scopes}/.default`],
};

const apiConfig = {
    uri: environmentConfig.classifierApi.endpoint,
};

const msalConfig = {
    auth: {
        clientId: environmentConfig.classifierApi.clientId,
        authority: environmentConfig.classifierApi.authority,
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
async function getToken(tokenRequest) {
    return await cca.acquireTokenByClientCredential(tokenRequest);
}

module.exports = {
    apiConfig: apiConfig,
    tokenRequest: tokenRequest,
    getToken: getToken,
};