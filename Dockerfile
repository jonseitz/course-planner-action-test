# Use a multi-stage build to handle the compiling, installing, etc.

# STAGE 1: Install node_modules on a stretch container
FROM node:10-stretch as base
ARG APP_DIR=/node
ARG OPEN_PORT=3000
EXPOSE ${OPEN_PORT}
WORKDIR ${APP_DIR}
RUN chown node:node ${APP_DIR}
COPY --chown=node:node package*.json ./
USER node
RUN ["npm", "install", "--no-optional"]
COPY --chown=node:node . . 

# STAGE 2: Extend the base image as a builder image
FROM base as builder
RUN npm run build && rm -rf node_modules && npm install --no-optional --production

# STAGE 3: Copy the 'build' directory from previous stage and run in alpine
# Since this does not extend the base image, we need to set workdir, user, etc. again.
FROM node:10-alpine
ARG APP_DIR=/node
ARG OPEN_PORT=3000
EXPOSE ${OPEN_PORT}
WORKDIR ${APP_DIR}
COPY --from=builder --chown=node:node $APP_DIR/build ./
COPY --from=builder --chown=node:node $APP_DIR/tsconfig.production.json ./tsconfig.json
COPY --from=builder --chown=node:node $APP_DIR/node_modules ./node_modules
USER node 
CMD ["node", "--require", "tsconfig-paths/register", "./server"]
