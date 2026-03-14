# Use official Node LTS image
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package.json yarn.lock ./
COPY tsconfig.json tsconfig.build.json .
COPY nest-cli.json .
COPY src ./src

RUN yarn install --frozen-lockfile
RUN yarn build

FROM node:20-alpine AS runtime
WORKDIR /usr/src/app

COPY package.json yarn.lock .
RUN yarn install --production --frozen-lockfile
COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3000
ENV NODE_ENV=production
CMD ["node", "dist/main.js"]
