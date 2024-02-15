FROM node:lts-alpine AS builder

ENV PORT='3000'
ENV NODE_ENV='local'
ENV AZURE_KEYVAULT_URL='https://nceakv.vault.azure.net/'
ENV ELASTICSEARCH_API='http://localhost:3300/'
ENV APPLICATIONINSIGHTS_CONNECTION_STRING='InstrumentationKey=beb07cdc-ed03-493a-88e3-ce52a5db8a99;IngestionEndpoint=https://westeurope-5.in.applicationinsights.azure.com/;LiveEndpoint=https://westeurope.livediagnostics.monitor.azure.com/'

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire source code into the container
COPY . .

# Build the application
RUN npm run build


FROM node:lts-alpine

# Change the working directory on the Docker image to /app
WORKDIR /app

# Copy only the 'build' folder from the builder stage
COPY --from=builder /app/build ./build

# Copy the 'node_modules' folder from the builder stage
COPY --from=builder /app/node_modules ./node_modules

# Copy the 'public' folder from the builder stage
COPY --from=builder /app/public ./public

# Expose application port
EXPOSE 3000

# Start the application
CMD ["node", "build/index.js"]
