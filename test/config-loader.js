/*
 * This file is part of maidbot.
 * Copyright (c) 2013 vomitcuddle <shinku@dollbooru.org>
 * License: ISC
 */

var assert = require('assert'),
    configLoader = require('../maidbot/config/loader.js');

describe('configLoader.js', function () {
  it('returns an error when file does not exist', function (done) { 
    configLoader('test/config/idontexist.json', function (error) {
      assert(error !== null);
      assert(error.message === 'Configuration file does not exists.');
      done();
    });
  });
  it('returns an error when file is not valid JSON', function (done) {
    configLoader('test/config/invalid.json', function (error) {
      assert(error !== null);
      assert(error.message.match(/^Error parsing configuration file:/));
      done();
    });
  });
  it('returns an error when file does not contain any JSON nodes', function (done) {
    configLoader('test/config/empty.json', function (error) {
      assert(error !== null);
      assert(error.message === "Error parsing configuration file: Unexpected end of input");
      done();
    });
  });
  it('returns configuration as a parsed object', function (done) {
    configLoader('example/maidbot.json', function (error, config) {
      assert(error === null);
      assert(typeof config === 'object');
      JSON.stringify(config);
      done();
    });
  });
});
