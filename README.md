# Fitnote-frontend Node Server
[![Build Status](https://travis-ci.org/dwp/fitnote-frontend.svg?branch=master)](https://travis-ci.org/dwp/fitnote-frontend) [![Known Vulnerabilities](https://snyk.io/test/github/dwp/fitnote-frontend/badge.svg)](https://snyk.io/test/github/dwp/fitnote-frontend)

This is the front end Node server and client facing code (HTML, CSS, JS and [Nunjucks](https://mozilla.github.io/nunjucks/getting-started.html)) to run the Fitnote App.

## Table of contents
1. [Requirements](#application-architecture)
2. [Setup](#set-up)
3. [Run](#run)
4. [Logging](#logging)
5. [Linting](#linting)
6. [Testing](#testing)
7. [Automation](#automation)
8. [Versioning](#versioning)
9. [Internationalisation](#i18n)
10. [Notify Integration](Notify integration)
11. [Configuration](#Configuration)


## APPLICATION ARCHITECTURE

* This application is a NodeJs (Express) application performing server side rendering with Nunjucks.
* Dependencies are defined in package.json
* Gulp is used for code compilation and development tooling

#### APPLICATION FILES

Application configuration items are held in the following files :-

- package.json
    - configures the node modules that are used, which are then stored in /node_modules.
- /app/configs/
    - gets config from environment variables
- /bin/server.js
    - the main NodeJs script
- /gulp
    - gulp scripts

## Set Up

Run the bash script

```
./install.sh
```

This will install all the global packages required and run ``npm update`` to install local packages.

## Running The Node Server

### Local Environment

To run the application locally:
build the app

```
npm run build
```

then run it:

```
npm run dev
```
### Test Environment

This is used exclusively for the testing scripts.

### Production Environment

This mode is for production only. It won't work in a local enviornment, and is specially configured (using SSL certs etc) for it's environment only.

Make sure you run

```
npm install --only=production --no-optional
```

BEFORE starting the service.

```
npm run prod
```

to run just the server in this mode.

## Logging

Logging is done via [Bunyan](https://github.com/trentm/node-bunyan). This is grabbed by the docker container and logged in production. For dev environments, just view the console.

## Linting

Linting tasks are run onChange in local mode, or can be run manually using:

```
gulp linting
```

## Updating node modules
To pass gitlab pipeline you have to keep node modules up to date.
To check for latest updates, update `package.json` and generate a new `npm-shrinkwrap.json` run:
```
npm run deps:update
```

### SASS Linting

Rules are defined in `.stylelintrc.yml` file where the `stylelint-config-recommended` package rules are being used. Stylelint can be run locally after installing by using the below commands:

```
npm install
npm run quality:stylelint
```

### JS Linting

This is using [eslint](http://eslint.org) file and are run automatically when a JS file is edited, if Gulp is being run.

It is configured via the ``.eslintrc.json`` in the root.

## Testing

```
cd testing
./run-tests.sh
```

Testing is described in the README file in the testing directory. It can be run manually, or will automatically be run as a pre-git hook on commit.

## Automation

This script is run by Jenkins, to build a .tar file. Modifying it may break the build. Proceed with caution!

```
installAndDeploy.sh
```

## Versioning

Versions while in test are suffixed with '-Snapshot'. Please remove this when doing a live deploy.

## i18n

The service is available in English and Welsh, the languages are enabled by passing a `lang` query string parameter to any of the urls, e.g -  
English - https://localhost:3000/index?lang=en  
Welsh - https://localhost:3000/index?lang=cy

## Notify integration

https://www.notifications.service.gov.uk/

```
"notify": {
    "mailto": "an_email@somewhere.com",
    "api_key": "the_notify_api_key",
    "proxy": null
}
```

* If the `proxy` is `null` then all notify requests will route directly (across the internet).
* If proxy routing is required then specify a url for the proxy server
    
    

## Configuration

Fitnote UI is currently uses a default json file (app/configs/dev.json) which can be overridden with the following env vars

| Env var | Default | Description |
| ------------ | ------------- | ------------------------|
| SERVICE_PORT | 3000 | Port This Service Listens On |
| SERVICE_HTTP | false | True for Plain HTTP, False for HTTPS |
| SERVICE_KEY | ./ssl/192.168.105.5.key.pem | SSL Keyfile (serviceHTTP true overrides this) |
| SERVICE_CERT | ./ssl/192.168.105.5.cert.pem | SSL Cert (serviceHTTP true overrides this) |
| SERVICE_CA_INTER | ./ssl/ca-inter.cert.pem | CA Intermediate Cert (serviceHTTP true overrides this) |
| SERVICE_CA_ROOT | ./ssl/ca-root.cert.pem | CA Root Cert (serviceHTTP true overrides this) |
| MAX_FILE_SIZE | 10000000 | Maximum  Upload File Size |
| SESSION_EXPIRY_PERIOD | 900000 | Session Cookie Expiry Time |
| TIMEOUT_DIALOG_COUNTDOWN | 600000 | With how many second remaining should the timeout dialog appear |
| API_URL | | Full API URL |
| NOTIFY_API_KEY | | Notify API Key |
| FEEDBACK_MAILTO | | Feedback Mailto: |
| NOTIFY_PROXY | null | URL of Proxy for Notify if Required |
| COOKIE_SECURE | false | Use Secure Cookies |
| GOOGLE_TAG_MANAGER_ID | "GTM-PVWF7WT" | GTM ID |
| GOOGLE_TAG_MANAGER_DOMAIN | localhost | Domain name for GTM cookies |

