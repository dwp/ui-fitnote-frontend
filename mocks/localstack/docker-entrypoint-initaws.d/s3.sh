#!/bin/bash
awslocal s3api create-bucket --bucket mock-drs-bucket
awslocal s3api create-bucket --bucket sns-bucket
