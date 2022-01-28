const program = require('commander');
const package = require('./../services/package');
const dependencies = require('./../services/dependencies');
const env = require('./../services/env');
const nucleo = require('./../services/nucleo');
const {start} = require('./../services/debug');
program
.command('init')
.description('Para agregar los scripts al package.json, por defecto agregara scripts de cmd')
.option('-d, --debug', 'Ejecuta un depurador del codigo')
.option('-b, --batch', 'Ejecuta un depurador del codigo')
.action((cmdObj) => {
    const {debug} = cmdObj;
    if (debug) start();
    package.packageInit({debug});
    dependencies.dependenciesInit();
    env.createEnv();
    nucleo.nucleoInit({debug});
}
)