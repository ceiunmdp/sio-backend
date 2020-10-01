# Build stage
# FROM node:12.18.4-alpine3.12 AS build
FROM node:12.18.4-buster-slim AS build

WORKDIR /home/node/app

# RUN apk --no-cache add python3=3.8.5-r0 cups-dev=2.3.3-r0
RUN apt-get update && \
  apt-get install -y --no-install-recommends libcups2-dev=2.2.10-6+deb10u3 && \
  apt-get clean && \
  rm -rf /var/lib/apt/lists/*
RUN chown node:node -R /home/node

# Set non-root user
USER node

# Copy dependency information and install all dependencies
COPY --chown=node:node package.json yarn.lock ./

RUN yarn install --frozen-lockfile && yarn cache clean

# Copy source code (and all other relevant files)
COPY --chown=node:node . .

# Build code
RUN yarn build


# Run-time stage
# FROM node:12.18.3-alpine3.12 AS production
FROM node:12.18.4-buster-slim AS production

ARG NODE_ENV=production
ARG APP_PORT=3000
ENV NODE_ENV=${NODE_ENV}

WORKDIR /home/node/app

# RUN apk --no-cache add python3=3.8.5-r0 cups-dev=2.3.3-r0
RUN apt-get update && \
  apt-get install -y --no-install-recommends libcups2-dev=2.2.10-6+deb10u3 && \
  apt-get clean && \
  rm -rf /var/lib/apt/lists/*
RUN chown node:node -R /home/node

# Set non-root user
USER node

# Expose port
EXPOSE ${APP_PORT}

# Copy dependency information and install production-only dependencies
COPY --chown=node:node package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production && yarn cache clean

# Copy results from previous stage
COPY --chown=node:node --from=build /home/node/app/dist ./dist

CMD [ "node", "dist/main.js" ]
# CMD [ "node", "dist/main.js", "--max-old-space-size=350" ] # https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/docker/memory-limit.md
