FROM --platform=linux/arm64 node:18-slim

WORKDIR /app

COPY backend-server/. .
COPY supabaseClient.js ./supabaseClient.js

RUN npm install

EXPOSE 3002
CMD ["node", "index.js"]