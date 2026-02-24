# Stage 1 – build the Vite/React app
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Leave VITE_API_BASE_URL empty so axios uses relative URLs (/analyze, /chat).
# Nginx will proxy those paths to the backend container.
RUN npm run build

# Stage 2 – serve with Nginx
FROM nginx:1.27-alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
