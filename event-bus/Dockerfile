# Use a newer Node version
FROM node:18-alpine

WORKDIR /usr/app/event-bus

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Start the app
CMD ["npm", "start"]

