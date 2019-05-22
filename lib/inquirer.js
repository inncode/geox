const inquirer = require('inquirer');
const Reader = require('@maxmind/geoip2-node').Reader;
const utils = require('./utils');
const chalk = require('chalk');
const CLI         = require('clui');
const Spinner     = CLI.Spinner;

module.exports = {
    disposeActions: () => {
        const options = [{
            type: "list",
            name: "options",
            message: "Select the operation:",
            choices: [
                {
                    name: "Address over geoposition",
                    value: "addressOverGeo"
                },
                {
                    name: "Geoposition over address",
                    value: "geoOverAddress"
                },
                {
                    name: "Address over ip",
                    value: "addressOverIp"
                },
                {
                    name: "Geoposition over ip",
                    value: "geoOverIp"
                },
                {
                    name: "Exit",
                    value: "exit"
                }
            ]
        }];

        return inquirer.prompt(options);
    },

    addressOverGeo: () => {
        return new Promise((res, rej) => {
            inquirer.prompt([{
                type: "text",
                name: "lat",
                message: "Enter latitude:"
            }, {
                type: "text",
                name: "lon",
                message: "Enter longitude:"
            }]).then((r) => {
                const status = new Spinner('Wait, searching address...');
                status.start();
                utils.searchLocation(`${r.lat},${r.lon}`).then((rws) => {
                    status.stop();
                    let locates = JSON.parse(rws.body);
                    for (let i = 0; i < locates.length; i++) {
                        console.log(chalk.blue('[Address] > '), locates[i].display_name, chalk.yellow('Licence: ' + locates[i].licence));
                    }
                    res();
                }).catch((e) => {
                    status.stop();
                    rej(e);
                });
            }).catch(rej);
        });
    },
    geoOverAddress: () => {
        return new Promise((res, rej) => {
            inquirer.prompt({
                type: "text",
                name: "address",
                message: "Enter the address:"
            }).then((r) => {
                const status = new Spinner('Wait, searching geoposition...');
                status.start();
                utils.searchLocation(`${r.address}`).then((rws) => {
                    status.stop();
                    let locates = JSON.parse(rws.body);
                    for (let i = 0; i < locates.length; i++) {
                        console.log(chalk.blue('[Geoposition] > '), `${locates[i].lat},${locates[i].lon}`, chalk.yellow('Licence: ' + locates[i].licence));
                    }
                    res();
                }).catch((r) => {
                    status.stop();
                    rej(r);
                });
            }).catch(rej);
        });
    },
    geoOverIp: () => {
        return new Promise((res, rej) => {
            utils.setupGeoliteCity().then((setupDb) => {
                inquirer.prompt({
                    type: "text",
                    name: "ip",
                    message: "Enter the IP Address:"
                }).then((r) => {
                    const status = new Spinner('Wait, searching geoposition...');
                    status.start();
                    Reader.open(setupDb, {}).then(reader => {
                        status.stop();
                        let location = reader.city(r.ip).location;
                        console.log(chalk.blue('[Geoposition] > '), `${location.latitude},${location.longitude}`);
                        res();
                    }).catch((e) => {
                        status.stop();
                        rej(e);
                    });
                }).catch(rej);
            }).catch(rej);
        });
    },
    addressOverIp: () => {
        return new Promise((res, rej) => {
            utils.setupGeoliteCity().then((setupDb) => {
                inquirer.prompt({
                    type: "text",
                    name: "ip",
                    message: "Enter the IP Address:"
                }).then((r) => {
                    Reader.open(setupDb, {}).then(reader => {
                        let location = reader.city(r.ip).location;
                        const status = new Spinner('Wait, searching geoposition...');
                        status.start();
                        utils.searchLocation(`${location.latitude},${location.longitude}`).then((rws) => {
                            status.stop();
                            let locates = JSON.parse(rws.body);
                            for (let i = 0; i < locates.length; i++) {
                                console.log(chalk.blue('[Address] > '), locates[i].display_name, chalk.yellow('Licence: ' + locates[i].licence));
                            }
                            res();
                        }).catch((e) => {
                            status.stop();
                            rej(e);
                        });
                    }).catch(rej);
                }).catch(rej);
            }).catch(rej);
        });
    }
};