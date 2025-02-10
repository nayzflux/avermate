# syntax=docker.io/docker/dockerfile:1

FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json package.json
COPY ./apps/client/package.json ./apps/client/package.json
COPY patches/ ./patches/

# Install dependencies
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile
RUN cd ./apps/client/ && pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY ./apps/client ./apps/client

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
ENV NEXT_TELEMETRY_DISABLED=1

ENV NEXT_PUBLIC_API_URL=https://api.avermate.fr
ENV NEXT_PUBLIC_CLIENT_URL=https://avermate.fr

RUN cd ./apps/client/ && pnpm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder /app/apps/client/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/apps/client/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/client/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
