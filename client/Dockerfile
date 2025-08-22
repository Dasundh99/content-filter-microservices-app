# Use Node 18 for compatibility with your backend
FROM node:18-alpine

# Prevent React from exiting in CI / Docker
ENV CI=true
# Fix Webpack Dev Server port issue in Docker
ENV WDS_SOCKET_PORT=0

# Set working directory
WORKDIR /usr/app/frontend

# Copy package.json & install dependencies
COPY package*.json ./
RUN npm install

# Copy all frontend files
COPY ./ ./

# Expose React dev server port
EXPOSE 3000

# Start frontend
CMD ["npm", "start"]

