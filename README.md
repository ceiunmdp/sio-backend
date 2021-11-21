# SIO Backend

## Description

This repository contains all the logic implemented in the backend of SIO system.

## Prerequisites

- [Node.JS](https://nodejs.org/en/download/): 16.13.0
- [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/): 1.22.15
- [Docker](https://docs.docker.com/engine/install/): 20.10.9
- [Docker Compose](https://docs.docker.com/compose/install/): 2.0.1

## Installation

```bash
# install dependencies
$ yarn install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# debug mode
$ npm run start:debug
# or develop and debug from inside container (check References for more information)
$ docker-compose -f docker-compose.dev.yml up -d

# production mode
$ npm run start:prod
```

Once the app is runnning go to http://localhost:3000. To access the API documentation (running in development mode) go to http://localhost:3000/api/docs

## Git

```bash
# generate new commit
$ npm run commit
```

## Upgrade dependencies

```bash
# upgrade dependencies
$ yarn upgrade-interactive --latest
```

## Format and Linting

```bash
# format
$ npm run format

# lint
$ npm run lint

# format and lint
$ npm run lint!
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Build files and Docker image

```bash
# build files
$ npm run build

# build Docker image without SPA files
$ docker build -t <IMAGE_NAME>:<TAG_NAME> -f Dockerfile.dev .

# build Docker image with files from SPA imported in ./public
$ docker build -t <IMAGE_NAME>:<TAG_NAME> .
```

## Run app and database as containers

```bash
# run containers
$ docker-compose up -d
```

Once the app is runnning go to http://localhost:3000. To access the API documentation (running in development mode) go to http://localhost:3000/api/docs

## Documentation

```bash
# generate documentation
$ npm run compodoc
```

## Migrations

```bash
TBD
```

## References

- [Containerized development with NestJS and Docker](https://blog.logrocket.com/containerized-development-nestjs-docker/)
