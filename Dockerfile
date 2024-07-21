FROM node:20-alpine

# create workspace
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# install pnpm globally
RUN npm install -g pnpm

# copy app files to workspace
COPY . /usr/src/app

# install dependencies with frozen lockfile
RUN pnpm install --frozen-lockfile

# generate schema types
RUN pnpm run generate

# build the app files
RUN pnpm run build

# final command
CMD ["node", "dist/index.js"]