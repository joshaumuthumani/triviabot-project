# Use ARM64-compatible Node.js image
FROM --platform=linux/arm64 node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all remaining files
COPY . .

# Optional: Show contents to help debug image builds
RUN echo "Files in /app:" && ls -la /app

# Run bot
CMD ["npm", "start"]