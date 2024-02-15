FROM node:lts-alpine

ENV PORT='3000'
ENV NODE_ENV='local'
ENV AZURE_KEYVAULT_URL='https://nceakv.vault.azure.net/'
ENV ELASTICSEARCH_API='http://localhost:3300/'
ENV APPLICATIONINSIGHTS_CONNECTION_STRING='InstrumentationKey=beb07cdc-ed03-493a-88e3-ce52a5db8a99;IngestionEndpoint=https://westeurope-5.in.applicationinsights.azure.com/;LiveEndpoint=https://westeurope.livediagnostics.monitor.azure.com/'

# Change the working directory on the Docker image to /app
WORKDIR /app

# Copy package.json and package-lock.json to the /app directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of project files into this image
COPY . .

# Expose application port
EXPOSE 3000

# Start the application
CMD npm start

