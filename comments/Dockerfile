# Use a newer Node version that supports modern JS features
FROM node:18-alpine

WORKDIR /usr/app/comments

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Start the app
CMD ["npm", "start"]

