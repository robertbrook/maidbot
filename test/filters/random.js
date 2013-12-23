// test/filters/random.js - random filter tests.
// This file is part of maidbot.
// Copyright (c) 2013 vomitcuddle <shinku@dollbooru.org>
// License: MIT
var random = require('../../filters/random');
var should = require('should');

describe('filters/random.js', function () {
  it('returns a boolean value', function () {
    random(30).should.be.a.boolean;
  });

  it('defaults to weight = 50', function () {
    random().should.be.a.boolean;
  });
});

