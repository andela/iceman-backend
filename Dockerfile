# Define image to build from
FROM node:10-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the app directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source code inside the Docker image
COPY . .

# Map port to the Docker daemon
EXPOSE 3000

# Run the start script
CMD [ "npm", "start" ]
