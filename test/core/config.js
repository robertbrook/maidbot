// This file is part of maidbot.
// Copyright (c) 2013 vomitcuddle <shinku@dollbooru.org>
// License: MIT
var assert = require('assert');
var config = require('../../core/config.js');

/** Configuration loader tests. */
describe('Configuration loader', function () {
  it('returns an error if file does not exist', function (done) {
    config.load('test/mock/idontexist.json', function (error) {
      assert(error);
      assert.deepEqual(error.message, 'Configuration file does not exist');
      done();
    });
  });
  it('returns an error if file is not valid JSON', function (done) {
    config.load('test/mock/invalid.json', function (error) {
      assert(error);
      assert(error.message.match(/^Error parsing configuration file:/));
      done();
    });
  });
  it('returns an error if file contains no JSON nodes', function (done) {
    config.load('test/mock/empty.json', function (error) {
      assert(error);
      assert.deepEqual(error.message, 'Error parsing configuration file:\nUnexpected end of input');
      done();
    });
  });
  it('returns configuration as parsed object', function (done) {
    config.load('test/mock/maidbot.json', function (error, config) {
      assert.equal(error, null);
      assert.deepEqual(typeof config, 'object');
      JSON.stringify(config);
      done();
    });
  });
});
