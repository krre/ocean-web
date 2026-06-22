# syntax=docker/dockerfile:1

ARG NODE_VERSION=24.12.0

FROM node:${NODE_VERSION}-alpine AS base
WORKDIR /app

FROM base AS deps
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

FROM deps AS build

ARG OCEAN_API_URL
ARG ANONYM_TOKEN
ARG ANONYM_ALLOWED
ARG GOOGLE_ANALYTICS_ID

ENV OCEAN_API_URL=$OCEAN_API_URL
ENV ANONYM_TOKEN=$ANONYM_TOKEN
ENV ANONYM_ALLOWED=$ANONYM_ALLOWED
ENV GOOGLE_ANALYTICS_ID=$GOOGLE_ANALYTICS_ID

RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci
COPY . .
RUN npm run build

FROM base AS final
ENV NODE_ENV=production
RUN mkdir -p /app/.sessions && chown -R node:node /app
USER node
COPY package.json .
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/build ./build

EXPOSE 3000
CMD ["node", "build"]
