// This file is part of maidbot.
// Copyright (c) 2014 vomitcuddle <shinku@dollbooru.org>
// License: MIT
var chalk = require('chalk');
var Twitter = require('./twitter').Twitter;
var utils = require('./utils');

/**
 * Create a new instance of Maidbot.
 * @param {Object} config Parsed configuration file.
 * @param {Boolean} enableLogging Toggle logging.
 */
var Maidbot = function (config, enableLogging) {
  this.config = config;
  this.twitter = new Twitter(config);
  this.enableLogging = enableLogging === true;
};

/**
 * Handle logging.
 */
Maidbot.prototype.log = function (msg) {
  if (this.enableLogging) {
    console.log(msg);
  }
};

/**
 * Connect to twitter streaming API.
 * @param {Function} callback Callback function
 */
Maidbot.prototype.connect = function (callback) {
  this.log("Authenticating...");
  this.twitter.connect(function (error) {
    if (error) {
      console.error(chalk.red(error));
      callback(error);
    } else {
      this.log(chalk.green("Logged in as @" + this.twitter.screen_name + "."));
      this.twitter.on('follow', this.onFollow.bind(this));
      this.twitter.on('unfollow', this.onUnfollow.bind(this));
      this.twitter.on('timeline', this.onTimeline.bind(this));
      this.twitter.on('reply', this.onReply.bind(this));
      // Enable random tweets.
      if (this.config.random_tweet_enable) {
        setInterval(this.tweetRandom.bind(this), this.config.random_tweet_interval * 60000);
      }
      if (callback) {
        callback();
      }
    }
  }.bind(this));
};

/**
 * Handle follow events.
 * @param {Object} event Follow event.
 */
Maidbot.prototype.onFollow = function (event) {
  this.log(chalk.magenta("Followed by @" + event.source.screen_name + "."));
  // Follow back.
  if (this.config.auto_follow_back && !utils.isUserIgnored(event.source.id_str, this.config.ignored_users)) {
    this.log("Following @" + event.source.screen_name + "...");
    this.twitter.follow(event.source.id_str, function (err, res) {
      if (err) {
        console.error(chalk.red(err));
      } else {
        this.log(chalk.green("Followed @" + event.source.screen_name + "."));
      }
    }.bind(this));
  }
  // Greet new followers.
  if (this.config.follower_greetings.length > 0 && !utils.isUserIgnored(event.source.id_str, this.config.ignored_users)) {
    // Pick random greeting.
    var greeting = this.config.follower_greetings[Math.floor(
      Math.random()*this.config.follower_greetings.length)];
    this.twitter.tweet('@' + event.source.screen_name + ' ' + greeting);
  }
};

/**
 * Handle unfollow events.
 * @param {Object} event Unfollow event.
 */
Maidbot.prototype.onUnfollow = function (event) {
  this.log(chalk.magenta("Unfollowed by @" + event.source.screen_name + "."));
  // Unfollow back.
  if (this.config.auto_follow_back) {
    this.log("Unfollowing @" + event.source.screen_name + "...");
    this.twitter.unfollow(event.source.id_str, function (err) {
      if (err) {
        console.error(chalk.red(err));
      } else {
        this.log(chalk.green("Unfollowed @" + event.source.screen_name + "."));
      }
    }.bind(this));
  }
};

/**
 * Handle timeline events.
 * @param {Object} event Timeline event.
 */
Maidbot.prototype.onTimeline = function (event) {
  this.log(chalk.grey("@" + event.user.screen_name + " " + event.text));
  var reply = this.getReplyToTweet('timeline', event);
  if (reply !== null) {
    this.log("Replying @" + event.user.screen_name + " " + reply.body);
    this.twitter.reply(event, reply.body, function (err) {
      if (err) {
        console.error(chalk.red(err));
      }
    });
    if (reply.type.indexOf('retweet') > -1 && !event.protected) {
      console.log("Retweeting @" + event.user.screen_name + ' ' + event.text);
      this.twitter.retweet(event, function (err) {
        if (err) {
          console.error(chalk.red(err));
        }
      });
    }
  }
};

/**
 * Handle reply events.
 * @param {Object} event Reply event.
 */
Maidbot.prototype.onReply = function (event) {
  this.log(chalk.yellow("@" + event.user.screen_name + " " + event.text));
  var reply = this.getReplyToTweet('reply', event);
  if (reply !== null) {
    this.log("Replying @" + event.user.screen_name + " " + reply.body);
    this.twitter.reply(event, reply.body, function (err) {
      if (err) {
        console.error(chalk.red(err));
      }
    });
    if (reply.type.indexOf('retweet') > -1 && !event.protected) {
      console.log("Retweeting @" + event.user.screen_name + ' ' + event.text);
      this.twitter.retweet(event, function (err) {
        if (err) {
          console.error(chalk.red(err));
        }
      });
    }
  }
};

/**
 * Handle disconnect events.
 * @param {Object} event Disconnect event.
 */
Maidbot.prototype.onDisconnect = function (event) {
  console.error(chalk.white("Twitter stream interrupted: ") + chalk.red(event));
  if (this.config.auto_reconnect) {
    this.log("Reconnecting...");
    this.connect(function (error) {
      console.error(chalk.red(error));
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

/**
 * Post periodical random tweets.
 */
Maidbot.prototype.tweetRandom = function () {
  var tweet = utils.getRandomTweet(this.config.tweets);
  if (tweet !== null) {
    this.log("Tweeting " + tweet.body);
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
