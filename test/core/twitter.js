// test/core/twitter.js - Tests for the Twitter class.
// This file is part of maidbot.
// Copyright (c) 2013 vomitcuddle <shinku@dollbooru.org>
// License: MIT
var mockery = require('mockery');
var mocktwit = require('../mock/mock-twit');
var should = require('should');
var twitter;

describe('twitter.Twitter', function () {
  var t;

  before(function () {
    // Inject mock twitter client library.
    mockery.enable();
    mockery.registerMock('twit', mocktwit);
    mockery.registerAllowables(['../../core/twitter', 'events', 'util']);
    twitter = require('../../core/twitter');
  });

  beforeEach(function () {
    // Create a new twitter object.
    t = new twitter.Twitter({twitter_api: {}});
  });

  it('calls the api to set user credentials', function (done) {
    t.verifyCredentials(function (error, reply) {
      should.not.exist(error);
      t.id.should.equal('38895958');
      t.screen_name.should.equal('maid009');
      done();
    });
  });

  it('calls the api to post a new tweet', function (done) {
    t.tweet('hello', function (error, res) {
      should.not.exist(error);
      res.text.should.equal('hello');
      done();
    });
  });

  it('calls the api to follow users', function (done) {
    t.follow("123456", function (error, res) {
      should.not.exist(error);
      res.id_str.should.equal("123456");
      done();
    });

  });

  it('calls the api to unfollow users', function (done) {
    t.unfollow("123456", function (error, res) {
      should.not.exist(error);
      res.id_str.should.equal("123456");
      done();
    });
  });

  it('prepends @mention to replies', function (done) {
    t.reply({
      id_str: "123456",
      user: {
        screen_name: "MAID001"
      }
    }, "BEEP BEEP", function (error, res) {
      should.not.exist(error);
      res.text.should.equal("@MAID001 BEEP BEEP");
      res.in_reply_to_status_id_str.should.equal("123456");
      done();
    });
  });

  it('emits user stream events of right type', function (done) {
    var types = ['follow', 'unfollow', 'timeline', 'reply'];
    var isDone = function () {
      if (types.length === 0) {
        done();
      }
    };
    // Start stream and wait for each event.
    t.connect();
    t.on('follow', function () {
      types.splice(types.indexOf('follow'), 1);
      isDone();
    });
    t.on('unfollow', function () {
      types.splice(types.indexOf('unfollow'), 1);
      isDone();
    });
    t.on('timeline', function () {
      types.splice(types.indexOf('timeline'), 1);
      isDone();
    });
    t.on('reply', function () {
      types.splice(types.indexOf('reply'), 1);
      isDone();
    });
  });

  after(function () {
    // Disable mocks.
    mockery.disable();
  });
});
