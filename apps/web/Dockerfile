FROM oven/bun:1-alpine
WORKDIR /usr/src/app
COPY package.json bun.lock* ./
COPY packages/api-client/package.json packages/api-client/package.json
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
RUN bun install
COPY . .
WORKDIR /usr/src/app/apps/web
EXPOSE 5173
ENV VITE_HOST=0.0.0.0
ENV VITE_PORT=5173
CMD ["bun", "run", "dev", "--host", "0.0.0.0", "--port", "5173"]
