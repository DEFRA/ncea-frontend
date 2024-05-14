ARG PARENT_VERSION=2.1.2-node18.11.0
ARG PORT=3000
ARG PORT_DEBUG=9229

# Development
FROM defradigital/node-development:${PARENT_VERSION} AS development
ARG PARENT_VERSION
LABEL uk.gov.defra.adp.parent-image=defradigital/node-development:${PARENT_VERSION}

ARG PORT
ARG PORT_DEBUG
ENV PORT ${PORT}
EXPOSE ${PORT} ${PORT_DEBUG}

COPY --chown=node:node package*.json ./
RUN npm install
COPY --chown=node:node . .
RUN npm run build
CMD [ "npm", "run", "start" ]

# Production
FROM defradigital/node:${PARENT_VERSION} AS production
ARG PARENT_VERSION
LABEL uk.gov.defra.adp.parent-image=defradigital/node:${PARENT_VERSION}

ARG PORT
ENV PORT ${PORT}



# Copy only the 'build' folder from the development stage
COPY --from=development /home/node/build ./build

# Copy the 'node_modules' folder from the development stage
COPY --from=development /home/node/node_modules ./node_modules

# Copy the 'public' folder from the development stage
COPY --from=development /home/node/public ./public

# Create the 'log_files' folder
RUN mkdir /home/node/log_files
RUN chown -R node /home/node
EXPOSE ${PORT}
CMD [ "node", "build/index.js" ]
