# Use the official Node 24 slim image
FROM node:24-slim AS base

# Install pnpm v10 globally to match local monorepo configurations and bypass strict v11 validations
RUN npm install -g pnpm@10

# Set the working directory
WORKDIR /app

# Copy package configurations first to optimize Docker cache layer
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.json tsconfig.base.json ./
COPY artifacts/api-server/package.json ./artifacts/api-server/
COPY artifacts/harish-portfolio/package.json ./artifacts/harish-portfolio/
COPY lib/api-client-react/package.json ./lib/api-client-react/
COPY lib/api-spec/package.json ./lib/api-spec/
COPY lib/api-zod/package.json ./lib/api-zod/
COPY lib/db/package.json ./lib/db/
COPY scripts/package.json ./scripts/

# Install workspace dependencies
RUN pnpm install --no-frozen-lockfile

# Copy the rest of the application files
COPY . .

# Set placeholder env vars required by Vite configuration during the build phase
ENV PORT=5173
ENV BASE_PATH=/
ENV NODE_ENV=production

# Typecheck and build only the production API server and frontend, bypassing mockup-sandbox
RUN pnpm run typecheck:libs \
    && pnpm --filter @workspace/api-server run typecheck \
    && pnpm --filter @workspace/harish-portfolio run typecheck \
    && pnpm --filter @workspace/api-server run build \
    && pnpm --filter @workspace/harish-portfolio run build

# Expose backend port (5000) and frontend port (5173)
EXPOSE 5000
EXPOSE 5173

# Default command runs the Express API server
CMD ["pnpm", "--filter", "@workspace/api-server", "run", "start"]
