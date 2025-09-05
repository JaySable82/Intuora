# Use the official Node.js runtime as the base image
FROM ubuntu:22 

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy the rest of the application code
COPY . .

# Run as root (default)

# Expose the port that your app runs on
EXPOSE 3001

# Define environment variable
ENV NODE_ENV=production

# Command to run the application
CMD ["npm", "start"]
