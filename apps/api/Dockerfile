FROM node:20-alpine AS builder
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy the full monorepo structure
COPY package.json pnpm-workspace.yaml ./
COPY pnpm-lock.yaml* ./
COPY apps/api ./apps/api

# Install all dependencies with a flat node_modules
RUN pnpm install --shamefully-hoist --no-frozen-lockfile

# --- Production image ---
FROM node:20-alpine AS runner
WORKDIR /app/apps/api

# Copy installed dependencies and app code
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/apps/api ./

ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 3001

CMD ["node", "index.js"]
