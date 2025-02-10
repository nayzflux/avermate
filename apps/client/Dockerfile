# syntax=docker.io/docker/dockerfile:1

FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy all package files and patches first
COPY package.json ./
COPY pnpm-workspace.yaml ./
COPY apps/client/package.json ./apps/client/
COPY patches/ ./patches/

# Install dependencies
RUN npm install -g pnpm@8.9.0
RUN pnpm install --no-frozen-lockfile
RUN cd ./apps/client/ && pnpm install --no-frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder

WORKDIR /app

# Install pnpm in builder stage
RUN npm install -g pnpm@8.9.0

# Copy ALL files from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/client/node_modules ./apps/client/node_modules
COPY --from=deps /app/patches ./patches
COPY --from=deps /app/package.json ./
COPY --from=deps /app/pnpm-workspace.yaml ./

# Copy source code
COPY ./apps/client ./apps/client

# Next.js collects completely anonymous telemetry data about general usage.
ENV NEXT_TELEMETRY_DISABLED=1

ENV NEXT_PUBLIC_API_URL=https://api.avermate.fr
ENV NEXT_PUBLIC_CLIENT_URL=https://avermate.fr

# Ensure all dependencies are installed and build
RUN cd ./apps/client/ && pnpm install --no-frozen-lockfile && pnpm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy all necessary files
COPY --from=builder /app/apps/client/public ./public
COPY --from=builder /app/apps/client/.next/standalone ./
COPY --from=builder /app/apps/client/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
