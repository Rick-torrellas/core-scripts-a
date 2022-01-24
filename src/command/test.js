const program = require('commander');

program
.command('test')
.description('Para pruebas')
.option('-p, --pene ', 'Penetracion')
.action((cmdObj) => {
    console.log(cmdObj.pene);
    console.log('nalga');
}
)