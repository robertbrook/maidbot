/**
 * This file is part of maidbot.
 * Copyright (c) 2013 vomitcuddle <shinku@dollbooru.org>
 * License: ISC
 */

// Dependencies.
var configLoader = require('./config/loader.js');

module.exports = function (options) {
  var configFile = options._[0];
  // Load configuration.
  configLoader(configFile, function (error, config) {
    if (error) {
      // Print error to console.
      console.error(error.message);
      process.exit(1);
    } else if (options['config-check']) {
      console.log("Configuration syntax is correct.");
      process.exit(0);
    } else {
      // Continue.
    }
  });
};
