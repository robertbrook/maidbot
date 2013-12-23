// filters/random.js - Tweet filter based on a biased dice roll.
// This file is part of maidbot.
// Copyright (c) 2013 vomitcuddle <shinku@dollbooru.org>
// License: MIT

/**
 * Filters tweets based on random probability.
 * @param {Number} weight Probability that tweet will be randomly selected. (1-100)
 * @returns {Boolean} Returns true (1/weight)*100 percent of the time.
 */
function random (weight) {
  if (typeof weight !== 'number') {
    weight = 50;
  }
  return Math.ceil(Math.random()*100) < weight;
}

// Export module.
module.exports = random;
