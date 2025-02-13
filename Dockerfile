# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Create a working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose the port (configure in .env or default 3000)
EXPOSE 3000

# Start the server
CMD ["npm", "start"]
