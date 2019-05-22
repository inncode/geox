#!/usr/bin/env node
const chalk       = require('chalk');
const clear       = require('clear');
const figlet      = require('figlet');
const inquirer    = require('./lib/inquirer');
const utils    = require('./lib/utils');
const package = require('package.json');

clear();
console.log(chalk.yellow(figlet.textSync('GeoX', { horizontalLayout: 'full' })));
console.log(chalk.blue("Geolocation tools / by hiago.me"));
console.log(chalk.red("Version " + package.version));
if(utils.checkGeoliteCityExists()) {
    console.log(chalk.yellow('[Licence] This product includes GeoLite2 data created by MaxMind, available from https://www.maxmind.com'));
}

const run = () => {
    inquirer.disposeActions().then((result) => {
        if(result.options !== 'exit') {
            inquirer[result.options]().then((r) => {
                run();
            }).catch((error) => {
                console.log(chalk.red('Error: ', error));
                run();
            });
        }
    }).catch((error) => {
        console.log(chalk.red('Error: ', error));
        run();
    });
}

run();