const requestify = require('requestify');
const wget = require('node-wget');
const fs = require('fs');
const inquirer = require('inquirer');
const CLI = require('clui');
const Spinner = CLI.Spinner;
const targz = require('targz');
const gip = require('get-installed-path');
const localInstall = gip.getInstalledPathSync('@inncode/geox', {local: false}).replace('index.js','') + '/';

const utils = {
    _geoLiteCityDB: localInstall + '/GeoLite2-City/GeoLite2-City.mmdb',
    searchLocation: (query) => {
        return requestify.post(`https://nominatim.openstreetmap.org/search?q=${query}&format=json`);
    },

    setupGeoliteCity: () => {
        return new Promise((res, rej) => {
            if (utils.checkGeoliteCityExists()) {
                res(utils._geoLiteCityDB);
            } else {
                inquirer.prompt([{
                    type: "list",
                    name: "options",
                    message: "To use ip utils you need the MaxMind GeoLiteCity database, you want to download?",
                    choices: ['Yes', 'No']
                }]).then((r) => {
                    if (r.options === 'No')
                        return rej('The GeoliteCity is required!');

                    const status = new Spinner('Downloading GeoLiteCity, please wait...');
                    status.start();
                    utils.downloadGeoliteCity().then((rdown) => {
                        status.stop();

                        const statustar = new Spinner('Extracting database, please wait...');
                        statustar.start();
                        targz.decompress({
                            src: localInstall + 'GeoLite2-City.tar.gz',
                            dest: localInstall
                        }, function (err) {
                            statustar.stop();
                            let path = fs.readdirSync(localInstall).filter((val) => {
                                return val.indexOf('GeoLite2-City_') > -1
                            });
                            fs.renameSync(`${localInstall}/${path[0]}`, `${localInstall}/GeoLite2-City`);
                            fs.unlinkSync(`${localInstall}/GeoLite2-City.tar.gz`);

                            err ? rej(err) : res(utils._geoLiteCityDB);
                        });
                    }).catch(() => {
                        status.stop();
                        rej('Failed to get GeoLiteCity.');
                    });
                }).catch(() => rej('The GeoLiteCity is required!'));
            }
        })
    },

    checkGeoliteCityExists: () => {
        return fs.existsSync(utils._geoLiteCityDB);
    },

    downloadGeoliteCity: () => {
        return new Promise((res, rej) => {
            wget({
                url: 'https://geolite.maxmind.com/download/geoip/database/GeoLite2-City.tar.gz',
                dest: localInstall
            }, function (error, response, body) {
                if (error) {
                    rej(error);
                } else {
                    res(response);
                }
            });
        });
    }
};

module.exports = {
    ...utils
}