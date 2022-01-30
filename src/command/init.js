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
.option('-op, --onlyPackage', 'Solo agrega los scripts al package.json')
.option('-od, --onlyDependencies', 'Solo agrega las dependencias para que funcionen los scripts')
.option('-oe, --onlyEnvFile', 'Solo crea el archivo .env.core')
.option('-on, --onlyNucleo', 'Solo crea la carpeta nucleo')
.action((cmdObj) => {
    const {debug,onlyEnvFile,onlyNucleo,onlyDependencies,onlyPackage} = cmdObj;
    if (debug) start();
    initCmd({debug,onlyEnvFile,onlyNucleo,onlyDependencies,onlyPackage});
}
)
function initCmd({debug,onlyEnvFile,onlyNucleo,onlyDependencies,onlyPackage}) {
    if (onlyPackage) {
        package.packageInit({debug},()=>{});
        return;
    }
    if (onlyEnvFile) {
        env.createEnv();
        return;
    }
    if (onlyNucleo) {
        nucleo.nucleoInit({debug});
        return;
    }
    if (onlyDependencies) {
        dependencies.dependenciesInit();
        return;
    }
    initCmdDefault();
}
function initCmdDefault({debug}) {
    package.packageInit({debug},()=>{
        dependencies.dependenciesInit();
    });
    env.createEnv();
    nucleo.nucleoInit({debug});
}