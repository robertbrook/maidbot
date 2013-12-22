// This file is part of maidbot.
// Copyright (c) 2013 vomitcuddle <shinku@dollbooru.org>
// License: MIT
var EventEmitter = require('events').EventEmitter;
var utils = require('utils');
var Twit = require('twit');

/**
 * Create an instance of a streaming twitter API client.
 * @param {Object} config Parsed maidbot configuration.
 */
function Twitter (config) {
  // Create a new twitter client.
  this.twit = new Twit({
    consumer_key: config.twitter_api.consumer_key,
    consumer_secret: config.twitter_api.consumer_secret,
    access_token: config.twitter_api.access_token,
    access_token_secret: config.twitter_api.access_token_secret
  });

  EventEmitter.call(this);
}
// Inherit from EventEmitter.
util.inherits(Twitter, EventEmitter);

/**
 * Verifies user credentials and sets useful account information.
 * @param {Function} callback Callback function.
 * @see Twitter.prototype.connect
 */
Twitter.prototype.verifyCredentials = function(callback) {
  var self = this;

  this.twit.get('account/verify_credentials', function (error, reply) {
    if (error) {
      return callback(error);
    }
    // Set user credentials.
    self.id = reply.id_str;
    self.screen_name = reply.screen_name;

    callback(null, reply);
  });
};

/**
 * Initiate connection to the twitter user stream.
 */
Twitter.prototype.connect = function () {
  var self = this;

  // Get user credentials.
  this.verify_credentials(function (error) {
    if (error) {
      // TODO: call callback function.
      return;
    }
    // Create user stream and listen for events.
    self.stream = self.twit.stream('user');
    self.stream.on('follow', function (event) {
      self.emit('follow', event);
    });
    self.stream.on('unfollow', function (event) {
      self.emit('unfollow', event);
    });
    self.stream.on('tweet', function (tweet) {
      // Ignore retweets.
      if (!tweet.retweeted) {
        // Check if tweet is a reply.
        if (tweet.in_reply_to_user_id_str === self.id) {
          self.emit('reply', tweet);
        } else {
          self.emit('timeline', tweet);
        }
      }
    });
  });
};

/**
 * Post a new tweet.
 * @param {String} status Message to tweet.
 */
Twitter.prototype.tweet = function (message) {
  this.twit.post('statuses/update', {status: status});
};

/**
 * Reply to a tweet mentioning users being replied to.
 * @param {Object} tweet Tweet being replied to.
 * @param {String} status Message to tweet.
 */
Twitter.prototype.reply = function (tweet, status) {
  this.twit.post('statuses/update', {
    in_reply_to_status_id: tweet.id_str,
    status: '@' + tweet.user.screen_name + ' ' + status
  });
};

/**
 * Follows a new user.
 * @param {String} user_id User ID.
 */
Twitter.prototype.follow = function (user_id) {
  this.twit.post('friendships/create', {user_id: user_id});
};

/**
 * Unfollows a user.
 * @param {String} user_id User ID.
 */
Twitter.prototype.unfollow = function (user_id) {
  this.twit.post('friendships/destroy', {user_id: user_id});
};

// Module exports.
exports.Twitter = Twitter;
