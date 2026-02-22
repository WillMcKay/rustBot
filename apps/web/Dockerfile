FROM node:20-alpine AS builder
WORKDIR /app

# Required for some Next.js dependencies
RUN apk add --no-cache libc6-compat

# Install pnpm globally (not via corepack to avoid version issues)
RUN npm install -g pnpm

# Copy the full monorepo structure
COPY package.json pnpm-workspace.yaml ./
COPY pnpm-lock.yaml* ./
COPY apps/web ./apps/web

# Install all dependencies with a flat node_modules
RUN pnpm install --shamefully-hoist --no-frozen-lockfile

# Build the Next.js app
WORKDIR /app/apps/web
ENV NEXT_TELEMETRY_DISABLED=1
RUN npx next build

# --- Production image ---
FROM node:20-alpine AS runner
WORKDIR /app

RUN apk add --no-cache libc6-compat

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy standalone output
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "apps/web/server.js"]
