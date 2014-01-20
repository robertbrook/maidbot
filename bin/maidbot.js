#!/usr/bin/env node
// This file is part of maidbot.
// Copyright (c) 2014 vomitcuddle <shinku@dollbooru.org>
// License: MIT.
var chalk = require('chalk');
var Maidbot = require('../core/maidbot');
var loadConfig = require('../core/config').load;
var version = require('../package.json').version;

// Parse command line options.
var argv = require('optimist')
  .usage('maidbot ' + version + "\nI'm here to serve you...\n\nUsage: $0 config-file.json")
  .boolean('t')
  .describe('t', 'Validate config file then quit immediately')
  .boolean('v')
  .describe('v', 'Enable verbose logging')
  .demand(1).argv;

console.log(chalk.cyan("maidbot " + version));

// Load and parse configuration.
loadConfig(argv._[0], function (error, config) {
  if (error) {
    throw error;
  } else if (!argv.t) {
    // Start bot.
    var bot = new Maidbot(config, argv.v);
    bot.connect();
  }
});
