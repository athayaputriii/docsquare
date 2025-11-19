FROM node:20-alpine AS base
WORKDIR /app

# Install root dependencies
FROM base AS deps
COPY package*.json ./
RUN npm install

# Install dashboard deps (if dashboard has its own package.json)
WORKDIR /app/dashboard
COPY dashboard/package*.json ./
RUN npm install
WORKDIR /app

# Copy source and build
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/dashboard/node_modules ./dashboard/node_modules
COPY . .
RUN npm run build --prefix dashboard

# Final runtime image
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app /app
EXPOSE 3000
CMD ["node", "index.js"]
