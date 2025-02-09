#!/bin/bash

# Define the directory of your Nuxt.js application
APP_DIR="/path/to/your/nuxt-app"

# Navigate to the application directory
cd $APP_DIR || { echo "Directory not found: $APP_DIR"; exit 1; }

# Pull the latest changes from the Git repository
echo "Pulling latest changes from Git..."
git pull || { echo "Git pull failed"; exit 1; }

# Build the Nuxt.js application
echo "Building the Nuxt.js application..."
npm run build || { echo "Build failed"; exit 1; }

# Restart the application using PM2
echo "Restarting the application with PM2..."
pm2 restart nuxt-app || { echo "PM2 restart failed"; exit 1; }

echo "Deployment completed successfully."
