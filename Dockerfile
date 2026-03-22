# syntax=docker/dockerfile:1

ARG NODE_VERSION=24.12.0

FROM node:${NODE_VERSION}-alpine as base

WORKDIR /app

FROM base as deps

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

FROM deps as build

ARG PUBLIC_OCEAN_API_URL
ARG PUBLIC_ANONYM_TOKEN
ARG PUBLIC_ANONYM_ALLOWED

ENV PUBLIC_OCEAN_API_URL=$PUBLIC_OCEAN_API_URL
ENV PUBLIC_ANONYM_TOKEN=$PUBLIC_ANONYM_TOKEN
ENV PUBLIC_ANONYM_ALLOWED=$PUBLIC_ANONYM_ALLOWED

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci

COPY . .

RUN npm run build

FROM base as final

ENV NODE_ENV production

RUN mkdir -p /app/.sessions && chown -R node:node /app

USER node

COPY package.json .

COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/build ./build

EXPOSE 3000

CMD node build
