// filters/matches.js - Looks for substring in tweets.
// This file is part of maidbot.
// Copyright (c) 2013 vomitcuddle <shinku@dollbooru.org>
// License: MIT

/**
 * Checks if tweet contains the given substring.
 * @param {String} s Substring to look for.
 * @returns {Boolean} True if tweet contains given substring.
 */
function matches (s, tweet) {
  return tweet.text.indexOf(s) > -1;
}

// Export module.
module.exports = matches;
