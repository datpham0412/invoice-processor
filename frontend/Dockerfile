# ────────────────────────────────
# Stage 1 – build the React app
# ────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Install deps first (better cache)
COPY package.json package-lock.json* ./
RUN npm ci

# Copy the rest of the source and build
COPY . .
RUN npm run build             # → creates /app/dist

# ────────────────────────────────
# Stage 2 – serve with Nginx
# ────────────────────────────────
FROM nginx:stable-alpine

# If you need client-side routing, drop in a custom config.
# Otherwise Nginx’s default works fine for static files.
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built site to the Nginx web root
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
