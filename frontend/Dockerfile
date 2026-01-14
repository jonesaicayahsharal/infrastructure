# ---------- Build stage ----------
FROM node:20-alpine AS build

WORKDIR /app

RUN corepack enable

# Copy BOTH package.json AND yarn.lock (cache correctness)
COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

# Copy source AFTER dependencies
COPY . .

# Force rebuild when source changes
RUN yarn build


# ---------- Production stage ----------
FROM nginx:alpine

# Remove default nginx config to avoid conflicts
RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
