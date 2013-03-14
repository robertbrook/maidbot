/** 
 * This file is part of maidbot.
 * Copyright (c) 2013 vomitcuddle <shinku@dollbooru.org>
 * License: ISC
 */

// Twitter configuration schema.
var twitter_api_schema = {
  "schema": "http://json-schema.org/draft-04/schema#",
  "title": "Twitter API Settings",
  "description": "Twitter API Settings",
  "type": "object",
  "required": true,
  "properties": {
    "consumer_key": {
      "description": "Consumer key",
      "type": "string",
      "required": true
    },
    "consumer_secret": {
      "description": "Consumer secret",
      "type": "string",
      "required": true
    },
    "access_token": {
      "description": "OAuth Access Token",
      "type": "string",
      "required": true
    },
    "access_token_secret": {
      "description": "OAuth Access Secret",
      "type": "string",
      "required": true
    }
  }
};

var tweet_schema = {
  "schema": "http://json-schema.org/draft-04/schema#",
  "title": "Tweet",
  "description": "A maidbot tweet",
  "type": "object",
  "properties": {
    "body": {
      "description": "The content of the tweet",
      "type": "string",
      "required": true
    },
    "type": {
      "description": "The events this tweet should respond to",
      "type": "array",
      "minItems": 1,
      "items": {
        "type": "string",
        "enum": ["random", "timeline", "reply", "follower"]
      },
      "required": true
    },
    "filters": {
      "description": "Tweet event filters",
      "type": "object",
      "default": { },
      "properties": {
        "regexp": {"type": "string"},
        "matches": {"type": "string"},
        "random": {"type": "integer"}
      }
    },
    "weight": {
      "description": "used to calculate probability the tweet will be chosen over the others",
      "type": "integer",
      "minimum": 1,
      "default": 1
    }
  }
};

// Define configuration JSON schema.
module.exports = {
  "schema": "http://json-schema.org/draft-04/schema#",
  "title": 'Configuration',
  "description": "maidbot configuration file",
  "type": "object",

  "properties": {
    "twitter_api": twitter_api_schema,
    "auto_follow_back": {
      "description": "Automatically follow users after they follow you",
      "type": "boolean",
      "default": true
    },
    "random_tweet_enable": {
      "description": "Enables periodical random tweets.",
      "type": "boolean",
      "default": true
    },
    "random_tweet_interval": {
      "description": "How often random tweets should be made, in minutes",
      "type": "integer",
      "minimum": 5,
      "default": 60
    },
    "filters_case_insensitive": {
      "description": "Toggles filter case-insensitivity",
      "type": "boolean",
      "default": true
    },
    "tweets": {
      "description": "Array of Tweets",
      "type": "array",
      "minItems": 1,
      "required": true,
      "items": tweet_schema
    },
    "ignored_users": {
      "description": "IDs of users to ignore",
      "type": "array",
      "default": [],
      "items": { 
        "type": "string",
        "pattern": "^[0-9]+$"
      }
    }
  }
};
