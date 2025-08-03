# Use the official Bun image as base
FROM oven/bun:1 AS base
WORKDIR /usr/src/app

# Install dependencies
FROM base AS install
# Copy package.json first (bun.lockb may not exist)
COPY package.json* ./
COPY bun.lockb* ./

# Install dependencies
RUN bun install

# Copy source code
FROM base AS prerelease
COPY --from=install /usr/src/app/node_modules node_modules
COPY . .

# Set environment
ENV NODE_ENV=production

# Final stage
FROM base AS release
COPY --from=install /usr/src/app/node_modules node_modules
COPY --from=prerelease /usr/src/app/src ./src
COPY --from=prerelease /usr/src/app/package.json* ./
COPY --from=prerelease /usr/src/app/drizzle.config.ts* ./
COPY --from=prerelease /usr/src/app/.env* ./

# Expose port
EXPOSE 3000

# Run the app
USER bun
CMD ["bun", "run", "src/index.ts"]
EXPOSE 3000
