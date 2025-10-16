# Stage 1: Builder
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production --legacy-peer-deps
COPY . .

# ✅ Matikan linting saat build
ENV NEXT_DISABLE_ESLINT=1
RUN npm run build

# Stage 2: Runtime
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app ./
RUN npm ci --only=production --legacy-peer-deps
EXPOSE 3000
CMD ["npm", "start"]
