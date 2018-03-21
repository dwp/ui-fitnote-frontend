#!/bin/bash

#install dependancies
brew install phantomjs

# Install all global packages
# - Gulp CLI
# - Pa11y
# - Node Security Platform
# - Broken Link Checker
# - Pageres CLI
# - Bunyan CLI
# - JSON Server
# - Valimate
# - Jasmine
# - Sass-lint
# - Istanbul
# - SNYK
sudo npm install -g gulp-cli pa11y nsp broken-link-checker pageres-cli bunyan json-server valimate mocha eslint sass-lint istanbul

# Install local packages
npm update

#remove npm module dupes
npm dedupe

#Install pre-git hooks
# ln -s ../../pre-commit.sh .git/hooks/pre-commit
