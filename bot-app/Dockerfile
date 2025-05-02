# Use official Node.js LTS image
FROM node:18

# Create and set working directory
WORKDIR /app

# Copy dependency manifests first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application source code
COPY . .

# Start the bot
CMD ["npm", "start"]