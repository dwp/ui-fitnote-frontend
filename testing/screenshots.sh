#!/bin/bash
# Define list of urls for tests
urls=(index take-a-photo photo-audit nino address text-message complete cookies cookies-table 404 500)
resolutions=(320x480 360x640 768x1024 1024x768 1280x800)

echo "This might take a while. Time to grab a ☕"

cd ../

# Start the test server in background
json-server --port 3004 testing/db.json &

# Start Node in test mode in background
npm run testing --scripts-prepend-node-path &

# Wait for the Node Server to start up
sleep 5

#Navigate in to test folder
cd testing

#Delete existing shots
rm -rf -- shots

#Create the shots folder
mkdir -p shots

# Change directory in to shots folder and take screenshots at multiple resolutions.
cd shots

#Create the shots resolution folders
mkdir -p $(date '+%Y-%m-%d')/320x480/pages
mkdir -p $(date '+%Y-%m-%d')/320x480/errors
mkdir -p $(date '+%Y-%m-%d')/360x640/pages
mkdir -p $(date '+%Y-%m-%d')/360x640/errors
mkdir -p $(date '+%Y-%m-%d')/768x1024/pages
mkdir -p $(date '+%Y-%m-%d')/768x1024/errors
mkdir -p $(date '+%Y-%m-%d')/1024x768/pages
mkdir -p $(date '+%Y-%m-%d')/1024x768/errors
mkdir -p $(date '+%Y-%m-%d')/1280x800/pages
mkdir -p $(date '+%Y-%m-%d')/1280x800/errors

for i in "${urls[@]}"
do
    for j in "${resolutions[@]}"
    do
    pageres http://localhost:3000/$i --filename='<%= date %>/'$j'/pages/'$i --cookie='cookies_agreed=yes' $j
    done
done

#We should capture the cookie banner
 for j in "${resolutions[@]}"
    do
    pageres http://localhost:3000/index --filename='<%= date %>/'$j'/pages/'cookie-bar $j
 done

# We need to capture the state of this page with the cookie enabled
 for j in "${resolutions[@]}"
    do
    pageres http://localhost:3000/complete --filename='<%= date %>/'$j'/pages/'complete-with-text --cookie='cookies_agreed=yes' --cookie='textMessage=yes' $j
 done

#Capture all the error messages
 for j in "${resolutions[@]}"
    do
    pageres http://localhost:3000/index?timeout=0 --filename='<%= date %>/'$j'/errors/'timeout --cookie='cookies_agreed=yes' $j
done

 for j in "${resolutions[@]}"
    do
    pageres http://localhost:3000/take-a-photo?error=noPhoto --filename='<%= date %>/'$j'/errors/'no-photo --cookie='cookies_agreed=yes' $j
    pageres http://localhost:3000/take-a-photo?error=invalidPhoto --filename='<%= date %>/'$j'/errors/'invalid-photo --cookie='cookies_agreed=yes' $j
    pageres http://localhost:3000/take-a-photo?error=ocrFailed --filename='<%= date %>/'$j'/errors/'ocr-failed --cookie='cookies_agreed=yes' $j
done

 for j in "${resolutions[@]}"
    do
    pageres http://localhost:3000/nino?nino=0 --filename='<%= date %>/'$j'/errors/'nino-blank --cookie='cookies_agreed=yes' $j
    pageres http://localhost:3000/nino?nino=1 --filename='<%= date %>/'$j'/errors/'nino-bad-format --cookie='cookies_agreed=yes' $j
done

 for j in "${resolutions[@]}"
    do
    pageres http://localhost:3000/address?houseNumber=0 --filename='<%= date %>/'$j'/errors/'address-number-blank --cookie='cookies_agreed=yes' $j
    pageres http://localhost:3000/address?postcode=0 --filename='<%= date %>/'$j'/errors/'address-postcode-blank --cookie='cookies_agreed=yes' $j
    pageres http://localhost:3000/address?houseNumber=0&postcode=0 --filename='<%= date %>/'$j'/errors/'address-and-postcode-blank --cookie='cookies_agreed=yes' $j
done

 for j in "${resolutions[@]}"
    do
    pageres http://localhost:3000/text-message?text=0 --filename='<%= date %>/'$j'/errors/'text-message-blank --cookie='cookies_agreed=yes' $j
    pageres http://localhost:3000/text-message?text=1 --filename='<%= date %>/'$j'/errors/'text-message-no-confirm --cookie='cookies_agreed=yes' $j
done

echo "Tests Complete"

# Kill the running processes afterwards
Node_port=3000
DB_port=3004
lsof -i tcp:${Node_port} | awk 'NR!=1 {print $2}' | xargs kill
lsof -i tcp:${DB_port} | awk 'NR!=1 {print $2}' | xargs kill
