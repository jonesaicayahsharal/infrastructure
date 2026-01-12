# Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Copy package file only
COPY package.json ./

# Install dependencies (no lockfile required)
RUN yarn install

# Copy source
COPY . .

# Build (CRACO -> build/)
ARG REACT_APP_BACKEND_URL
ENV REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL
RUN yarn build

# Production stage
FROM nginx:alpine

# Copy build output
COPY --from=build /app/build /usr/share/nginx/html

# Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
