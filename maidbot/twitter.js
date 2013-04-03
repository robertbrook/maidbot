// This file is part of maidbot.
// Copyright (c) 2013 vomitcuddle <shinku@dollbooru.org>
// License: ISC
var Twitter = require('mtwitter'),
    filters = require('./filters.js');

module.exports = function (config) {
  // Twitter API.
  var twitter;
  // Compiled tweets.
  var tweets = {
    random: [],
    timeline: [],
    reply: [],
    follower: []
  };
  // Own user ID.
  var userid = 0;
  
  // Compile tweets into cached objects.
  var compileTweets = function () {
    var filterFactory = filters(config.filters_case_insensitive);
    
    console.log("Compiling " + config.tweets.length + " tweets...");
    config.tweets.forEach(function (tweet) {
      var cTweet = {}; // Compiled tweet object.
      // Copy variables.
      cTweet.body = tweet.body;
      cTweet.type = tweet.type;
      cTweet.weight = tweet.weight;

      // Compile filters.
      cTweet.filters = [];
      for (var filter_type in tweet.filters) {
        if (tweet.filters.hasOwnProperty(filter_type)) {
          cTweet.filters.push(filterFactory[filter_type](tweet.filters[filter_type]));
        }
      }

      // Add tweets to arrays.
      if (cTweet.type.indexOf("random") > -1) {
        tweets.random.push(cTweet);
      }
      if (cTweet.type.indexOf("timeline") > -1) {
        tweets.timeline.push(cTweet);
      }
      if (cTweet.type.indexOf("reply") > -1) {
        tweets.reply.push(cTweet);
      }
      if (cTweet.type.indexOf("follower") > -1) {
        tweets.follower.push(cTweet);
      }
    });
  };

  // Create a public status.
  var tweet = function (body) {
    // Console log.
    console.log("Updating status: " + body);
    // Update status.
    twitter.updateStatus(body, function (err, data) {
      if (err) {
        console.error("Could not update status.");
        console.error(data);
      }
    });
  };

  // Reply to a tweet.
  var reply = function (body, tweet) {
    // Prepend username to tweet.
    body = "@" + tweet.user.screen_name + " " + body;
    // Console log.
    console.log("Replying: " + body);
    // Update status.
    twitter.updateStatus(body, {
      "in_reply_to_status_id": tweet.id_str
    }, function (err, data) {
      if (err) {
        console.error("Could not update status.");
        console.error(data);
      }
    });
  };
  
  // Returns a random item from an array of tweets.
  var pickRandomTweet = function (tweets) {
    // TODO: Implement biased weight.
    return tweets[Math.floor(Math.random()*tweets.length)];
  };

  // Handle timeline tweets.
  var onTimeline = function (data) {
    var replies = [];

    // Console log.
    console.log("Timeline: @" + data.user.screen_name + " " + data.text);

    // Make sure user isn't silently ignored.
    if (config.ignored_users.indexOf(data.user.id_str) > -1) {
      // Do nothing.
      return;
    }

    // Look for a response to tweet.
    tweets.timeline.forEach(function (item) {
      // Run filters.
      item.filters.forEach(function (filter) {
        if (filter(data)) {
          replies.push(item);
        }
      });
    });
    
    // Tweet response.
    if (replies.length === 1) {
      reply(replies[0].body, data);
    } else if (replies.length > 1) {
      reply(pickRandomTweet(replies).body, data);
    }
  };
  
  // Handle replies.
  var onReply = function (data) {
    var replies = [];
    
    // Console log.
    console.log("Reply: @" + data.user.screen_name + " " + data.text);

    // Make sure user isn't silently ignored.
    if (config.ignored_users.indexOf(data.user.id_str) > -1) {
      // Do nothing.
      return;
    }

    // Look for a response to tweet.
    tweets.reply.forEach(function (item) {
      // Run filters.
      if (item.filters.length === 0) {
        replies.push(item);
      } else {
        item.filters.forEach(function (filter) {
          if (filter(data)) {
            replies.push(item);
          }
        });
      }
    });

    // Tweet response.
    if (replies.length === 1) {
      reply(replies[0].body, data);
    } else if (replies.length > 1) {
      reply(pickRandomTweet(replies).body, data);
    }
  };
  
  // Handle new followers.
  var onNewFollower = function (data) {
    var replies = [];

    // Console log.
    console.log("New follower: @" + data.source.screen_name);

    // Make sure user isn't silently ignored.
    if (config.ignored_users.indexOf(data.source.id_str) > -1) {
      // Do nothing.
      return;
    }

    // Auto follow back.
    if (config.auto_follow_back) {
      console.log("Following: " + data.source.screen_name);
      twitter.createFriendship(data.source.id_str, function (error, data) {
        if (error) {
          console.error("Could not create friendship: " + data);
        }
      });
    }

    // New follower greeting.
    if (tweets.follower.length > 0) {
      tweet("@" + data.source.screen_name + " " + pickRandomTweet(tweets.follower).body);
    }
  };

  // Update status with random tweet.
  var onRandomInterval = function () {
    tweet(pickRandomTweet(tweets.random).body);
  };

  // Handle stream data.
  var onStreamData = function (data) {
    // New followers.
    if (data.event && data.event === 'follow' && data.source.id_str !== userid) {
      onNewFollower(data);
    }
    // Tweets.
    if (data.text && !data.retweeted && data.user.id_str !== userid) {
      // Check if in_reply_to_user_id matches our user id.
      if (data.in_reply_to_user_id_str === userid) {
        // Is a reply.
        onReply(data);
      } else {
        // Isn't a reply.
        onTimeline(data);
      }
    }
  };
  
  // Create a Twitter API stream and bind handlers to events.
  var createStream = function () {
    twitter.stream('user', function(stream) {
      stream.on('data', onStreamData);
      
      // "Handle" errors.
      stream.on('end', function (response) {
        throw new Error("Twitter stream ended: " + response);
      });
      stream.on('destroy', function (response) {
        throw new Error("Twitter stream destroyed: " + response);
      });
    });
  };
  
  // Enables updating status at regular intervals.
  var enableRandomTweets = function () {
    if (config.random_tweet_enable) {
      setInterval(onRandomInterval, config.random_tweet_interval * 60000);
    }
  };

  // Authenticate with twitter.
  var authenticate = function () {
    // Create Twitter API object.
    twitter = new Twitter({
      consumer_key: config.twitter_api.consumer_key,
      consumer_secret: config.twitter_api.consumer_secret,
      access_token_key: config.twitter_api.access_token,
      access_token_secret: config.twitter_api.access_token_secret
    });

    // Verify credentials.
    twitter.verifyCredentials(function (error, data) {
      if (error) {
        throw new Error("Could not authenticate with twitter: " + error.message);
      } else {
        console.log("Logged in as: @" + data.screen_name);
        // Set own user id.
        userid = data.id_str;
        // Create stream.
        createStream();
        // Enable random tweets.
        enableRandomTweets();
      }
    });
  };
  
  // Compile tweets.
  compileTweets();
  // Authenticate with Twitter.
  authenticate();
};
