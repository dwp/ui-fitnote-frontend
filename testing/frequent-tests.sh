#!/bin/bash

echo "Please Note: An internet connection is REQUIRED for all tests to run successfully"

cd ../ || exit

# Jasmine unit tests
echo "Starting Jasmine tests"
jasmine JASMINE_CONFIG_PATH=jasmine.json --stop-on-failure=true

# Jasmine unit tests
echo "Starting Istanbull Test Coverage..."
nyc jasmine JASMINE_CONFIG_PATH=jasmine.json
open -g coverage/lcov-report/index.html &

# Start the test server in background
# json-server --port 3004 testing/db.json &

# Start Node in test mode in background
npm run test --scripts-prepend-node-path &

# Wait for the Node Server to start up
echo "Waiting for Node to start..."
sleep 5

# Javascript Lint checks
# echo "Starting esLint..."
# eslint */*.js

# Sass Lint checks
echo "Starting Sass Lint..."
sass-lint -c .sass-lint.yml 'assets/scss/*.scss' -v -q

# Run Valimate HTML validation tests
cd testing/configs || exit
valimate

# Kill the running processes afterwards
Node_port=3000
DB_port=3004
lsof -i tcp:${Node_port} | awk 'NR!=1 {print $2}' | xargs kill
lsof -i tcp:${DB_port} | awk 'NR!=1 {print $2}' | xargs kill
