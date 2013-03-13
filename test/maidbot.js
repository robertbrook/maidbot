/*
 * This file is part of maidbot.
 * Copyright (c) 2013 vomitcuddle <shinku@dollbooru.org>
 * License: ISC.
 */

var assert = require('assert');
var child_process = require('child_process');

describe('maidbot', function () {
    it('should output parsed JSON and quit in --config-check mode', function (done) {
      child_process.exec('./bin/maidbot --config-check test/config/valid.json', function (error, stdout, stderr) {
        assert(error === null);
        assert(stdout.toString().split('\n', 2)[1] === "{ 'this is': 'valid json' }");
        done();
      });
    });
});
