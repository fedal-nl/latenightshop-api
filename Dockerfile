# Use an official Node.js image as a base
FROM node:22.14.0

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Expose the application port
EXPOSE 3000

# Run the application
CMD ["npm", "run", "dev"]