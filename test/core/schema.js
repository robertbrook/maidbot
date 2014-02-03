// This file is part of maidbot.
// Copyright (c) 2013 vomitcuddle <shinku@dollbooru.org>
// License: MIT

var assert = require('assert'),
    jsonschema = require('json-schema'),
    schema = require('../../core/schema.js');

describe("config JSON schema", function () {
  var config;

  beforeEach(function () {
    // Reset config.
    config = {
      "twitter_api": {
        "consumer_key": "",
        "consumer_secret": "",
        "access_token": "",
        "access_token_secret": ""
      },
      "tweets": [
        { "body": "BEEP BEEP",
          "type": ["random"]
        }
      ]
    };
  });

  it("validates as JSON schema draft 4", function () {
    assert(jsonschema.validate(schema).valid, "validation failed");
  });

  it("validates example config", function () {
    assert(jsonschema.validate(config, schema).valid, "validation failed");
  });

  describe("sets default", function () {
    it("auto_follow_back", function () {
      var validation = jsonschema.validate(config, schema);
      assert.strictEqual(config.auto_follow_back, true);
    });

    it("auto_reconnect", function () {
      var validation = jsonschema.validate(config, schema);
      assert.strictEqual(config.auto_reconnect, false);
    });

    it("random_tweet_enable", function () {
      var validation = jsonschema.validate(config, schema);
      assert.strictEqual(config.random_tweet_enable, true);
    });

    it("random_tweet_interval", function () {
      var validation = jsonschema.validate(config, schema);
      assert.strictEqual(config.random_tweet_interval, 60);
    });

    it("filters_case_insensitive", function () {
      var validation = jsonschema.validate(config, schema);
      assert.strictEqual(config.filters_case_insensitive, true);
    });

    it("ignored_users", function () {
      var validation = jsonschema.validate(config, schema);
      assert.deepEqual(config.ignored_users, []);
    });

    it("tweets.items.properties", function () {
      var validation = jsonschema.validate(config, schema);
      assert.deepEqual(config.tweets[0].filters, {}, ".filters should default to an empty object");
      assert.strictEqual(config.tweets[0].weight, 1, ".weight should default to 1");
    });
  });

  describe("requires", function () {
    it("twitter_api", function () {
      var validation;
      // Setup
      delete config.twitter_api;
      // Validation
      validation = jsonschema.validate(config, schema);
      // Asserts
      assert(validation.valid === false, "should not validate");
      assert.strictEqual(validation.errors.length, 1, "unexpected errors");
      assert.deepEqual(validation.errors, [
        { "property": "twitter_api",
          "message": "is missing and it is required" }
       ]);
    });

    it("twitter_api.properties", function () {
      var validation;
      // Setup
      delete config.twitter_api.consumer_key;
      delete config.twitter_api.consumer_secret;
      delete config.twitter_api.access_token;
      delete config.twitter_api.access_token_secret;
      // Validation
      validation = jsonschema.validate(config, schema);
      // Asserts
      assert(!validation.valid, "should not validate");
      assert.strictEqual(validation.errors.length, 4, "unexpected errors");
      assert.deepEqual(validation.errors, [
        { "property": "twitter_api.consumer_key",
          "message": "is missing and it is required" },
        { "property": "twitter_api.consumer_secret",
          "message": "is missing and it is required" },
        { "property": "twitter_api.access_token",
          "message": "is missing and it is required" },
        { "property": "twitter_api.access_token_secret",
          "message": "is missing and it is required" }
      ]);
    });

    it("tweets", function () {
      var validation;
      // Setup.
      delete config.tweets;
      // Validation.
      validation = jsonschema.validate(config, schema);
      // Asserts.
      assert(!validation.valid, "should not validate");
      assert.strictEqual(validation.errors.length, 1, "unexpected errors");
      assert.deepEqual(validation.errors, [
        { "property": "tweets",
          "message": "is missing and it is required" }
      ]);
    });

    it("at least one tweet", function () {
      var validation;
      // Setup.
      config.tweets.pop();
      // Validation.
      validation = jsonschema.validate(config, schema);
      // Asserts.
      assert(!validation.valid, "should not validate");
      assert.strictEqual(validation.errors.length, 1, "unexpected errors");
      assert.deepEqual(validation.errors, [
        { "property": "tweets",
          "message": "There must be a minimum of 1 in the array" }
      ]);
    });

    it("at least one tweets.items.properties.type", function () {
      var validation;
      // Setup.
      config.tweets[0].type = [];
      // Validation.
      validation = jsonschema.validate(config, schema);
      // Asserts.
      assert(!validation.valid, "should not validate");
      assert.deepEqual(validation.errors, [
        { "property": "tweets[0].type",
          "message": "There must be a minimum of 1 in the array" }
        ]);
    });

    it("tweets.items.properties", function () {
      var validation;
      // Setup.
      delete config.tweets[0].body;
      delete config.tweets[0].type;
      // Validation.
      validation = jsonschema.validate(config, schema);
      // Asserts.
      assert(!validation.valid, "should not validate");
      assert.strictEqual(validation.errors.length, 2, "unexpected errors");
      assert.deepEqual(validation.errors, [
        { "property": "tweets[0].body",
          "message": "is missing and it is required" },
        { "property": "tweets[0].type",
          "message": "is missing and it is required" }
      ]);
    });
  });

  describe("checks types of", function () {
    it("auto_follow_back", function () {
      var validation;
      // Setup.
      config.auto_follow_back = 1;
      // Validation.
      validation = jsonschema.validate(config, schema);
      // Asserts.
      assert(!validation.valid, "should not validate");
      assert.strictEqual(validation.errors.length, 1, "unexpected errors");
      assert.deepEqual(validation.errors, [
        { "property": "auto_follow_back",
          "message": "number value found, but a boolean is required" }
      ]);
    });

    it("auto_follow_back", function () {
      var validation;
      // Setup.
      config.auto_reconnect = 1;
      // Validation.
      validation = jsonschema.validate(config, schema);
      // Asserts.
      assert(!validation.valid, "should not validate");
      assert.strictEqual(validation.errors.length, 1, "unexpected errors");
      assert.deepEqual(validation.errors, [
        { "property": "auto_reconnect",
          "message": "number value found, but a boolean is required" }
      ]);
    });

    it("random_tweet_enable", function () {
      var validation;
      // Setup.
      config.random_tweet_enable = 1;
      // Validation.
      validation = jsonschema.validate(config, schema);
      // Asserts.
      assert(!validation.valid, "should not validate");
      assert.strictEqual(validation.errors.length, 1, "unexpected errors");
      assert.deepEqual(validation.errors, [
        { "property": "random_tweet_enable",
          "message": "number value found, but a boolean is required" }
      ]);
    });

    it("random_tweet_interval", function () {
      var validation;
      // Setup.
      config.random_tweet_interval = 50.1;
      // Validation.
      validation = jsonschema.validate(config, schema);
      // Asserts.
      assert(!validation.valid, "should not validate");
      assert.strictEqual(validation.errors.length, 1, "unexpected errors");
      assert.deepEqual(validation.errors, [
        { "property": "random_tweet_interval",
          "message": "number value found, but a integer is required" }
      ]);
    });

    it("filters_case_insensitive", function () {
      var validation;
      // Setup.
      config.filters_case_insensitive = 1;
      // Validation.
      validation = jsonschema.validate(config, schema);
      // Asserts.
      assert(!validation.valid, "should not validate");
      assert.strictEqual(validation.errors.length, 1, "unexpected errors");
      assert.deepEqual(validation.errors, [
        { "property": "filters_case_insensitive",
          "message": "number value found, but a boolean is required" }
      ]);
    });

    it("ignored_users", function () {
      var validation;
      // Setup.
      config.ignored_users = 1;
      // Validation.
      validation = jsonschema.validate(config, schema);
      // Asserts.
      assert(!validation.valid, "should not validate");
      assert.strictEqual(validation.errors.length, 1, "unexpected errors");
      assert.deepEqual(validation.errors, [
        { "property": "ignored_users",
          "message": "number value found, but a array is required" }
      ]);
    });

    it("twitter_api.properties", function () {
      var validation;
      // Setup.
      config.twitter_api.consumer_key = true;
      config.twitter_api.consumer_secret = 11;
      config.twitter_api.access_token = 32.2;
      config.twitter_api.access_token_secret = [];
      // Validation.
      validation = jsonschema.validate(config, schema);
      // Asserts.
      assert(!validation.valid, "should not validate");
      assert.strictEqual(validation.errors.length, 4, "unexpected errors");
      assert.deepEqual(validation.errors, [
        { "property": "twitter_api.consumer_key",
          "message": "boolean value found, but a string is required" },
        { "property": "twitter_api.consumer_secret",
          "message": "number value found, but a string is required" },
        { "property": "twitter_api.access_token",
          "message": "number value found, but a string is required" },
        { "property": "twitter_api.access_token_secret",
          "message": "object value found, but a string is required" }
        ]);
    });

    it("tweets.items.properties", function () {
      var validation;
      // Setup.
      config.tweets[0].body = true;
      config.tweets[0].type = 'random';
      config.tweets[0].filters = 500;
      config.tweets[0].weight = 2.32;
      // Validation.
      validation = jsonschema.validate(config, schema);
      // Asserts.
      assert(!validation.valid, "should not validate");
      assert.strictEqual(validation.errors.length, 5, "unexpected errors");
      assert.deepEqual(validation.errors, [
        { "property": "tweets[0].body",
          "message": "boolean value found, but a string is required" },
        { "property": "tweets[0].type",
          "message": "string value found, but a array is required" },
        { "property": "tweets[0].filters",
          "message": "number value found, but a object is required" },
        { "property": "tweets[0].filters",
          "message": "an object is required" },
        { "property": "tweets[0].weight",
          "message": "number value found, but a integer is required" }]
        );
    });

    it("tweets.items.filters.properties", function () {
      var validation;
      // Setup.
      config.tweets[0].filters = {
        "regexp": 23,
        "matches": [],
        "random": 32.3,
        "userid": 123241255
      };
      // Validation.
      validation = jsonschema.validate(config, schema);
      // Asserts.
      assert(!validation.valid, "should not validate");
      assert.strictEqual(validation.errors.length, 4, "unexpected errors");
      assert.deepEqual(validation.errors, [
        { "property": "tweets[0].filters.regexp",
          "message": "number value found, but a string is required" },
        { "property": "tweets[0].filters.matches",
          "message": "object value found, but a string is required" },
        { "property": "tweets[0].filters.random",
          "message": "number value found, but a integer is required" },
        { "property": "tweets[0].filters.userid",
          "message": "number value found, but a string is required" }
      ]);
    });
  });

  describe("validates values of", function () {
    it("random_tweet_interval", function () {
      var validation;
      // Setup.
      config.random_tweet_interval = 4;
      // Validation.
      validation = jsonschema.validate(config, schema);
      // Asserts.
      assert(!validation.valid, "should not validate");
      assert.strictEqual(validation.errors.length, 1, "unexpected errors");
      assert.deepEqual(validation.errors, [
        { "property": "random_tweet_interval",
          "message": "must have a minimum value of 5"
        }
      ]);
    });

    it("ignored_users.items", function () {
      var validation;
      // Setup.
      config.ignored_users = ["sfdf213ascv#@@!"];
      // Validation.
      validation = jsonschema.validate(config, schema);
      // Asserts.
      assert(!validation.valid, "should not validate");
      assert.strictEqual(validation.errors.length, 1, "unexpected errors");
      assert.deepEqual(validation.errors, [
        { "property": "ignored_users[0]",
          "message": "does not match the regex pattern ^[0-9]+$"
        }
      ]);
    });

    it("tweet.filters.userid", function () {
      var validation;
      // Setup.
      config.tweets[0].filters = {
        userid: "sfdf213ascv#@@!"
      };
      // Validation.
      validation = jsonschema.validate(config, schema);
      // Asserts.
      assert(!validation.valid, "should not validate");
      assert.strictEqual(validation.errors.length, 1, "unexpected errors");
      assert.deepEqual(validation.errors, [
        { "property": "tweets[0].filters.userid",
          "message": "does not match the regex pattern ^[0-9]+$"
        }
      ]);
    });

    it("tweets.items.weight", function () {
      var validation;
      // Setup.
      config.tweets[0].weight = -1;
      // Validation.
      validation = jsonschema.validate(config, schema);
      // Asserts.
      assert(!validation.valid, "should not validate");
      assert.strictEqual(validation.errors.length, 1, "unexpected errors");
      assert.deepEqual(validation.errors, [
        { "property": "tweets[0].weight",
          "message": "must have a minimum value of 1"
        }
      ]);
    });

  });
});
