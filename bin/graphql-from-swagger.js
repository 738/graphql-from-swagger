#!/usr/bin/env node
var app = require('../lib/index');
var pjson = require('../package.json');
var program = require('commander');

program
  .version(pjson.version)
  .parse(process.argv);

app.cli();
