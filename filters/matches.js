// filters/matches.js - Looks for substring in tweets.
// This file is part of maidbot.
// Copyright (c) 2013 vomitcuddle <shinku@dollbooru.org>
// License: MIT

/**
 * Checks if tweet contains the given substring.
 * @param {String} s Substring to look for.
 * @param {Object} tweet Tweet to filter.
 * @param {Boolean} caseInsensitive Enable case-insensitive mode.
 * @returns {Boolean} True if tweet contains given substring.
 */
function matches (s, tweet, caseInsensitive) {
  if (caseInsensitive) {
    return tweet.text.toLowerCase().indexOf(s.toLowerCase()) > -1;
  }
  return tweet.text.indexOf(s) > -1;
}

// Export module.
module.exports = matches;
