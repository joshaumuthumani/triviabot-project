# Use lightweight ARM64-compatible Node.js image
FROM --platform=linux/arm64 node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Default command to run the bot
CMD ["npm", "start"]