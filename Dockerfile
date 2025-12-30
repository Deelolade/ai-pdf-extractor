# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install


COPY tsconfig.json ./

COPY src ./src

RUN npm run build 

# Production stage
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --Production

COPY --from=builder  /app/dist ./dist

ENV PORT=5000

EXPOSE 5000

CMD [ "node", "dist/app.js" ]