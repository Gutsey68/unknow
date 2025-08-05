FROM oven/bun:1 AS dev
WORKDIR /usr/src/app
COPY package.json* ./
COPY bun.lockb* ./
RUN bun install
COPY . .
ENV NODE_ENV=development
EXPOSE 3333
USER bun
CMD ["bun", "run", "--watch", "src/index.ts"]
