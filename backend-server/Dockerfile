FROM --platform=linux/arm64 node:18-slim

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
COPY ../supabaseClient.js ./supabaseClient.js

EXPOSE 3002
CMD ["node", "index.js"]