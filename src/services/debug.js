const chalk = require('chalk');
const {log} = console;
function start(mensaje = 'Debug mode activated') {
    return log(`${chalk.red(mensaje)}`);
}
function name(name,type) {
    return log(`${chalk.bgCyan('Process Name:')} ${name} \n`,`${chalk.underline.cyan('Type')}: ${type}`);
}
function info(title,description="no description") {
    return log(`${chalk.blue("Info")}: ${chalk.blue.underline(title)}\n`,description);
}
function error(title,error = 'no description') {
    return log(`${chalk.red('ERROR')}: ${chalk.red.underline(title)}\n`,error);
}
function warning(title,description='no description') {
    return log(`${chalk.yellow('WARNING')}: ${chalk.yellow.underline(title)}\n`,description)
}
function values(values) {
    return log(`${chalk.green('Values')}:\n`, values);
}
function done(title,mensaje = 'Done') {
    return log(`${title}: ${chalk.blue(mensaje)}`);
}
module.exports = {
    name,
    info,
    error,
    warning,
    values,
    start,
    done
}