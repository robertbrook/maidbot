/*
 * This file is part of maidbot.
 * Copyright (c) 2013 vomitcuddle <shinku@dollbooru.org>
 * License: ISC.
 */

var assert = require('assert');
var child_process = require('child_process');

describe('maidbot', function () {
    it('should check config syntax and quit in --config-check mode', function (done) {
      this.slow(250);
      child_process.exec('./bin/maidbot --config-check example/maidbot.json', function (error, stdout, stderr) {
        assert(error === null);
        child_process.exec('./bin/maidbot --config-check test/config/valid.json', function (error, stdout, stderr) {
          assert(error !== null);
          done();
        });
      });
    });
});
