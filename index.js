#!/usr/bin/env node
const chalk       = require('chalk');
const clear       = require('clear');
const figlet      = require('figlet');
const inquirer    = require('./lib/inquirer');
const package = require('./package.json');

clear();
console.log(chalk.yellow(figlet.textSync('GeoX', { horizontalLayout: 'full' })));
console.log(chalk.blue("Geolocation tools / by hiago.me"));
console.log(chalk.red("Version " + package.version));

const run = () => {
    inquirer.disposeActions().then((result) => {
        if(result.options !== 'exit') {
            console.log("");
            inquirer[result.options]().then((r) => {
                console.log("");
                run();
            }).catch((error) => {
                console.log(chalk.red('Error: ', error));
                console.log("");
                run();
            });
        }
    }).catch((error) => {
        console.log(chalk.red('Error: ', error));
        console.log("");
        run();
    });
}

run();