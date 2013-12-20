// This file is part of maidbot.
// Copyright (c) 2013 vomitcuddle <shinku@dollbooru.org>
// License: MIT
var jsonschema = require('json-schema');
var schema = require('./schema.js');

/**
 * Parses configuration from JSON into an object and verifies it against schema.
 * @param {String} data JSON string.
 * @param {Function} Callback function.
 */
var parseConfig = function (data, callback) {
  var validation;
  try {
    data = JSON.parse(data);
    validation = jsonSchema.validate(data, schema);
    if (!validation.valid)
      throw new Error(validation.errors.join('\n'));
    callback(null, data);
  } catch (err) {
    callback(new Error("Error parsing configuration file:\n" + err.message));
  }
};

/**
 * Loads configuration, verifies it against a JSON schema and returns it.
 * @param {String} path Path to configuration file.
 * @param {Function} callback Callback function. (error, data)
 */
exports.load = function (path, callback) {
  fs.exists(path, function checkConfigExists (exists) {
    if (!exists) {
      callback(new Error("Configuration file does not exist"));
    } else {
      fs.readFile(path, function readConfigFile (error, data) {
        if (error) {
          callback(new Error("Could not read configuration file."));
        } else {
          parseConfig(data, callback);
        }
      });
    }
  });
};
