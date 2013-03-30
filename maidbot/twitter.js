// This file is part of maidbot.
// Copyright (c) 2013 vomitcuddle <shinku@dollbooru.org>
// License: ISC
var Twitter = require('mtwitter'),
    filterFactory = require('./filters.js');

module.exports = function (config) {
  var twitter;
  var tweets;
  var userid = 0; // Own user ID.

  var createStream = function () {
    twitter.stream('user', function (stream) {
      stream.on('data', function (data) {
        // Handle new followers.
        if (data.event && data.event === 'follow') {
          console.log("New follower: " + data.source.screen_name);
          if (config.auto_follow_back && config.ignored_users.indexOf(data.source.id) === -1) {
            twitter.createFriendship(data.source.id, function (error) {
              if (!error) {
                console.log("Followed: " + data.source.screen_name);
              }
            });
          }
        }
        // Handle tweets.
        if (data.text) {
          if (data.in_reply_to_user_id === userid) {
            reply(data);
          } else {
            timeline(data);
          }
        }

      });

      stream.on('end', function (response) {
        throw new Error("Twitter stream interrupted: " + response);
      });

      stream.on('destroy', function (response) {
        throw new Error("Twitter stream silently interrupted: " + response);
      });
    });
  };

  twitter = new Twitter({
    consumer_key: config.twitter_api.consumer_key,
    consumer_secret: config.twitter_api.consumer_secret,
    access_token_key: config.twitter_api.access_token,
    access_token_secret: config.twitter_api.access_token_secret
  });
  
  // Check login.
  twitter.verifyCredentials(function(error, data) {
    if (error) {
      throw new Error("Could not authenticate with twitter: " + error.message);
    } else {
      console.log("Logged in as: @" + data.screen_name);
      userid = data.id;
      createStream();
    }
  });
};
