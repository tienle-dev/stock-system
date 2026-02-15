FROM node:20-alpine AS base

# Backend Dockerfile
FROM base AS backend

WORKDIR /app

COPY backend/package*.json ./
RUN npm ci

COPY backend/ ./

RUN npm run build

EXPOSE 3001 3002

CMD ["npm", "start"]
