FROM node:20-alpine AS base
WORKDIR /app

FROM base AS deps
RUN npm install -g bun
COPY package.json package-lock.json bun.lockb* ./
RUN bun install --frozen-lockfile

FROM base AS builder
RUN npm install -g bun
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run build:dashboard
RUN bun run build:server

FROM base AS runner
ENV NODE_ENV=production
COPY --from=builder /app /app
EXPOSE 3000
CMD ["node", "index.js"]
