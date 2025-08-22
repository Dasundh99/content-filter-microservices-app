# Use Node 18 for modern JS support
FROM node:18-alpine

WORKDIR /usr/app/query

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Start the app
CMD ["npm", "start"]

