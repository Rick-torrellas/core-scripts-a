const program = require('commander');
const package = require('./../services/package');
program
.command('init')
.description('Para agregar los scripts al package.json, por defecto agregara scripts de cmd')
.option('-d, --debug', 'Ejecuta un depurador del codigo')
.option('-d, --batch', 'Ejecuta un depurador del codigo')
.action((cmdObj) => {
    if (cmdObj.debug) {
        //TODO: Ejecucion debug
    }
    package.packageInit();
}
)