FROM node:12.18-alpine3.12 AS development
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --only=development # Change to "npm ci" when deploying
COPY . .
RUN npm run build

FROM node:12.18-alpine3.12 AS production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --only=production # Change to "npm ci" when deploying
COPY --from=development /usr/src/app/dist ./dist
CMD npm run start:prod
