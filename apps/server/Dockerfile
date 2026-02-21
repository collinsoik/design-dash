FROM node:20-alpine

WORKDIR /app

# Copy workspace root and package files for dependency caching
COPY package.json package-lock.json ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/server/package.json ./apps/server/

# Install dependencies
RUN npm ci --workspace=packages/shared --workspace=apps/server

# Copy source
COPY packages/shared/ ./packages/shared/
COPY apps/server/ ./apps/server/

# Build shared package
RUN npm run build --workspace=packages/shared

# Build server
RUN npm run build --workspace=apps/server

# Create data directory for SQLite
RUN mkdir -p /app/data

EXPOSE 3001

CMD ["node", "apps/server/dist/index.js"]
