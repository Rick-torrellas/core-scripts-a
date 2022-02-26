//@ts-check
/**
 * Modulo para controlar las funciones relacionadas con los archivos .env
 * @module services/env
 */
//TODO: implementar el debuger
const path = require("path");
const {existsSync,writeFile} = require('fs');
/**
 * La ruta del archivo .env.core en el proyecto actual.
 * @type {string}
 */
const envFile = path.join(process.cwd()+'/.env.core');
/**
 * Creara un nuevo archivo .env.core .
 * @returns {boolean} Si ya existe el archivo env regresa false, si se crea un nuevo archivo env regresa true.
 */
//TODO: esta funcion solo deria crear el envfile, sin comprobar, crear una funcion de flujo superior, que se encargue de controlar el proceso de creacion.
function createEnv() {
    const file = envFile;
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
    createEnv
}
