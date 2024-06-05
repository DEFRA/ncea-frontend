<h1 style="text-align: center;" align="center">Natural Capital and Ecosystem Assessment</h1>

The Natural Capital and Ecosystem Assessment programme (NCEA) is a DEFRA programme that aims to design and initiate a holistic measurement and data monitoring system for environmental assessment of land (tNCEA) and sea (mNCEA) for England.

<p align="center">
    <a alt="Node.js">
        <img src="https://img.shields.io/badge/Node.js-LTS-green.svg" />
    </a>
    <a alt="Hapi.js">
        <img src="https://img.shields.io/badge/Hapi.js-21.x-yellowgreen.svg" />
    </a>
    <a alt="GovUK Frontend">
        <img src="https://img.shields.io/badge/govuk_frontend-5.x-green.svg" />
    </a>
    <a alt="Nunjucks">
        <img src="https://img.shields.io/badge/nunjucks-3.x-yellowgreen.svg" />
    </a>
    <a alt="Jest">
        <img src="https://img.shields.io/badge/jest-29.x-yellowgreen.svg" />
    </a>
    <a alt="Dependencies">
        <img src="https://img.shields.io/badge/dependencies-up%20to%20date-brightgreen.svg" />
    </a>
</p>

<h1>Table of Contents</h1>

- [Prerequisites](#prerequisites)
- [Configure your Git](#configure-your-git)
- [Running the server locally](#running-the-server-locally)
- [Technology](#technology)
- [Application Anatomy](#application-anatomy)
- [Commands](#commands)
- [Flow of Control](#flow-of-control)
- [Environment Variables](#environment-variables)
- [TODO](#todo)

## Prerequisites

- **Mandatory**

  - A latest version of a modern Web Browser such as Google Chrome
  - Github repository access
  - Access to the following repositories:
    - This repository: https://github.com/DEFRA/ncea-frontend.git
  - Git
  - Node.js `v16` (recommended to install it via [NVM](https://github.com/nvm-sh/nvm))
  - NPM `v8`
  - Visual Studio Code

- **Optionally**
  - At least 16GBs of RAM Memory

## Configure your Git

```bash
# Clone the github repository
git clone https://github.com/DEFRA/ncea-frontend.git

# Go to the root directory of this project `ncea-frontend/`
cd <project-root-directory>

# Let's configure the identity for Git history purposes
git config --global user.name "<BITBUCKET_USERNAME>"
git config --global user.email "<BITBUCKET_ACCOUNT_EMAIL>"

# Let's configure line endings
# If Mac OS / Unix
git config core.autocrlf input
# If Windows
git config core.autocrlf true
```

## Running the server locally

- By now, we should have completed the prerequisite section.
- Have completed the git configuration and be in the project root directory.
- Run the following commands.

```bash
# Install the NPM dependencies (ignoring the optional dependencies)
npm install --no-optional

# Run the Hpi.js Dev Server
npm run start:dev
```

- The server should be running at: http://localhost:3000

## Technology

- **Hapi** - Server side framework
- **Typescript** - It extends JavaScript by adding types
- **Nunjucks** - HTML template engine
- **GovUK Frontend** - Styles & macros
- **SASS** - CSS preprocessor
- **Nodemon** - Automatically restart the node application when file changes
- **Jest** - Unit test framework
- **Eslint** - it is a static code analysis tool
- **Husky** - it is a tool that simplifies the setup and management of pre-commit hooks
- **Pino** - it is a logging framework for node.js
- **Elasticsearch** - Create an ES connection and perform queries.

## Application Anatomy

```
├── src                    // Keeps the application code
│   ├── assets             // Contains all the sass styles and scripts
│   │   ├── sass           // Contains all the sass styles and functions
│   ├── config             // To define and initiate the configurations
│   │   ├── azureKeyVa..ts // This is to create a connection object that reads data from the Azure key vault
│   │   ├── elasticSea..ts // Create a connection object for Elasticsearch.
│   │   └── environment..ts// The purpose of this is to read the environment variables.
│   ├── controllers        // The definition of all route handlers can be found here
│   │   ├── api            // For API rest endpoint controller are arranged here
│   │   └── web            // For web view rendering, controllers are arranged by module names
│   ├── infrastructure     // Frameworks, drivers, and plugins, to name a few.
│   │   ├── plugins        // Contains the custom plugins registered with the Hapi server
│   │   │   ├── router.ts  // Custom plugin to register the routes
│   │   │   └── view.ts    // Custom plugin to register the vision api to render the nunjucks template
│   │   └── server.ts      // Hapi.js server definition
│   ├── interfaces         // To identify all the structures
│   ├── routes             // Here is where all app routes are defined
│   │   ├── api            // Rest API routes
│   │   └── web            // WEB UI routes.
│   │       └── assets.ts  // This is where all static asset routing requests are defined
│   ├── schema             // To identify all the schema related to Joi
│   ├── services           // The definition of api clients and api handlers can be found heres
│   │   └── handlers       // Contains all the API handlers, each endpoint will have its asynchronous
│   ├── utils              // utils contains common utility and helper reusable methods that can be used by controllers function
│   ├── views              // All server-rendered nunjucks templates, partials and helpers
│   │   ├── layout         // Contains the basic customized layout of the template
│   │   ├── partials       // Contains templates that can be reused, such as extend or macros.
│   │   └── screens        // Contains the template for each screen, such as home, results, and so on.
├── └── index.ts           // The primary application entry point
├── public                 // Contains all the static files and files compiles from GDS
│   ├── images             // Contains all the static rendering images
│   ├── scripts            // Contains all the javascript modules or functions
│   └── application.css    // Contains all the compiled styles of custom & GOV.UK
├── tools                  // Contains all tools, such as static code analysis and unit test configurations.
│   ├── .eslintrc          // Define eslint rules
│   ├── .prettierrc        // Define prettier rules to enforce a consistent code style
│   ├── jest.config.js     // Jest configuration for unit testing.
│   └── nodemon.json       // Instructions to enable nodemon to monitor and restart the application server when there is a file change.
├── .gitignore             // standard git ignore file
├── .eslintignore          // Ignores certain files for eslint rules
├── package.json           // It records important metadata about a project, scripts, and dependencies.
├── tsconfig.json          // To compile the project, the root files and compiler options need to be specified.
├── log_files              // Contains the logs generated by the pino and winston
└── __tests__              // To organize the test cases in a similar manner to the folder structure present in the `src` folder..

```

## Commands

```bash

# Starts the application in development using nodemon and ts-node to do application reloading.
npm run start:dev

# Cleans the folder before building the application to the `build` folder.
npm run build

# To generate and execute the production build.
npm run start

# To examine the code and verify its standards
npm run lint

# To carry out the unit test with coverage
npm run test

# To carry out the unit test and monitor for any modifications.
num run test:dev

```

## Flow of Control

<h3>Server, Routes and Plugins</h3>

Server, routes and plugins can be considered as "plumbery-code" that exposes the API to the external world or render the html elements using a template engine on to the web browser, via an instance of Hapi.js server.

The role of the server is to intercept the HTTP request and match the corresponding route.

Routes are configuration objects whose responsibilities are to check the request format and params, and then to call the good controller (with the received request). They are registered as Plugins.

Plugins are configuration object that package an assembly of features (ex: authentication & security concerns, routes, pre-handlers, etc.) and are registered at the server startup.

<h3>Controllers (a.k.a Route Handlers)</h3>

Controllers are the entry points to the application context.

They have 3 main responsibilities :

1. Extract the parameters (query or body) from the request
2. Call the good Use Case or business logic unit (application layer)
3. Return an HTTP response or render a html view (with status code and serialized data)

<h3>Code</h3>

We're using semi-colons and comma-last. No rhyme or reason; and some of the hapi [code convention guidelines](http://hapijs.com/styleguide). Check out `.eslintrc` for additional code conventions used.

<h3>How to debug the application from VSCode</h3>

- Run the `npm run start:dev` to start the server.
- Once the server is up and running, set the breakpoint at the code, directly with the VS Code interface.
- Switch to Run & Debug, and hit the green play button to start a debugging session.
- The browser will stop and the IDE will offer you the debugging experience.

## Environment Variables

It is important to create the.env file at the root folder level, and the required keys are only required for local use.

```bash
PORT=
NODE_ENV=
APPINSIGHTS_SECRET_NAME=
APPINSIGHTS_INSTRUMENTATIONKEY=
AZURE_KEYVAULT_URL=
ELASTICSEARCH_API=
GTM_ID=
ES_USERNAME=
ES_PASSWORD=
```

**_Pipeline Variables_**
Variable Groups

- pipelineVariables
  - _acrConatinerRegistry_
  - _acrContainerRepositoryHarvester_
  - _acrName_
  - _sonarCloudOrganization_
  - _sonarProjectKeySearchWebApp_
  - _sonarProjectNameSerachWebApp_
- azureVariables-[dev/test/sandbox/...]
  - _aksNamespace_
  - _blobStorageUri_
  - _keyVaultUri_
  - _serviceBusHostName_
- _searchWebAppVariables-[dev/test/sandbox/...]_
  - _appinsightsSecretName_
  - _containerRepositoryFullPath_
  - _elasticSearchApi_
  - _hostName_
  - _nodeEnv_
  - _port_
  - _serviceAccountSearchWebApp_

## TODO

- [ ] Make sure to update the readme.md file if it is outdated or contains new information
- [x] External API consumption should be segmented.
- [x] Enhance the creation of Hapi server logic
- [ ] Check over the content of the 404 and 500 error pages and tailor to suit
- [ ] Update the build status badges if they are outdated or wish to add new
- [x] Introduce a method for logging events to aid developers in debugging.
