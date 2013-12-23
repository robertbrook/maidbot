// test/filters/regexp.js - Tests the regex filter.
// This file is part of maidbot.
// Copyright (c) 2013 vomitcuddle <shinku@dollbooru.org>
// License: MIT
var regexp = require('../../filters/regexp');
var should = require('should');

describe('filters/regexp.js', function () {
  it('tests regexp "\\8"', function () {
    regexp("\\8", {text: '\\8'}).should.be.true;
  });
  it('tests regexp "^[\\c_]$"', function () {
     regexp("^[\\c_]$", {text: 'c'}).should.be.false;
  });
  it('optionally takes a RegExp as first argument', function () {
    regexp(/^[\c]]$/, {text: 'c]'}).should.be.true;
  });
});

