// test/filters/matches.js - Tests the matches filter
// This file is part of maidbot
// Copyright (c) 2013 vomitcuddle <shinku@dollbooru.org>
// License: MIT
var matches = require('../../filters/matches');
var should = require('should');

describe('filters/matches.js', function () {
  it('finds exact matches', function () {
    matches('BEEP BEEP', {text: 'BEEP BEEP'}).should.be.true;
  });
  it('finds partial matches', function () {
    matches('BEEP BEEP', {text: '@MAID009 BEEP BEEP'}).should.be.true;
  });
  it('returns false when it finds no matches', function () {
    matches('HONK HONK', {text: '@MAID009 BEEP BEEP'}).should.be.false;
  });
});
