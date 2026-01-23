#!/bin/bash


npm install -g npm-check-updates --ignore-scripts
PACKAGES=$(ncu -x "$IGNORE_PACKAGES" | grep " → " | awk '{print $1": "$2" -> "$4}')

REPO_PATH=${CI_PIPELINE_URL%%/-*}

FIRST_HEADING="*${REPO_PATH##*/} - Node packages*"
SECOND_HEADING="<${REPO_PATH}|${REPO_PATH##*/}> \n :building_construction: \n"
LINK_HEADING="<${REPO_PATH}|${REPO_PATH##*/}>  :package:"
LINK_HEADING_2="<${CI_PIPELINE_URL}|Pipeline>  :electric_plug:"


PACKAGES_LINE="*Packages:* \n$PACKAGES"

json_string=$(printf '{
    "blocks": [
    		{
    			"type": "section",
    			"text": {
    				"type": "mrkdwn",
    				"text": "%s"
    			}
    		},
    		{
    			"type": "section",
    			"block_id": "section567",
    			"text": {
    				"type": "mrkdwn",
    				"text": "%s"
    			},
    			"accessory": {
    				"type": "image",
    				"image_url": "https://media.licdn.com/dms/image/v2/C4E12AQGhOm34XU9OFA/article-cover_image-shrink_600_2000/article-cover_image-shrink_600_2000/0/1520169558822?e=2147483647&v=beta&t=OpwrX9rNGCuHD4WFUxBhIb4XnACU_SEq_rmxP0cT9w8",
    				"alt_text": "Fitnote UI"
    			}
    		},
    		{
    			"type": "section",
    			"block_id": "section789",
    			"text": {
            "type": "mrkdwn",
            "text": "%s"
          }
    		}
    	],
    	"attachments": [
    		{
    			"blocks": [
    				{
    					"type": "section",
    					"text": {
    						"type": "mrkdwn",
    						"text": "*Links*"
    					}
    				},
    				{
    					"type": "section",
    					"text": {
    						"type": "mrkdwn",
    						"text": "%s"
    					},
    					"accessory": {
    						"type": "button",
    						"text": {
    							"type": "plain_text",
    							"text": "View",
    							"emoji": true
    						},
    						"value": "view_alternate_1"
    					}
    				},
    				{
    					"type": "section",
    					"text": {
    						"type": "mrkdwn",
    						"text": "%s"
    					},
    					"accessory": {
    						"type": "button",
    						"text": {
    							"type": "plain_text",
    							"text": "View",
    							"emoji": true
    						},
    						"value": "view_alternate_2"
    					}
    				}
    			]
    		}
    	]
}' "$FIRST_HEADING" "$SECOND_HEADING" "$PACKAGES_LINE" "$LINK_HEADING" "$LINK_HEADING_2")

curl -X POST -H 'Content-type: application/json' --data "$json_string" "$SLACK_WEBHOOK_URL"
