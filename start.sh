#!/bin/sh
set -e

# Get the API URL from environment or use default
API_URL="${REACT_APP_API_URL:-http://localhost:3000}"

# Create a config file that the app can read
echo "window.REACT_APP_API_URL = '$API_URL';" > /app/build/config.js

# Start the server
serve -s build -l 3000
