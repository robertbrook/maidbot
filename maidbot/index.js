/**
 * This file is part of maidbot.
 * Copyright (c) 2013 vomitcuddle <shinku@dollbooru.org>
 * License: ISC
 */

// Dependencies.
var configLoader = require('./configLoader.js');

module.exports = function (options) {
  var configFile = options._[0];
  // Load configuration.
  configLoader(configFile, function (error, config) {
    if (error) {
      // Print error to console.
      console.error(error.message);
    } else if (options['config-check']) {
      // Print parsed JSON to console.
      console.log(config);
    } else {
      // Continue.
    }
  });
};
