# ---------- Build stage ----------
FROM node:20-alpine AS build

WORKDIR /app

RUN corepack enable

# Copy package.json ONLY (since no yarn.lock exists)
COPY package.json ./

RUN yarn install

# Copy source files AFTER install to force rebuild
COPY . .

# This WILL rerun on every source change
RUN yarn build


# ---------- Production stage ----------
FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
