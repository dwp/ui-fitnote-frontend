#!/bin/bash

#Get pages path fragments
PAGES_PATH="/$(echo "$CI_PAGES_URL" | cut -d / -f4-)"
PAGES_SUBDOMAIN=$(echo "$CI_PROJECT_NAMESPACE" | cut -d / -f1)
export PAGES_SUBDOMAIN
PAGES_URL=$CI_PAGES_URL
PROJECT_URL=$CI_PROJECT_URL

#Update docs config
sed -ie "s,##SERVICE_NAME##,$SERVICE_NAME,g" "$CI_PROJECT_DIR"/product-docs/config/tech-docs.yml
sed -ie "s,##PAGES_PATH##,$PAGES_PATH,g" "$CI_PROJECT_DIR"/product-docs/config/tech-docs.yml
sed -ie "s,##PAGES_URL##,$PAGES_URL,g" "$CI_PROJECT_DIR"/product-docs/config/tech-docs.yml
sed -ie "s,##PROJECT_URL##,$PROJECT_URL,g" "$CI_PROJECT_DIR"/product-docs/config/tech-docs.yml
sed -ie "s,##PAGES_PATH##,$PAGES_PATH,g" "$CI_PROJECT_DIR"/product-docs/config.rb

#Build docs site
cd "$CI_PROJECT_DIR"/product-docs || exit
bundle exec middleman build --verbose

#Update docs config
sed -ie "s,/search.json,$PAGES_PATH/search.json,g" "$CI_PROJECT_DIR"/public/javascripts/application.js

if [ -n "${API_DIRECTORY}" ]; then
  cd "$CI_PROJECT_DIR" || exit
  echo "Copy OpenAPI spec documents to ${CI_PROJECT_DIR}/public/openapi-spec"
  cp -Rp ./openapi-spec "$CI_PROJECT_DIR"/public/openapi-spec

  echo "Replace in files *.html"
  find "$CI_PROJECT_DIR"/public -type f -name "*.html" -exec sed -ie "/~#DWP-OPENAPI#~/r ./openapi-spec/html.snippet" {} +
  find "$CI_PROJECT_DIR"/public -type f -name "*.html" -exec sed -ie "/~#DWP-OPENAPI#~/d" {} +
fi

if [ -n "${ADDITIONAL_DISTRIBUTION}" ]; then
  cd "$CI_PROJECT_DIR" || exit
  echo "Copy additional document bundle from ${ADDITIONAL_DISTRIBUTION} to $CI_PROJECT_DIR/public"
  cp -Rpv "${ADDITIONAL_DISTRIBUTION}" "$CI_PROJECT_DIR"/public
fi

#Output the pages URL to the GitLab console
echo "GitLab Pages URL: $PAGES_URL"