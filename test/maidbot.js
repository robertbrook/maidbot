/*
 * This file is part of maidbot.
 * Copyright (c) 2013 vomitcuddle <shinku@dollbooru.org>
 * License: ISC.
 */

var assert = require('assert');
var child_process = require('child_process');

describe('maidbot', function () {
  describe('configuration loader', function () {
    it('should return an error when file does not exist', function (done) {
      child_process.exec('./bin/maidbot iprobablydontexistaassdabadbikdaola.json', function (error, stdout, stderr) {
        assert(error !== null);
        assert(error.code === 1);
        assert(stderr.toString() === 'Configuration file does not exist.\n');
        done();
      });
    });
    it('should return an error when file is not valid json', function (done) {
      child_process.exec('./bin/maidbot test/config/invalid.json', function (error, stdout, stderr) {
        assert(error !== null);
        assert(error.code === 1);
        assert(stderr.toString() === 'Error reading configuration file.\n');
        done();
      });
    });
    it('should output parsed JSON and quit in --config-check mode', function (done) {
      child_process.exec('./bin/maidbot --config-check test/config/valid.json', function (error, stdout, stderr) {
        assert(error === null);
        assert(stdout.toString() === "{ 'this is': 'valid json' }\n");
        done();
      });
    });
  });
});
