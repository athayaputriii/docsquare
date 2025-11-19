FROM node:20-alpine AS builder
WORKDIR /app

# Install root deps
COPY package*.json ./
RUN npm ci

# Install dashboard deps
WORKDIR /app/dashboard
COPY dashboard/package*.json ./
RUN npm ci

# Copy the rest of the source
WORKDIR /app
COPY . .

# Build the Next.js dashboard
WORKDIR /app/dashboard
RUN npm run build

# Remove dev deps for smaller runtime
WORKDIR /app
RUN npm prune --omit=dev
RUN cd dashboard && npm prune --omit=dev

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy everything from builder (app code + built dashboard + pruned node_modules)
COPY --from=builder /app /app

EXPOSE 3000
CMD ["node", "index.js"]
