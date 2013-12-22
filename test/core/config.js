// This file is part of maidbot.
// Copyright (c) 2013 vomitcuddle <shinku@dollbooru.org>
// License: MIT
var config = require('../../core/config.js');
var should = require('should');

/** Configuration loader tests. */
describe('Configuration loader', function () {
  it('returns an error if file does not exist', function (done) {
    config.load('test/mock/idontexist.json', function (error) {
      should.exist(error);
      error.message.should.equal('Configuration file does not exist');
      done();
    });
  });
  it('returns an error if file is not valid JSON', function (done) {
    config.load('test/mock/invalid.json', function (error) {
      should.exist(error);
      error.message.should.match(/^Error parsing configuration file:/);
      done();
    });
  });
  it('returns an error if file contains no JSON nodes', function (done) {
    config.load('test/mock/empty.json', function (error) {
      should.exist(error);
      error.message.should.equal('Error parsing configuration file:\nUnexpected end of input');
      done();
    });
  });
  it('returns configuration as parsed object', function (done) {
    config.load('test/mock/maidbot.json', function (error, config) {
      should.not.exist(error);
      config.should.be.an.instanceOf(Object);
      (function() {
        JSON.stringify(config);
      }).should.not.throw();
      done();
    });
  });
});
