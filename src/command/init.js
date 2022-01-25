const program = require('commander');
const package = require('./../services/package');
const dependencies = require('./../services/dependencies');
const env = require('./../services/env');
const nucleo = require('./../services/nucleo');
program
.command('init')
.description('Para agregar los scripts al package.json, por defecto agregara scripts de cmd')
.option('-d, --debug', 'Ejecuta un depurador del codigo')
.option('-d, --batch', 'Ejecuta un depurador del codigo')
.action((cmdObj) => {
    if (cmdObj.debug) {
        //TODO: Ejecucion debug
    }
    //TODO: Crearun proceso para crear el archivo .env.core, con las variables ya inicializadas
    //TODO: Crear un proceso que verifique si existe el .nucleo, y si no lo cree
    package.packageInit();
    dependencies.dependenciesInit();
    env.createEnv();
    nucleo.nucleoInit();
}
)