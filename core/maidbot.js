// This file is part of maidbot.
// Copyright (c) 2014 vomitcuddle <shinku@dollbooru.org>
// License: MIT
var chalk = require('chalk');
var Twitter = require('./twitter').Twitter;
var utils = require('./utils');

/**
 * Create a new instance of Maidbot.
 * @param {Object} config Parsed configuration file.
 */
var Maidbot = function (config) {
  this.config = config;
  this.twitter = new Twitter(config);
};

/**
 * Connect to twitter streaming API.
 * @param {Function} callback Callback function
 */
Maidbot.prototype.connect = function (callback) {
  console.log("Authenticating...");
  this.twitter.connect(function (error) {
    if (error) {
      console.error(error);
      callback(error);
    } else {
      console.log("Logged in as @" + this.twitter.screen_name + ".");
      this.twitter.stream.on('follow', this.onFollow.bind(this));
      this.twitter.stream.on('unfollow', this.onUnfollow.bind(this));
      this.twitter.stream.on('timeline', this.onTimeline.bind(this));
      this.twitter.stream.on('reply', this.onReply.bind(this));
      // Enable random tweets.
      if (this.config.random_tweet_enable) {
        setInterval(this.tweetRandom, this.config.random_tweet_interval * 60000);
      }
      callback();
    }
  }.bind(this));
};

/**
 * Handle follow events.
 * @param {Object} event Follow event.
 */
Maidbot.prototype.onFollow = function (event) {
  console.log("Followed by @" + event.source.screen_name + ".");
  // Follow back.
  if (this.config.auto_follow_back && !utils.isUserIgnored(event.source.id_str, this.config.ignored_users)) {
    console.log("Following @" + event.source.screen_name + "...");
    this.twitter.follow(event.source.id_str, function (err, res) {
      if (err) {
        console.error(err);
      } else {
        console.log("Followed @" + event.source.screen_name + ".");
      }
    });
  }
};

/**
 * Handle unfollow events.
 * @param {Object} event Unfollow event.
 */
Maidbot.prototype.onUnfollow = function (event) {
  console.log("Unfollowed by @" + event.source.screen_name + ".");
  // Unfollow back.
  if (this.config.auto_follow_back) {
    console.log("Unfollowing @" + event.source.screen_name + "...");
    this.twitter.unfollow(event.source.id_str, function (err) {
      if (err) {
        console.error(err);
      } else {
        console.log("Unfollowed @" + event.source.screen_name + ".");
      }
    });
  }
};

/**
 * Handle timeline events.
 * @param {Object} event Timeline event.
 */
Maidbot.prototype.onTimeline = function (event) {
  console.log("@" + event.user.screen_name + " " + event.text);
  var reply = this.getReplyToTweet('timeline', event);
  if (reply !== null) {
    console.log("Replying @" + event.user.screen_name + " " + reply.body + "...");
    this.twitter.reply(event, reply.body, function (err) {
      if (err) {
        console.error(err);
      }
    });
  }
};

/**
 * Handle reply events.
 * @param {Object} event Reply event.
 */
Maidbot.prototype.onReply = function (event) {
  console.log("@" + event.user.screen_name + " " + event.text);
  var reply = this.getReplyToTweet('reply', event);
  if (reply !== null) {
    console.log("Replying @" + event.user.screen_name + " " + reply.body + "...");
    this.twitter.reply(event, reply.body, function (err) {
      if (err) {
        console.error(err);
      }
    });
  }
};

/**
 * Post periodical random tweets.
 */
Maidbot.prototype.tweetRandom = function () {
  var tweet = utils.getRandomTweet(this.config.tweets);
  if (tweet !== null) {
    console.log("Tweeting " + tweet.body + "...");
    this.twitter.tweet(tweet.body, function (err) {
      if (err) {
        console.error(err);
      }
    });
  }
};

/**
 * Attempts to find a reply to given tweet.
 * @param {String} type Event type (timeline/reply).
 * @param {Object} tweet Tweet being replied to.
 * @returns {String} Matched reply or null if none found.
 */
Maidbot.prototype.getReplyToTweet = function (type, tweet) {
  // Ignore tweets from ignored_users.
  if (utils.isUserIgnored(tweet.user.id_str, this.config.ignored_users)) {
    return null;
  }
  // Try to match response using filters.
  var res = utils.filterAndGetTweet(tweet, type, this.config.tweets, this.config.filters_case_insensitive);
  // Return response if found.
  if (res !== null) {
    return res;
  }
  // If tweet is a reply, then pick a random response with no filters.
  if (type === 'reply') {
    return utils.getRandomReply(this.config.tweets, type);
  }
  return null;
};

// Export module.
module.exports = Maidbot;
