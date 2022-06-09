# base node image
FROM node:16-bullseye-slim as base

# set for base and all layer that inherit from it
ENV NODE_ENV production

# Install openssl for Prisma
RUN apt-get update && apt-get install -y openssl sqlite3

# Install all node_modules, including dev dependencies
FROM base as deps

RUN mkdir /tableton
WORKDIR /tableton

ADD package.json package-lock.json ./
RUN npm install --production=false

# Setup production node_modules
FROM base as production-deps

RUN mkdir /tableton
WORKDIR /tableton

COPY --from=deps /tableton/node_modules /tableton/node_modules
ADD package.json package-lock.json ./
RUN npm prune --production

# Build the app
FROM base as build

RUN mkdir /tableton
WORKDIR /tableton

COPY --from=deps /tableton/node_modules /tableton/node_modules

ADD prisma .
RUN npx prisma generate

ADD . .
RUN npm run build

# Finally, build the production image with minimal footprint
FROM base

ENV DATABASE_URL=file:/data/sqlite.db
ENV PORT="8080"
ENV NODE_ENV="production"

# add shortcut for connecting to database CLI
RUN echo "#!/bin/sh\nset -x\nsqlite3 \$DATABASE_URL" > /usr/local/bin/database-cli && chmod +x /usr/local/bin/database-cli

RUN mkdir /tableton
WORKDIR /tableton

COPY --from=production-deps /tableton/node_modules /tableton/node_modules
COPY --from=build /tableton/node_modules/.prisma /tableton/node_modules/.prisma

COPY --from=build /tableton/build /tableton/build
COPY --from=build /tableton/public /tableton/public
ADD . .

CMD ["npm", "start"]
