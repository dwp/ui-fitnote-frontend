#!/bin/bash
awslocal sns create-topic --name fitnote-topic
awslocal sqs create-queue --queue-name fitnote-queue
awslocal sns set-subscription-attributes --subscription-arn "$(awslocal sns subscribe --return-subscription-arn --topic-arn "arn:aws:sns:us-east-1:000000000000:fitnote-topic" --protocol sqs --notification-endpoint "arn:aws:sqs:elasticmq:000000000000:fitnote-queue" | python3 -c "import sys, json; print(json.load(sys.stdin)['SubscriptionArn'])")" --attribute-name FilterPolicy --attribute-value "{\"x-dwp-routing-key\":\{\"prefix\": \"sns.fitnote.new\"\}}"
