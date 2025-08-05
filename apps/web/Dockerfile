FROM oven/bun:1-alpine
WORKDIR /usr/src/app
COPY package.json ./
COPY bun.lockb* ./
RUN bun install
COPY . .
EXPOSE 5173
ENV VITE_HOST=0.0.0.0
ENV VITE_PORT=5173
CMD ["bun", "run", "dev", "--host", "0.0.0.0", "--port", "5173"]
