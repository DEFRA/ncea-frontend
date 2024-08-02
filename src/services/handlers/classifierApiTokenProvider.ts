const msal = require('@azure/msal-node');

const { msalConfig, protectedResources } = require('./authConfig');

const tokenRequest = {
    scopes: [`${protectedResources.classifierApi.scopes}/.default`],
};

const apiConfig = {
    uri: protectedResources.classifierApi.endpoint,
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