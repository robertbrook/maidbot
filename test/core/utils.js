// This file is part of maidbot.
// Copyright (c) 2014 vomitcuddle <shinku@dollbooru.org>
// License: MIT.
var should = require('should');
var utils = require('../../core/utils');

describe('core.utils', function () {
  describe('isUserIgnored', function () {
    it('returns true if user id is in array', function () {
      utils.isUserIgnored('148684820', ['148684820']).should.be.true;
      utils.isUserIgnored('123456', ['148684820']).should.be.false;
    });
  });

  describe('filterAndGetTweet', function () {
    it('sets caseInsensitive to false by default', function () {
      should(utils.filterAndGetTweet({text: 'aaa'}, 'reply', [{
        type: ['reply'],
        filters: {'matches': 'aBc'},
        weight: 1
      }])).be.null;
      should(utils.filterAndGetTweet({text: 'aaa'}, 'reply', [{
        type: ['reply'],
        filters: {'matches': 'aaa'},
        weight: 1
      }])).be.an.Object;
    });

    it('matches tweets of correct type', function () {
      should(utils.filterAndGetTweet({text: 'aaa'}, 'reply', [{
        type: ['reply'],
        filters: {'matches': 'aaa'},
        weight: 1
      }])).be.null;
      should(utils.filterAndGetTweet({text: 'aaa'}, 'reply', [{
        type: ['timeline'],
        filters: {'matches': 'aaa'},
        weight: 1
      }])).equal(null);
    });

    it('ignores tweets with no filters', function () {
      should(utils.filterAndGetTweet({text: 'aaa'}, 'reply', [{
        type: ['reply'],
        filters: {'matches': 'aaa'},
        weight: 1
      }])).be.an.Object;
      should(utils.filterAndGetTweet({text: 'aaa'}, 'reply', [{
        type: ['reply'],
        filters: {},
        weight: 1
      }])).be.null;
    });

    it('applies filters to tweets', function () {
      should(utils.filterAndGetTweet({text: 'aaa'}, 'reply', [{
        type: ['reply'],
        filters: {'matches': 'aaa'},
        weight: 1
      }])).be.an.Object;
      should(utils.filterAndGetTweet({text: 'aaa'}, 'reply', [{
        type: ['reply'],
        filters: {'matches': 'aba'},
        weight: 1
      }])).be.null;
    });
    it('returns tweet with highest weight', function () {
      should(utils.filterAndGetTweet({text: 'aaa'}, 'reply', [
      {
        type: ['reply'],
        filters: {'matches': 'aaa'},
        weight: 1
      },
      {
        type: ['reply'],
        filters: {'matches': 'aaa'},
        weight: 2
      }
      ]).weight).equal(2);

    });
    it('returns null when no tweet is matched', function () {
      should(utils.filterAndGetTweet({text: 'aaa'}, 'reply', [{
        type: ['reply'],
        filters: {'matches': 'aba'},
        weight: 1
      }])).be.null;
    });

  });

  describe('getRandomReply', function () {
    it('sets reply as default type', function () {
      should(utils.getRandomReply([{
        type: ['reply'],
        weight: 1,
        filters: {}
      }])).be.an.Object;
      should(utils.getRandomReply([{
        type: ['timeline'],
        weight: 1,
        filters: {}
      }])).be.null;
    });
    it('matches tweets of correct type', function () {
      should(utils.getRandomReply([{
        type: ['timeline'],
        weight: 1,
        filters: {}
      }], 'timeline')).be.an.Object;
      should(utils.getRandomReply([{
        type: ['reply'],
        weight: 1,
        filters: {}
      }], 'timeline')).be.null;
    });
    it('matches only tweets with no filters', function () {
      should(utils.getRandomReply([{
        type: ['reply'],
        weight: 1,
        filters: {'matches': 'aaa'}
      }])).be.null;
      should(utils.getRandomReply([{
        type: ['timeline'],
        weight: 1,
        filters: {}
      }], 'timeline')).be.an.Object;
    });
    it('returns tweet with highest weight', function () {
      should(utils.getRandomReply([
      {
        type: ['reply'],
        filters: {},
        weight: 1
      },
      {
        type: ['reply'],
        filters: {},
        weight: 2
      }
      ]).weight).equal(2);
    });
    it('returns null when no tweet is found', function () {
      should(utils.getRandomReply([{
        type: ['reply'],
        weight: 1,
        filters: {'matches': 'aaa'}
      }])).be.null;
    });
  });
});
