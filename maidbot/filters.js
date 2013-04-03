// This file is part of maidbot.
// Copyright (c) 2013 vomitcuddle <shinku@dollbooru.org>
// License: ISC

// Filter factory.
module.exports = function (caseSensitive) {
  return {
    // Return true if tweet matches a regular expression.
    regexp: function (pattern) {
      var mPattern;

      // Case sensitive.
      if (caseSensitive) {
        mPattern = new RegExp(pattern);
      } else {
        mPattern = new RegExp(pattern, "i");
      }

      return function (tweet, callback) {
        var matches = mPattern.exec(tweet.text);
        if (matches) {
          if (callback) {
            callback(true, tweet);
          }
          return true;
        } else {
          if (callback) {
            callback(false, tweet);
          }
          return false;
        }
      };
    },
    
    // Returns true if tweet contains a substring.
    matches: function (substring) {
      return function (tweet, callback) {
        var match;
        
        // Case sensitivity.
        if (caseSensitive) {
          match = tweet.text.search(substring);
        } else {
          match = tweet.text.toLowerCase().search(substring.toLowerCase());
        }

        if (match !== -1) {
          if (callback) {
            callback(true, tweet);
          }
          return true;
        } else {
          if (callback) {
            callback(false, tweet);
          }
          return false;
        }
      };
    },
    
    // Returns a value based on a biased dice roll.
    random: function (weight) {
      return function (tweet, callback) {
        var random = Math.ceil(Math.random()*100);

        if (weight > random) {
          if (callback) {
            callback(true, tweet);
          }
          return true;
        } else {
          if (callback) {
            callback(false, tweet);
          }
          return false;
        }
      };
    },
    
    // Return true if the person who made the tweet matches a given userid.
    userid: function (userid) {
      return function (tweet, callback) {
        if (tweet.user.id_str === userid) {
          if (callback) {
            callback(true, tweet);
          }
          return true;
        } else {
          if (callback) {
            callback(false, tweet);
          }
          return false;
        }
      };
    }
  };
};
