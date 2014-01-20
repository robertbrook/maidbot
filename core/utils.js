// This file is part of maidbot.
// Copyright (c) 2014 vomitcuddle <shinku@dollbooru.org>
// License: MIT.
var filters = require('../filters');

/**
 * Filters tweets by weight.
 * @param {Array} tweets Array of tweets.
 * @param {Number} weight Minimum weight.
 * @returns {Array} Filtered array.
 */
var filterTweetsByWeight = function (tweets, weight) {
  return tweets.filter(function (tweet) {
    return tweet.weight >= weight;
  });
};

/**
 * Get random element from array.
 * @param {Array} array Array.
 * @returns {Object} Random item from array.
 */
var getRandomElementFromArray = function (array) {
  return array[Math.floor(Math.random()*array.length)];
};

/**
 * Checks if given user ID should be ignored.
 * @param {String} userId User ID.
 * @param {Array} ignoredUsers Array of ignored user IDs.
 * @returns {Boolean} True if user should be ignored.
 */
exports.isUserIgnored = function (userId, ignoredUsers) {
  return ignoredUsers.indexOf(userId) > -1;
};


/**
 * Filters and returns a random matching tweet.
 * Takes only tweets with at least one filter into account.
 * @param {Object} tweet Tweet to match against.
 * @param {Array} tweets Array of tweets.
 * @param {String} type Event type. (timeline/reply).
 * @param {Boolean} caseInsensitive Make filters case-insensitive. (Optional)
 * @returns {Object} Random matching reply.
 */
exports.filterAndGetTweet = function (tweet, type, tweets, caseInsensitive) {
  // Default to case-sensitive.
  if (caseInsensitive === undefined) {
    caseInsensitive = false;
  }

  // Keep track of highest tweet.weight.
  var highestWeight = 1;
  // Filter tweets.
  tweets = tweets.filter(function (t) {
    // Make sure tweet has right type and that it has at least one filter.
    if (t.type.indexOf(type) > -1 && Object.keys(t.filters).length > 0) {
      // Loop over filters.
      for (var filter in t.filters) {
        if (filters[filter] && filters[filter](t.filters[filter], tweet, caseInsensitive)) {
          if (t.weight > highestWeight) {
            highestWeight = t.weight;
          }
          return true;
        }
      }
    }
    return false;
  });

  if (tweets.length > 0) {
    // Return random tweet with highest weight.
    return getRandomElementFromArray(filterTweetsByWeight(tweets, highestWeight));
  }
  return null;
};

/**
 * Finds a random response without using filters.
 * Takes only tweets with no into account
 * @param {Object} tweets Array of tweets.
 * @param {String} type Event type. (Optional, defaults to reply)
 * @returns {Object} Random response.
 */
exports.getRandomReply = function (tweets, type) {
  if (type === undefined) {
    type = 'reply';
  }

  // Keep track of highest tweet weight.
  var highestWeight = 1;
  // Find tweets with matching type and no filters.
  tweets = tweets.filter(function(t) {
    if (t.type.indexOf(type) > -1 && Object.keys(t.filters).length === 0) {
      if (t.weight > highestWeight) {
        highestWeight = t.weight;
      }
      return true;
    }
    return false;
  });

  if (tweets.length > 0) {
    // Return random tweet with highest weight.
    return getRandomElementFromArray(filterTweetsByWeight(tweets, highestWeight));
  }
  return null;
};
