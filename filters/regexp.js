// filters/regexp.js - FIlters tweets based on regular expressions.
// This file is part of maidbot.
// Copyright (c) 2013 vomitcuddle <shinku@dollbooru.org>
// License: MIT

/**
 * Filters tweets based on regular expressions.
 * @param {String} regex Regular expression string.
 * @param {Object} tweet Tweet to filter.
 * @param {Boolean} caseInsensitive Enable case-insensitive mode.
 * @return {Boolean} True if tweet matches the regular expression.
 */
function regexp (regex, tweet, caseInsensitive) {
  // Compile regexp if necessary.
  if (!(regex instanceof RegExp)) {
    regex = new RegExp(regex, caseInsensitive ? 'i' : undefined);
  }
  return regex.test(tweet.text);
}

// Export module.
module.exports = regexp;
