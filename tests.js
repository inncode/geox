#!/usr/bin/env node
const chalk       = require('chalk'),
    clear       = require('clear'),
    figlet      = require('figlet'),
    package = require('./package.json'),
    requestify = require('requestify'),
    wget = require('node-wget'),
    inquirer = require('inquirer'),
    CLI = require('clui'),
    Spinner = CLI.Spinner,
    targz = require('targz'),
    gip = require('get-installed-path');
