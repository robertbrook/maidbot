// filters/userid.js - Filters tweets by user id
// This file is part of maidbot.
// Copyright (c) 2013 vomitcuddle <shinku@dollbooru.org>
// License: MIT

/**
 * Filters tweets by User ID.
 * @param {String} id User ID to look for.
 * @param {Object} tweet Tweet.
 * @return {Boolean} Returns true if given ID was found.
 */
function userid (id, tweet) {
  return tweet.user.id_str === id;
}

// Export module.
module.exports = userid;
