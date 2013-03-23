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

      return function (tweet) {
        var matches = mPattern.exec(tweet.text);
        if (matches) {
          return true;
        } else {
          return false;
        }
      };
    },
    
    // Returns true if tweet contains a substring.
    matches: function (substring) {
      return function (tweet) {
        var match;
        
        // Case sensitivity.
        if (caseSensitive) {
          match = tweet.text.search(substring);
        } else {
          match = tweet.text.toLowerCase().search(substring.toLowerCase());
        }

        if (match !== -1) {
          return true;
        } else {
          return false;
        }
      };
    },
    
    // Returns a value based on a biased dice roll.
    random: function (weight) {
      return function () {
        var random = Math.ceil(Math.random()*100);

        if (weight > random) {
          return true;
        } else {
          return false;
        }
      };
    },
    
    // Return true if the person who made the tweet matches a given userid.
    userid: function (userid) {
      return function (tweet) {
        if (tweet.user.id === userid) {
          return true;
        } else {
          return false;
        }
      };
    }
  };
};
