// test/filters/userid.js - Tests the userid filter.
// This file is part of maidbot.
// Copyright (c) 2013 vomitcuddle <shinku@dollbooru.org>
// License: MIT
var should = require('should');
var userid = require('../../filters/userid');

describe('filters/userid.js', function () {
  it('matches userids correctly', function () {
    userid('123456', {user: {id_str: '123456'}}).should.be.true;
    userid('123456', {user: {id_str: '12345678'}}).should.be.false;
  });
});
