// This file is part of maidbot.
// Copyright (c) 2014 vomitcuddle <shinku@dollbooru.org>
// License: MIT
var chalk = require('chalk');
var Twitter = require('./twitter').Twitter;
var utils = require('./utils');

/**
 * Create a new instance of Maidbot.
 * @param {Object} config Parsed configuration file.
 * @param {Number} logLevel Log verbosity level (0-3)
 */
var Maidbot = function (config, enableLogging) {
  this.config = config;
  this.twitter = new Twitter(config);
  this.log = enableLogging === true;
};

/**
 * Connect to twitter streaming API.
 */
Maidbot.prototype.connect = function () {
  this.stream = this.twitter.connect();
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
