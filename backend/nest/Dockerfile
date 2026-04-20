FROM node:22-alpine AS base
WORKDIR /app

# Habilita pnpm via corepack en todas las etapas.
RUN corepack enable

FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM deps AS build
ARG APP_NAME

COPY nest-cli.json tsconfig.json tsconfig.build.json ./
COPY apps ./apps
COPY uploads ./uploads

RUN pnpm exec nest build ${APP_NAME}

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

RUN corepack enable

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

COPY --from=build /app/dist ./dist
COPY --from=build /app/apps ./apps
COPY --from=build /app/uploads ./uploads

ARG APP_MAIN_PATH
ENV APP_MAIN_PATH=${APP_MAIN_PATH}

CMD ["sh", "-c", "node ${APP_MAIN_PATH}"]