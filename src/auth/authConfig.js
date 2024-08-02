require('dotenv').config();
const fs = require('fs');

const msalConfig = {
    auth: {
        clientId: process.env.CLIENT_ID || 'Enter_the_Application_Id_Here', // 'Application (client) ID' of app registration in Microsoft Entra admin center - this value is a GUID
        authority: process.env.AUTHORITY || 'https://Enter_the_Tenant_Subdomain_Here.ciamlogin.com/', // Replace the placeholder with your tenant subdomain
        clientSecret: process.env.CLIENT_SECRET || 'Enter_the_Client_Secret_Here', // Client secret generated from the app registration in Microsoft Entra admin center        
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

const protectedResources = {
    classifierApi: {
        endpoint: process.env.API_ENDPOINT || 'https://localhost:44351/api/todolist',
        scopes: [process.env.SCOPES || 'api://Enter_the_Web_Api_Application_Id_Here'],
    },
};

module.exports = {
    msalConfig,
    protectedResources,
};
