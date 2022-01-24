const program = require('commander');
const package = require('./../services/package');
program
.command('init')
.description('Para agregar los scripts al package.json')
.option('-d, --debug', 'Ejecuta un depurador del codigo')
.action((cmdObj) => {
    if (cmdObj.debug) {
        //TODO: Ejecucion debug
    }
    package.packageInit();
}
)