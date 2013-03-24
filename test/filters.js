// This file is part of maidbot.
// Copyright (c) 2013 vomitcuddle <shinku@dollbooru.org>
// License: ISC
var assert = require('assert'),
    filters = require('../maidbot/filters.js');


describe("Filters", function () {
  var filterFactory, mockTweet;
  
  // Resets filter factory and mock tweet.
  beforeEach(function () {
    filterFactory = filters(true);
    mockTweet = {
      "text": "soMe text",
      "user": {
        "id": 12345678
      }
    };
  });

  describe("regexp", function () {
    it("case-sensitivity", function () {
      var filter;
      // Case sensitive.
      filter = filterFactory.regexp("^soMe text$");
      assert(filter(mockTweet), "should match example");
      filter = filterFactory.regexp("^some text$");
      assert(!filter(mockTweet), "should be case-sensitive");
      // Case insensitive.
      filterFactory = filters(false);
      filter = filterFactory.regexp("^some text$");
      assert(filter(mockTweet), "should be case-insensitive");
    });

    it("callback style", function(done) {
      var filter = filterFactory.regexp("^soMe text$");
      filter(mockTweet, function (shouldTweet, newTweet) {
        assert(shouldTweet);
        assert.deepEqual(newTweet, mockTweet, "shouldn't transform tweet objects in any way");
        done();
      });
    });

  });

  describe("matches", function () {
    it("case-sensitivity", function () {
      var filter;
      // Case sensitive.
      filter = filterFactory.matches("soMe text");
      assert(filter(mockTweet), "should match example");
      filter = filterFactory.matches("some text");
      assert(!filter(mockTweet), "should be case-sensitive");
      // Case insensitive.
      filterFactory = filters(false);
      filter = filterFactory.matches("some text");
      assert(filter(mockTweet), "should be case-insensitive");
    });

    it("callback style", function(done) {
      var filter = filterFactory.matches("soMe text");
      filter(mockTweet, function (shouldTweet, newTweet) {
        assert(shouldTweet);
        assert.deepEqual(newTweet, mockTweet, "shouldn't transform tweet objects in any way");
        done();
      });
    });

  });

  describe("random", function () {
    // This is really bad, but what other way is there to test this?
    it("100 always matches", function () {
      var filter = filterFactory.random(100);
      assert(filter(mockTweet), "should always match");
    });

    it("0 never matches", function () {
      var filter = filterFactory.random(0);
      assert(!filter(mockTweet), "should never match");
    });

    it("callback style", function(done) {
      var filter = filterFactory.random(50);
      filter(mockTweet, function (shouldTweet, newTweet) {
        assert.deepEqual(newTweet, mockTweet, "shouldn't transform tweet objects in any way");
        done();
      });
    });

  });

  describe("userid", function () {
    it("matches userids", function () {
      var filter;
      filter = filterFactory.userid(12345678);
      assert(filter(mockTweet), "should match example");
      filter = filterFactory.userid(123456);
      assert(!filter(mockTweet), "shouldn't match example");
    });

    it("callback style", function(done) {
      var filter = filterFactory.userid(12345678);
      filter(mockTweet, function (shouldTweet, newTweet) {
        assert(shouldTweet);
        assert.deepEqual(newTweet, mockTweet, "shouldn't transform tweet objects in any way");
        done();
      });
    });

  });
});
