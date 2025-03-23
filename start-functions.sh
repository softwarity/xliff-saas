#!/bin/bash

# Kill any existing lt process
pkill -f "lt --port 54321"

# Create a temporary file
temp_file=$(mktemp)

# Start lt in background and redirect output to temp file
lt --port 54321 --print-requests > "$temp_file" 2>&1 &
lt_pid=$!

# Wait for the URL to appear in the temp file
echo "Waiting for localtunnel URL..."
while ! grep -q "your url is:" "$temp_file"; do
    sleep 1
done

# Extract the URL
url=$(grep "your url is:" "$temp_file" | sed 's/your url is: //')

# Update the .env file
echo "Updating .env with URL: $url"
if [ -f "supabase/functions/.env" ]; then
    # Replace or add HOST_WEBHOOK line
    if grep -q "^HOST_WEBHOOK=" "supabase/functions/.env"; then
        sed -i "s|^HOST_WEBHOOK=.*|HOST_WEBHOOK=\"$url\"|" supabase/functions/.env
    else
        echo "HOST_WEBHOOK=\"$url\"" >> supabase/functions/.env
    fi
else
    echo "HOST_WEBHOOK=\"$url\"" > supabase/functions/.env
fi

# Clean up temp file
rm "$temp_file"

# Start supabase functions
echo "Starting Supabase functions..."
supabase functions serve

# When supabase functions ends, kill lt process
kill $lt_pid 