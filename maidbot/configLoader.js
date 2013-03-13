/**
 * This file is part of maidbot.
 * Copyright (c) 2013 vomitcuddle <shinku@dollbooru.org>
 * License: ISC
 */

// Dependencies.
var fs = require('fs');

// Loads configuration and parses it asynchronously.
var configLoader = function (path, callback) {
  // Check if file exists.
  fs.exists(path, function (exists) {
    // Error if file does not exist.
    if (!exists) {
      callback(new Error("Configuration file does not exists."));
    } else {
      fs.readFile(path, function (error, data) {
        if (error) {
          callback(new Error("Could not read configuration file."));
        } else {
          try {
            callback(null, JSON.parse(data));
          } catch (err) {
            callback(new Error("Error parsing configuration file: " + err.message));
          }
        }
      });
    }
  });
};

// Export configuration loader.
module.exports = configLoader;
