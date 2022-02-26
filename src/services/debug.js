const chalk = require('chalk');
const {log} = console;
/**
 * Modulo para depurar el codigo, con una serie de logs, muestra mensajes para ayudar a visualizar donde esta el error.
 * @module services/debug
 */
/**
 * El mensaje para indicar que el modo debug esta activado.
 * @param {string} mensaje El mensaje para indicar que el modo debugger esta activado. 
 * @returns {void}
 */
function start(mensaje = 'Debug mode activated') {
    return log(`${chalk.red(mensaje)}`);
}
/**
 * Sirve para dar un indentificador y dar un poco de contexto de la funcion, en el que se encuentra el debugger.
 * @param {string} name El nombre de la funcion.
 * @param {string} type La clasificacion de funcion que uno le quiera dar.
 * @returns {void}
 */
function name(name,type='no-type') {
    return log(`${chalk.bgCyan('Process Name:')} ${name} \n`,`${chalk.underline.cyan('Type')}: ${type}`);
}
/**
 * Para dar alguna informacion.
 * @param {string} title El titulo de la informacion.
 * @param {string} description La descripcion de la informacion.
 * @returns {void}
 */
function info(title,description="no description") {
    return log(`${chalk.blue("Info")}: ${chalk.blue.underline(title)}\n`,description);
}
/**
 * Es igual que info, solo que este si necesita tener el debugger activado para ejecutarse.
 */
function data() {

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