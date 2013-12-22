// test/mock/mock-stream.js - Mock for testing twitter API streams.
// This file is part of maidbot.
// Copyright (c) 2013 vomitcuddle <shinku@dollbooru.org>
// License: MIT
var EventEmitter = require('event').EventEmitter;
var util = require('util');

/**
 * Create a new mock stream.
 * @param {String} path Streaming endpoint.
 * @param {Object} params Request parameters
 */
function MockStream (path, params) {
  EventEmitter.call(this);
  this.stream(path, params);
}
// Inherit from EventEmitter.
util.inherits(MockStream, EventEmitter);

/**
 * Sends mock events on the next process tick.
 * @param {String} path Streaming endpoint.
 * @param {Object} params Request parameters.
 */
MockStream.prototype.stream = function (path, params) {
  var self = this;

  // Emit events on next event loop tick.
  process.nextTick(function () {
    self.emit('follow', {
      'event': 'follow'
    });
    self.emit('unfollow', {
      'event': 'unfollow'
    });
    self.emit('tweet', {
      'in_reply_to_user_id_str': '38895958',
      'text': '@maid009 hi'
    });
    self.emit('tweet', {
      'text': 'abc123'
    });
  });
};

// Export module.
module.exports = MockStream;
