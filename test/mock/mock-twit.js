// test/mock/mock-twit.js - Mock twitter API client library.
// This file is part of maidbot.
// Copyright (c) 2013 vomitcuddle <shinku@dollbooru.org>
// License: MIT
var mockstream = require('./mock-stream');

/**
 * Create a new instance of the mock class.
 * @param {Object} config Twitter API keys, ignored.
 */
function Twit (config) {
}

/**
 * Tests GET requests to the Twitter API
 * @param {String} path Resource path.
 * @param {Object} params Request parameters. (Optional)
 * @param {Function} callback Callback function.
 */
Twit.prototype.get = function (path, params, callback) {
  if (typeof params === 'function') {
    callback = params;
    params = {};
  }

  // Return mock response.
  if (path === 'account/verify_credentials') {
    callback(null, {
      'id_str': '38895958',
      'screen_name': 'maid009'
    });
  } else {
    callback(new Error('Not implemented.'));
  }
};

/**
 * Tests POST requests to the Twitter API.
 * @param {String} path Resource path.
 * @param {Object} params Request parameters.
 * @param {Function} callback Callback function.
 */
Twit.prototype.post = function (path, params, callback) {
  if (typeof params === 'function') {
    callback = params;
    params = {};
  }

  // Return mock response.
  if (path === 'statuses/update') {
    callback(null, {
      'text': params.status || null,
      'in_reply_to_status_id_str': params.in_reply_to_status_id_str || null
    });
  } else if (path === 'friendships/create') {
    callback(null, {
      'id_str': params.user_id || null
    });
  } else if (path === 'friendships/destroy') {
    callback(null, {
      'id_str': params.user_id || null
    });
  } else {
    callback(new Error('Not implemented'));
  }
};

/**
 * Tests Twitter streaming API.
 * @param {String} path Streaming endpoint.
 * @param {@Object} params Request parameters.
 */
Twit.prototype.stream = function (path, params) {
  return new mockstream(path, params);
};

// Export module.
module.exports = Twit;
