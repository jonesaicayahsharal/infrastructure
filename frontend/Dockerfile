# ---------- Build stage ----------
FROM node:20-alpine AS build

WORKDIR /app

# Copy package.json ONLY (instead of enabling Corepack)
COPY package.json ./

# Install dependencies with Yarn
RUN yarn install --frozen-lockfile  # Use --frozen-lockfile if you have a lockfile

# Copy the rest of the app's source files
COPY . .

# Build the application
RUN yarn build


# ---------- Production stage ----------
FROM nginx:alpine

# Remove the default nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy your custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built files from the build stage
COPY --from=build /app/build /usr/share/nginx/html

# Expose the port nginx will run on
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
