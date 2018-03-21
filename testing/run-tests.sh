#!/bin/bash
# Runs ALL TESTS

# Define list of urls for tests
urls=(index take-a-photo photo-audit nino address text-message complete cookies cookies-table 404 500)
disabilities=(achromatomaly achromatopsia deuteranomaly deuteranopia protanomaly protanopia tritanomaly tritanopia )

echo "Please Note: An internet connection is REQUIRED for all tests to run successfully"

cd ../

# Mocha unit tests
echo "Starting Mocha tests"
npm run test

# Start the test server in background
json-server --port 3004 testing/db.json &

# Start Node in test mode in background
npm run testing --scripts-prepend-node-path &

# Wait for the Node Server to start up
echo "Waiting for Node to start..."
sleep 5

# Javascript Lint checks
echo "Starting esLint..."
eslint -c testing/configs/.eslintrc.json */*.js

# Sass Lint checks
echo "Starting Sass Lint..."
sass-lint -c testing/configs/.sass-lint.yml 'assets/scss/*.scss' -v -q
# open -g testing/linting/sass-lint.html

# Run Valimate HTML validation tests
cd testing/configs
valimate

cd ../

# Run Broken Link Checker
for i in "${urls[@]}"
do
    blc http://localhost:3000/$i
done

# Pa11y accesibility checks
echo "Starting Pa11y..."
for i in "${urls[@]}"
do
    pa11y http://localhost:3000/$i --reporter html > accessibility/$i.html
    # open -g accessibility/$i.html
    echo $i processed
done
echo "Finished Pa11y"

# #Delete existing shots
# rm -rf -- shots
# #Re-create the shots folder
# mkdir -p shots
# # change directory in to shots folder and take screenshots at multiple resolutions.
# cd shots

# for i in "${urls[@]}"
# do
#     pageres http://localhost:3000/$i 320x480 360x640 768x1024 1024x768 1280x800
# done

#Starting Vision checks...
# echo "Starting Vision Checks..."
# for i in "${urls[@]}"
# do
#     for j in "${disabilities[@]}"
#     do
#         # open -g http://localhost:3000/$i/$j
#         #screen shot app here
#         echo $i $j processed
#     done
# done

echo "Tests Complete"

# Kill the running processes afterwards
# Node_port=3000
# DB_port=3004
# lsof -i tcp:${Node_port} | awk 'NR!=1 {print $2}' | xargs kill
# lsof -i tcp:${DB_port} | awk 'NR!=1 {print $2}' | xargs kill
