// test/core/twitter.js - Tests for the Twitter class.
// This file is part of maidbot.
// Copyright (c) 2013 vomitcuddle <shinku@dollbooru.org>
// License: MIT
var mockery = require('mockery');
var mocktwit = require('mocktwit');
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
    mocktwit.setMockResponse({
      id_str: '38895958',
      screen_name: 'maid009'
    });
    t.verifyCredentials(function (error, reply) {
      should.not.exist(error);
      t.id.should.equal('38895958');
      t.screen_name.should.equal('maid009');
      done();
    });
  });

  it('calls the api to post a new tweet', function (done) {
    mocktwit.setRequestListener(function (method, path, params) {
      method.should.equal('POST');
      path.should.equal('https://api.twitter.com/1.1/statuses/update');
      params.should.eql({status: 'hello'});
      done();
    });
    t.tweet('hello');
  });

  it('calls the api to follow users', function (done) {
    mocktwit.setRequestListener(function (method, path, params) {
      method.should.equal('POST');
      path.should.equal('https://api.twitter.com/1.1/friendships/create');
      params.should.eql({"user_id": "123456"});
      done();
    });
    t.follow("123456");
  });

  it('calls the api to unfollow users', function (done) {
    mocktwit.setRequestListener(function (method, path, params) {
      method.should.equal('POST');
      path.should.equal('https://api.twitter.com/1.1/friendships/destroy');
      params.should.eql({"user_id": "123456"});
      done();
    });
    t.unfollow("123456");
  });

  it('prepends @mention to replies', function (done) {
    mocktwit.setRequestListener(function (method, path, params) {
      method.should.equal('POST');
      path.should.equal('https://api.twitter.com/1.1/statuses/update');
      params.should.eql({
        "in_reply_to_status_id": "123456",
        "status": "@MAID001 @maid008 BEEP BEEP",
      });
      done();
    });
    t.screen_name = 'maid009';
    t.reply({
      id_str: "123456",
      user: {screen_name: "MAID001"},
      entities: {
        user_mentions: [
          {"screen_name": "maid009"},
          {"screen_name": "maid008"}
      ]}
    }, 'BEEP BEEP');
  });

  it('retweets', function (done) {
    mocktwit.setRequestListener(function (method, path, params) {
      method.should.equal('POST');
      path.should.equal('https://api.twitter.com/1.1/statuses/retweet/123456');
      done();
    });
    t.retweet({id_str: "123456"});
  });

  it('emits user stream events of right type', function (done) {
    // Set fake credentials.
    mocktwit.setMockResponse({
      id_str: '38895958',
      screen_name: 'maid009'
    });
    // Create stream.
    t.connect(function () {
      // Queue mock events.
      mocktwit.queueMockStreamEvent('follow', {
        'event': 'follow',
        'target': {
          'id_str': '38895958'
        },
        'source': {
          'id_str': '123456'
        }
      });
      mocktwit.queueMockStreamEvent('unfollow', {
        'event': 'unfollow',
        'target': {
          'id_str': '38895958'
        },
        'source': {
          'id_str': '123456'
        }
      });
      mocktwit.queueMockStreamEvent('tweet', {
        'in_reply_to_user_id_str': '38895958',
        'text': '@maid009 hi',
        'user': {
          'id_str': '123456'
        }
      });
      mocktwit.queueMockStreamEvent('tweet', {
        'user': {
          'id_str': '123456'
        },
        'text': 'abc123'
      });
      mocktwit.queueMockStreamEvent('garbage', {
        'abc': '123'
      });
    });

    // Wait for each event type.
    var types = ['follow', 'unfollow', 'timeline', 'reply'];
    var isDone = function () {
      if (types.length === 0) {
        done();
      }
    };
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

  afterEach(function () {
    mocktwit.cleanup();
  });

  after(function () {
    // Disable mocks.
    mockery.disable();
    mockery.deregisterAll();
  });
});
