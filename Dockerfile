# ============================================================
# BASE STAGE
# ============================================================
#
# This stage contains the configuration shared by other stages.
#
# It is NOT intended to run the application directly.
#
# The development and build stages will inherit from this stage:
#
#                base
#               /    \
#              /      \
#     development     build
#
# This avoids repeating common configuration such as:
# - Node.js version
# - Working directory
# - package.json
# - package-lock.json
# ============================================================


# FROM defines the base image used to create this stage.
#
# "node:24-alpine" is an official Node.js Docker image that includes:
#
# - Alpine Linux
# - Node.js 24
# - npm
#
# Alpine Linux is used because it is a lightweight Linux distribution,
# which helps reduce the image size.
#
# "AS base" gives this stage the name "base".
#
# Other stages can later inherit from it using:
#
# FROM base AS development
#
FROM node:24-alpine AS base


# WORKDIR defines the working directory inside the container.
#
# From this point forward, commands such as:
#
# RUN
# COPY
# CMD
#
# will operate relative to:
#
# /app
#
# This is conceptually similar to running:
#
# cd /app
#
# inside a Linux system.
#
# Docker creates the directory automatically if it does not exist.
#
WORKDIR /app


# COPY copies files from our local project into the Docker image.
#
# "package*.json" matches:
#
# package.json
# package-lock.json
#
# The destination "./" refers to the current WORKDIR:
#
# /app
#
# Therefore:
#
# LOCAL                         CONTAINER
#
# package.json       --->       /app/package.json
# package-lock.json  --->       /app/package-lock.json
#
#
# We copy these files BEFORE copying the source code because Docker
# builds images using cached layers.
#
# For example:
#
# COPY package*.json ./
# RUN npm ci
# COPY . .
#
# If we only modify:
#
# src/user.service.ts
#
# package.json has not changed, so Docker can reuse the cached
# "npm ci" layer instead of reinstalling all dependencies.
#
# This can make subsequent Docker builds significantly faster.
#
COPY package*.json ./



# ============================================================
# DEVELOPMENT STAGE
# ============================================================
#
# This stage is designed for local development.
#
# It contains:
#
# - Node.js
# - npm
# - production dependencies
# - development dependencies
# - TypeScript
# - tsx
# - application source code
#
# The application will run directly from TypeScript using tsx.
#
# Hot reload will also be available through:
#
# tsx watch
#
# ============================================================


# This stage inherits everything from the previously defined
# "base" stage.
#
# Therefore this stage already contains:
#
# Node.js 24
# npm
# /app as WORKDIR
# package.json
# package-lock.json
#
# "AS development" gives this new stage the name "development".
#
# Docker Compose can explicitly request this stage using:
#
# build:
#   target: development
#
FROM base AS development


# RUN executes a command while the Docker IMAGE is being built.
#
# Important:
#
# RUN executes during:
#
# docker build
#
# It does NOT execute every time the container starts.
#
#
# "npm ci" means Clean Install.
#
# It:
#
# 1. Requires package-lock.json.
# 2. Removes an existing node_modules directory if necessary.
# 3. Installs exactly the versions stored in package-lock.json.
# 4. Does not update package-lock.json.
#
# This makes dependency installation reproducible.
#
# For example, if package.json contains:
#
# "express": "^5.1.0"
#
# but package-lock.json locks:
#
# express 5.1.0
#
# npm ci installs exactly:
#
# express 5.1.0
#
#
# In the development stage, npm ci installs BOTH:
#
# dependencies
# +
# devDependencies
#
# We need devDependencies here because development tools such as:
#
# - typescript
# - tsx
# - @types/node
# - testing tools
#
# may be located there.
#
RUN npm ci


# Copies the rest of the project into the image.
#
# The first "." represents the local Docker build context.
#
# The second "." represents the current WORKDIR:
#
# /app
#
# Therefore this:
#
# COPY . .
#
# roughly means:
#
# Copy the current project into /app.
#
# Example:
#
# LOCAL                         IMAGE
#
# src/              --->       /app/src/
# tsconfig.json     --->       /app/tsconfig.json
# package.json      --->       /app/package.json
#
#
# Files ignored by .dockerignore will NOT be copied.
#
# For example:
#
# node_modules
# dist
# .git
# .env
#
# should normally be excluded.
#
#
# IMPORTANT:
#
# During development, Docker Compose usually mounts:
#
# .:/app
#
# This bind mount overlays /app with our local project when the
# container is running.
#
# Therefore:
#
# You edit:
#
# ./src/index.ts
#
# and the container immediately sees:
#
# /app/src/index.ts
#
COPY . .


# CMD defines the DEFAULT command that will be executed when
# a container is started from this image.
#
# Unlike RUN:
#
# RUN -> executes while BUILDING the image.
#
# CMD -> executes when STARTING the container.
#
#
# This command is equivalent to:
#
# npm run dev
#
# Our package.json should contain something similar to:
#
# "dev": "tsx watch src/index.ts"
#
# Therefore the runtime flow becomes:
#
# Container starts
#       |
#       v
# npm run dev
#       |
#       v
# tsx watch src/index.ts
#       |
#       v
# Node application starts
#
#
# "tsx watch" monitors TypeScript files.
#
# If we modify a source file:
#
# VS Code
#    |
#    v
# bind mount
#    |
#    v
# /app/src changes
#    |
#    v
# tsx watch detects the change
#    |
#    v
# Node.js process restarts
#
#
# The JSON-array syntax is preferred:
#
# CMD ["npm", "run", "dev"]
#
# because Docker executes the program directly without
# unnecessarily passing it through a shell.
#
CMD ["npm", "run", "dev"]



# ============================================================
# BUILD STAGE
# ============================================================
#
# This stage exists ONLY to compile TypeScript.
#
# It is not intended to be the final production container.
#
# Its responsibility is:
#
# src/*.ts
#    |
#    v
# TypeScript compiler
#    |
#    v
# dist/*.js
#
# The resulting /app/dist directory will later be copied into
# the final production image.
#
# ============================================================


# Starts a new stage based on our common "base" stage.
#
# Like development, this stage already receives:
#
# - Node.js
# - npm
# - /app
# - package.json
# - package-lock.json
#
# This stage is named "build".
#
FROM base AS build


# Installs ALL dependencies.
#
# We cannot use:
#
# npm ci --omit=dev
#
# here because the TypeScript compiler is normally installed
# as a devDependency.
#
# For example:
#
# devDependencies:
#
# "typescript"
# "tsx"
# "@types/node"
#
# The build stage needs TypeScript so it can execute:
#
# npm run build
#
RUN npm ci


# Copies the application's source code and configuration files
# into the build stage.
#
# We need files such as:
#
# src/
# tsconfig.json
#
# because TypeScript must compile the source code.
#
COPY . .


# Executes our build script.
#
# package.json should contain something like:
#
# "build": "tsc"
#
# Therefore this command effectively executes:
#
# tsc
#
#
# TypeScript reads:
#
# tsconfig.json
#
# and transforms:
#
# src/*.ts
#
# into:
#
# dist/*.js
#
#
# Example:
#
# BEFORE
#
# /app/src/index.ts
# /app/src/server.ts
#
# AFTER
#
# /app/dist/index.js
# /app/dist/server.js
#
#
# The source TypeScript files are still present in this build stage,
# but we will NOT copy them into the final production image.
#
RUN npm run build



# ============================================================
# PRODUCTION STAGE
# ============================================================
#
# This is the final image intended to run the application
# in a production environment.
#
# The goal is to keep this image as clean as possible.
#
# It should contain only what is required to RUN the application:
#
# - Node.js
# - production dependencies
# - compiled JavaScript files
#
# It should NOT require:
#
# - TypeScript compiler
# - tsx
# - source TypeScript files
# - development dependencies
#
# ============================================================


# We intentionally start again from a clean Node.js image.
#
# We do NOT write:
#
# FROM build AS production
#
# because the build stage contains:
#
# - development dependencies
# - TypeScript
# - source files
# - build-related files
#
# Starting from node:24-alpine gives us a cleaner final image.
#
FROM node:24-alpine AS production


# Defines /app as the working directory for the production
# container.
#
# All following relative paths will be based on:
#
# /app
#
WORKDIR /app


# ENV defines an environment variable inside the image.
#
# Here we define:
#
# NODE_ENV=production
#
# Node.js libraries often use NODE_ENV to determine whether
# the application is running in:
#
# development
# test
# production
#
# Our application may also use this variable.
#
# For example:
#
# if (env.NODE_ENV === "development") {
#   enableDevelopmentLogging();
# }
#
#
# Some libraries also disable development-only behavior
# automatically when NODE_ENV is "production".
#
# This value can still be overridden when the container starts
# through Docker Compose or another deployment environment.
#
ENV NODE_ENV=production


# Copies package.json and package-lock.json into the production image.
#
# We need them because npm must know which production
# dependencies need to be installed.
#
# Again:
#
# LOCAL                         PRODUCTION IMAGE
#
# package.json       --->       /app/package.json
# package-lock.json  --->       /app/package-lock.json
#
COPY package*.json ./


# Installs only the dependencies required at runtime.
#
# "npm ci" performs a clean, reproducible installation based
# exactly on package-lock.json.
#
#
# "--omit=dev" tells npm NOT to install devDependencies.
#
# Example:
#
# dependencies:
#
# express       -> installed
# sequelize     -> installed
# pg            -> installed
# zod           -> installed
#
# devDependencies:
#
# typescript    -> NOT installed
# tsx           -> NOT installed
# @types/node   -> NOT installed
#
#
# This is possible because production does not execute
# TypeScript directly.
#
# Production runs the already compiled JavaScript:
#
# node dist/index.js
#
#
# "&&" means:
#
# Execute the command on the right ONLY if the command
# on the left succeeds.
#
# Therefore:
#
# npm ci --omit=dev
#
# must finish successfully before:
#
# npm cache clean --force
#
# is executed.
#
#
# "npm cache clean --force" removes npm's local package cache.
#
# That cache is useful while installing packages, but it is
# unnecessary after the production image has been built.
#
# Removing it can help reduce unnecessary files in the final image.
#
RUN npm ci --omit=dev && npm cache clean --force


# Copies files from ANOTHER Docker build stage.
#
# "--from=build" means:
#
# Get files from the stage named:
#
# build
#
#
# In that stage, TypeScript generated:
#
# /app/dist
#
# We copy that directory into:
#
# ./dist
#
# Since our WORKDIR is /app, the final destination becomes:
#
# /app/dist
#
#
# The operation is:
#
# BUILD STAGE                      PRODUCTION STAGE
#
# /app/dist/        ---------->    /app/dist/
#
#
# Notice what we are NOT copying:
#
# /app/src
# TypeScript source files
# development node_modules
#
# Only the compiled output is transferred.
#
# This is one of the main benefits of a multi-stage Docker build.
#
COPY --from=build /app/dist ./dist


# Changes the Linux user that will execute subsequent commands
# and the application process.
#
# Containers commonly start as:
#
# root
#
# Running an internet-facing application as root is not recommended.
#
# The official Node.js Docker image already provides a user called:
#
# node
#
# Therefore:
#
# USER node
#
# makes our application execute with fewer operating-system
# privileges.
#
#
# Conceptually:
#
# BEFORE:
#
# Node process -> root user
#
# AFTER:
#
# Node process -> node user
#
#
# This follows the principle of least privilege:
#
# Give the application only the permissions it actually needs.
#
#
# IMPORTANT:
#
# If the application later needs to WRITE files inside /app,
# we may need to explicitly assign ownership/permissions to the
# "node" user.
#
# For a normal API that only reads its application files,
# this usually is not necessary.
#
USER node


# Defines the command executed when the production container starts.
#
# Unlike development, we do NOT use:
#
# npm run dev
# tsx
# TypeScript
# watch mode
#
# We execute the JavaScript that was previously generated
# by the build stage:
#
# node dist/index.js
#
#
# Production runtime flow:
#
# TypeScript source code
#       |
#       | build stage
#       v
# npm run build
#       |
#       v
# dist/index.js
#       |
#       | copied into production stage
#       v
# Production container
#       |
#       v
# node dist/index.js
#
#
# Again, the JSON-array form is used so Docker starts Node.js
# directly as the main container process.
#
CMD ["node", "dist/index.js"]