# Use Node 18 for modern JS features
FROM node:18-alpine

WORKDIR /usr/app/posts

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the app
COPY . .

# Start the app
CMD ["npm", "start"]

