// This file is part of maidbot.
// Copyright (c) 2013 vomitcuddle <shinku@dollbooru.org>
// License: MIT
var EventEmitter = require('events').EventEmitter;
var util = require('util');
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
 * @param {Function} callback Callback function.
 */
Twitter.prototype.connect = function (callback) {
  var self = this;

  // Get user credentials.
  this.verifyCredentials(function (error) {
    if (error) {
      return callback(new Error("Could not verify credentials\n" + error.message));
    }
    // Create user stream and listen for events.
    self.stream = self.twit.stream('user');
    self.stream.on('follow', function (event) {
      if (event.target.id_str === self.id && event.source.id_str !== self.id) {
        self.emit('follow', event);
      }
    });
    self.stream.on('unfollow', function (event) {
      if (event.target.id_str === self.id && event.source.id_str !== self.id) {
        self.emit('unfollow', event);
      }
    });
    self.stream.on('tweet', function (tweet) {
      // Ignore own tweets and retweets.
      if (tweet.user.id_str !== self.id && !tweet.retweeted_status) {
        // Check if tweet is a reply.
        if (tweet.in_reply_to_user_id_str === self.id) {
          self.emit('reply', tweet);
        } else {
          self.emit('timeline', tweet);
        }
      }
    });
    if (callback) {
      callback();
    }
  });
};

/**
 * Post a new tweet.
 * @param {String} status Message to tweet.
 * @param {Function} callback Callback function.
 */
Twitter.prototype.tweet = function (status, callback) {
  this.twit.post('statuses/update', {status: status}, callback);
};

/**
 * Reply to a tweet mentioning users being replied to.
 * @param {Object} tweet Tweet being replied to.
 * @param {String} status Message to tweet.
 * @param {Function} callback Callback function.
 */
Twitter.prototype.reply = function (tweet, status, callback) {
  this.twit.post('statuses/update', {
    in_reply_to_status_id: tweet.id_str,
    status: '@' + tweet.user.screen_name + ' ' + status
  }, callback);
};

/**
 * Retweet a post.
 * @param {Object} tweet Post to retweet.
 * @param {Function} callback Callback function.
 */
Twitter.prototype.retweet = function (tweet, callback) {
  this.twit.post('statuses/retweet', {id: tweet.id_str}, callback);
};

/**
 * Follows a new user.
 * @param {String} user_id User ID.
 * @param {Function} callback Callback function.
 */
Twitter.prototype.follow = function (user_id, callback) {
  this.twit.post('friendships/create', {user_id: user_id}, callback);
};

/**
 * Unfollows a user.
 * @param {String} user_id User ID.
 * @param {Function} callback Callback function.
 */
Twitter.prototype.unfollow = function (user_id, callback) {
  this.twit.post('friendships/destroy', {user_id: user_id}, callback);
};

// Module exports.
exports.Twitter = Twitter;
