//@ts-check
/**
 * Modulo para controlar las funciones relacionadas con los archivos .env
 * @module services/env
 */
//TODO: implementar el debuger
const path = require("path");
const {existsSync,writeFile} = require('fs');

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
 * Creara un nuevo archivo .env.core .
 * @returns {boolean} Si ya existe el archivo env regresa false, si se crea un nuevo archivo env regresa true.
 */
//TODO: esta funcion solo deria crear el envfile, sin comprobar, crear una funcion de flujo superior, que se encargue de controlar el proceso de creacion.
function createEnv() {
    const file = envFileAbsolute;
    const content = "MEGA_MAIL_A=\nMEGA_PASS_A=\nMONGO_USER=\nMONGO_PASSWORD=\nMONGO_URI_DOWNLOAD=\nMONGO_URI_UPLOAD=\nDEBUG=false";
    if (verifyEnv(file)) {
        console.log('Ya existe el archivo .env.core');
        return;
    } else {
        writeFile(file, content, function (err) {
            if (err) throw err;
            console.log('Archivo env.core creado!');
            return true
        });
    }
}
/**
 * Verifica si existe un archivo .env
 * @param {string} envFile - El archivo env para verificar.
 * @returns {boolean} - Si ya existe el archivo .env retorna true, si no false.
 */
function verifyEnv(envFile) {
    if (existsSync(envFile)) {
        return true;
    } else {
        return false;
    }
}
module.exports = {
    createEnv,
    envFileRelative
}
