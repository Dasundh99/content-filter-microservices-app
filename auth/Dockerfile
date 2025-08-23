# Use official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy source code
COPY . .

# Expose port
EXPOSE 8006

# Start the service
CMD ["node", "index.js"]
