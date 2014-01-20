// test/core/maidbot.js - Tests for the Maidbot class.
// This file is part of maidbot.
// Copyright (c) 2014 vomitcuddle <shinku@dollbooru.org>
// License: MIT.
var mockery = require('mockery');
var mocktwit = require('mocktwit');
var should = require('should');
var Maidbot;

describe('core.maidbot', function () {
  var config;

  before(function () {
    // Inject mock twitter client library.
    mockery.enable();
    mockery.registerMock('twit', mocktwit);
    mockery.warnOnUnregistered(false);
    Maidbot = require('../../core/maidbot');
  });

  beforeEach(function () {
    // Reset sample config.
    config = {
      twitter_api: {
        consumer_key: "",
        consumer_secret: "",
        access_token: "",
        access_token_secret: ""
      },
      auto_follow_back: false,
      random_tweet_enable: false,
      random_tweet_interval: 0,
      filters_case_insensitive: false,
      tweets: [],
      ignored_users: []
    };
  });

  describe('bot', function () {
    it('follows users back when auto_follow_back is enabled', function (done) {
      config.auto_follow_back = true;
      var m = new Maidbot(config);
      mocktwit.setMockResponse({
        'id_str': '12345678',
        'screen_name': '@MAID009'
      });
      m.connect(function () {
        mocktwit.setRequestListener(function (method, path, params) {
          if (method === 'POST') {
            path.should.equal('https://api.twitter.com/1.1/friendships/create');
            params.should.eql({"user_id": "123456"});
            done();
          }
        });
        mocktwit.queueMockStreamEvent('follow', {
          'event': 'follow',
          'target': {
            'id_str': '12345678'
          },
          'source': {
            'id_str': '123456',
            'screen_name': 'MAID001'
          }
        });
      });
    });

    it('unfollows users back when auto_follow_back is enabled', function (done) {
      config.auto_follow_back = true;
      var m = new Maidbot(config);
      mocktwit.setMockResponse({
        'id_str': '12345678',
        'screen_name': '@MAID009'
      });
      m.connect(function () {
        mocktwit.setRequestListener(function (method, path, params) {
          if (method === 'POST') {
            path.should.equal('https://api.twitter.com/1.1/friendships/destroy');
            params.should.eql({"user_id": "123456"});
            done();
          }
        });
        mocktwit.queueMockStreamEvent('unfollow', {
          'event': 'unfollow',
          'target': {
            'id_str': '12345678'
          },
          'source': {
            'id_str': '123456',
            'screen_name': 'MAID001'
          }
        });
      });
    });

    it('responds to timeline events', function (done) {
      config.tweets.push({
        type: ['timeline'],
        body: 'BEEP BEEP',
        filters: {
          matches: 'beep beep'
        },
        weight: 1
      });
      var m = new Maidbot(config);
      mocktwit.setMockResponse({
        'id_str': '12345678',
        'screen_name': '@MAID009',
      });
      m.connect(function () {
        mocktwit.setRequestListener(function (method, path, params) {
          if (method === 'POST') {
            path.should.equal('https://api.twitter.com/1.1/statuses/update');
            params.should.eql({
              "status": "@MAID001 BEEP BEEP",
              "in_reply_to_status_id": "123"
            });
            done();
          }
        });
        mocktwit.queueMockStreamEvent('tweet', {
          user: {
            screen_name: 'MAID001'
          },
          text: 'beep beep',
          id_str: '123'
        });
      });
    });

    it('responds to reply events', function (done) {
      config.tweets.push({
        type: ['reply'],
        body: 'BEEP BEEP',
        filters: {},
        weight: 1
      });
      var m = new Maidbot(config);
      mocktwit.setMockResponse({
        'id_str': '12345678',
        'screen_name': '@MAID009',
      });
      m.connect(function () {
        mocktwit.setRequestListener(function (method, path, params) {
          if (method === 'POST') {
            path.should.equal('https://api.twitter.com/1.1/statuses/update');
            params.should.eql({
              "status": "@MAID001 BEEP BEEP",
              "in_reply_to_status_id": "123"
            });
            done();
          }
        });
        mocktwit.queueMockStreamEvent('tweet', {
          user: {
            screen_name: 'MAID001'
          },
          text: 'beep beep',
          in_reply_to_user_id_str: '12345678',
          id_str: '123'
        });
      });
    });
  });

  describe('getReplyToTweet', function () {
    it('ignores tweets from ignored_users', function () {
      config.ignored_users = ["148684820"];
      var m = new Maidbot(config);
      should(m.getReplyToTweet('reply', {'user': {'id_str': '148684820'}})).be.null;
    });

    it('matches response using filters', function () {
      config.tweets.push({
        type: ['reply'],
        filters: {'matches': 'aBc'},
        weight: 1
      });
      var m = new Maidbot(config);
      should(m.getReplyToTweet('reply', {user: {id_str: '123456'}, text: 'aaa'})).be.null;
      m.getReplyToTweet('reply', {user: {id_str: '123456'}, text: 'aBc'}).should.be.an.Object;
    });

    it('picks random response to reply when no tweets were matched using filters', function () {
      config.tweets.push({
        type: ['reply'],
        filters: {},
        weight: 1
      });
      var m = new Maidbot(config);
      m.getReplyToTweet('reply', {user: {id_str: '123456'}, text: 'aaa'}).should.be.an.Object;
      should(m.getReplyToTweet('timeline', {user: {id_str: '123456'}, text: 'aaa'})).be.null;
    });

    it('returns null when no tweet was found', function () {
      config.tweets.push({
        type: ['reply'],
        filters: {'matches': 'aBc'},
        weight: 1
      });
      var m = new Maidbot(config);
      should(m.getReplyToTweet('reply', {user: {id_str: '123456'}, text: 'aaa'})).be.null;
    });
  });

  afterEach(function () {
    mocktwit.cleanup();
  });

  after(function () {
    mockery.disable();
    mockery.deregisterAll();
  });

});
