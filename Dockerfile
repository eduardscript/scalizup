FROM node:18-alpine

WORKDIR /app
COPY package*.json ./

COPY build .
COPY drizzle drizzle

COPY ./package.json build/
COPY ./package-lock.json build/

RUN npm ci --omit=dev

ENV NODE_ENV=production

CMD ["node", "index.js"]