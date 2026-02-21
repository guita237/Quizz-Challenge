FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Delete the default nginx page
RUN rm -rf /usr/share/nginx/html/*

# Copy the contents of dist/<app-name>/ to the root of html
COPY --from=build /app/dist/*/ /usr/share/nginx/html/

EXPOSE 80
CMD ["nginx","-g","daemon off;"]
