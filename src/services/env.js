/**
 * Modulo para controlar las funciones relacionadas con los archivos .env
 * @module services/env
 */
//TODO: implementar el debuger
const path = require("path");
const filePromise = require("./filePromise");
const debug = require('./debug');
/**
 * La ruta absoluta del archivo .env.core en el proyecto actual.
 * 
 * Se tomara como punto de referencia, el lugar donde se esta ejecutando el proceso, en este caso la raiz del proyecto.
 * @type {string}
 */
const envFileAbsolute = path.join(process.cwd()+'/.env.core');
/**
 * La ruta relativa del archivo .env.core en el proyecto actual.
 * 
 * Usando como punto de referencia, la raiz del proyecto.
 * @type {string}
 */
const envFileRelative = "./.env.core";
/**
 * El contenido por defecto del archivo .env.core
 * @type {string}
 */
const default_content = "MEGA_MAIL_A=\nMEGA_PASS_A=\nMONGO_USER=\nMONGO_PASSWORD=\nMONGO_URI_DOWNLOAD=\nMONGO_URI_UPLOAD=\nDEBUG=false";
/**
 * Creara un nuevo archivo .env.core .
 */
//TODO: esta funcion solo deria crear el envfile, sin comprobar, crear una funcion de flujo superior, que se encargue de controlar el proceso de creacion.
async function envInit({Debug}={Debug:false}) {
    const name = envInit.name;
    debug.name(Debug, name);
    const file = envFileAbsolute;
    const content = default_content;
    if (await filePromise.checkFile({file},{Debug})) {
        debug.info('Ya existe el archivo .env.core');
        debug.done(Debug, name);
        return;
    } else {
        await filePromise.createFile({file,content},{Debug});
    }
}
module.exports = {
    envInit,
    envFileRelative
}
