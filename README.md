Twitter bot inspired by [twittbot.net](https://twittbot.net/)

[![Build Status](https://travis-ci.org/vomitcuddle/maidbot.png)](https://travis-ci.org/vomitcuddle/maidbot)
[![NPM version](https://badge.fury.io/js/maidbot.png)](http://badge.fury.io/js/maidbot)
[![Dependency Status](https://gemnasium.com/vomitcuddle/maidbot.png)](https://gemnasium.com/vomitcuddle/maidbot)

## Installation
```bash
$ npm install -g maidbot
```

## Running
```bash
$ maidbot config_file.json
```

## Configuration
Maidbot uses JSON files for configuration. 
There's an example configuration file under `example/maidbot.json` and a JSON schema under `maidbot/config/schema.js`.

#### Example configuration
```javascript
// Don't copy and paste this.
var maidbot_config = {
  "twitter_api": { // Twitter API settings. See: http://dev.twitter.com. Required.
    "consumer_key": "",
    "consumer_secret": "",
    "access_token": "",
    "access_token_secret": ""
  },

  "auto_follow_back": true, // Follow new followers back. Defaults to true.
  "random_tweet_enable": true, // Update status with random tweets at given intervals. Defaults to true.
  "random_tweet_interval": 60, // Random status interval, in minutes. Defaults to 60 minutes.
  "filters_case_insensitive": true, // Whether filters should be case-insensitive. Defaults to true.

  "tweets": [ // Array of statuses to make.
    { "body": "I shall make you some tea", // Tweet body.
      "type": ["timeline", "random"], // Array of status types. Timeline tweets will be handled by onTimelineTweet(), replies by onReply(), etc. Possible values: random, timeline, reply, follower. Required. Must not be empty.
      "filters": { // Filters object.
        "regexp": "thirsty|make.+(?:tea)" // This status will be used as a possible response to tweets matching this pattern.
        // Other types of filters: regexp, matches, userid.
      }
    }
  ],
        
  "ignored_users": ["148684820"] // Array of user IDs to silently ignore.
};
```

## Wishlist
* A better way to define your own filters.
* Stats
