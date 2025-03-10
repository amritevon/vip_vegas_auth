FROM node:18-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

# Expose port & run the app
EXPOSE 3000
CMD ["pnpm", "start:dev"]
