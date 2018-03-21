#!/bin/bash

# check parameters
if [ "$#" -lt 1 ]
then
  echo 'invalid :: must pass artifactory path';
  exit 1;
fi

# Run NPM update checks
npm update --scripts-prepend-node-path

# Run Node securty checks (test file needs to be in route to scan package.json)
./node_modules/.bin/nsp check

# Gulp (clean, site and complile )
./node_modules/.bin/gulp jenkins

# Run NPM Shrinkwrap
rm -rf -- shrinkwrap.json
npm shrinkwrap

# start the installation, no load of optionals
npm install --only=production --no-optional

# extract data to build deployment paths
echo "[INFO] preparing to install with installation parameters:-"
PROJECT_VERSION=$(grep version package.json  | awk '{print $2}' | tr -d "\",")
ARTI_DIR="$1/${JOB_NAME}/${PROJECT_VERSION}/"
DIST_FILE="${JOB_NAME}.tar.gz"
if [[ "$2" == "dev" ]]; then
  DIST_FILE="${JOB_NAME}-${BUILD_NUMBER}.tar.gz"
fi
DIST_URL="${ARTI_DIR}${DIST_FILE}"

# remove existing tarballs
echo "[INFO] remove previous tarballs"
rm ${JOB_NAME}*.tar.gz

echo "[INFO] creating a distribution tarball"
tar czf "$DIST_FILE" app assets bin node_modules package.json public LICENSE CONTRIBUTING.md
if [[ $? != 0 ]]; then
  echo "[ERROR] failed to build distribution tarball package"
  exit 1
fi

# publish to artifactory
echo "[INFO] publishing distribution tarball to Artifactory: $DIST_URL"
set -x

sha1=$(sha1sum "$DIST_FILE" | cut -d ' ' -f 1)
md5=$(md5sum "$DIST_FILE" | cut -d ' ' -f 1)

# Upload the file content
upload=$(curl -s -w '%{http_code}' -o /dev/null -X PUT --data-binary "@${DIST_FILE}" "${DIST_URL}")
echo "[INFO] upload status for ${DIST_FILE} to ${DIST_URL} -> $upload"

# Upload the checksums
echo "[INFO] upload checksums"
checksum=$(curl -s -w '%{http_code}' -o /dev/null -X PUT -H "X-Checksum-Deploy:true" -H "X-Checksum-Sha1:$sha1" -H "X-Checksum-Md5:$md5" --data-binary "@${DIST_FILE}" "${DIST_URL}")
echo "[INFO] checksum upload status for ${DIST_FILE} to ${DIST_URL} -> $checksum with sha1=$sha1, md5=$md5"
if [[ "$checksum" -ne 201 ]]; then
  echo "[ERROR] failed to publish checksums for $DIST_FILE to artifactory: $ARTI_DIR - HTTP code is $checksumresult"
  exit 1
fi

echo "[INFO] success, build uploaded to $DIST_URL"
