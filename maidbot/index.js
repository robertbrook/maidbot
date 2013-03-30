/**
 * This file is part of maidbot.
 * Copyright (c) 2013 vomitcuddle <shinku@dollbooru.org>
 * License: ISC
 */
var configLoader = require("./config/loader.js"),
    twitter = require("./twitter.js");

module.exports = (function () { 
  /** Private fields. */
  var mConfig, mTwitter;

  /** Private Methods */
  
  // Config loader.
  var loadConfig = function (configFile, callback) {
    configLoader(configFile, function (error, config) {
      if (error) {
        console.error(error.message);
        callback(error, null);
      } else {
        callback(null, config);
      }
    });
  };

  return {
    init: function (configFile) {
      // Load configuration.
      loadConfig(configFile, function (error, config) {
        if (error) {
          throw error;
        } else {
          mConfig = config;
          mTwitter = twitter(config);
        }
      });
    },

    testConfig: function (configFile, callback) {
      loadConfig(configFile, function (error, config) {
        if (error) {
          throw error;
        }
      });
    }
  };
    

}());

