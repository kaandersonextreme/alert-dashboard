#!/bin/sh
set -e

# Get the API URL from environment or use default
API_URL="${REACT_APP_API_URL:-http://localhost:3000}"

echo "Starting Alert Dashboard with API URL: $API_URL"

# Create a config file that the app can read
cat > /app/build/config.js << EOF
window.REACT_APP_API_URL = '$API_URL';
console.log('API URL configured:', '$API_URL');
EOF

# Start the server
serve -s build -l 3000
