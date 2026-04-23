FROM node:25-alpine3.22 AS builder
WORKDIR /app
COPY package.json .
RUN npm install

FROM node:25-alpine3.22
WORKDIR /app
COPY . .
RUN npm run build
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/.next /app/.next
EXPOSE 3000
CMD ["npm", "start"]