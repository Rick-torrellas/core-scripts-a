/**
 * Modulo para controlar las funciones relacionadas con el package.json. 
 * @module services/env
 */
//TODO: Cambiar el nombre de las funciones que llevan cmd, ya no es necesario, por que estan echas para funcionar con cualquiera.
const { exec } = require("child_process");
const {join} = require('path');
const {readFileSync,writeFile} = require('fs');
//TODO: implementar el debuger sin destrcuturarlo.
const {name,values,error,done,info,warning} = require('./debug');
/**
 * La ubicacion del package.json del proyecto actual.
 */
const packageLocation = join(`${process.cwd()}/package.json`);
/**
 * La ubicacion del archivo .env.core
 */
const env_file_path="./.env.core";
/**
 * La ruta donde se guardan los scripts cmd.
 */
const cmd_scripts_path="./node_modules/@core_/scripts/bin/cmd";
/**Va a guardar los scripts cmd, que se van a usar en el package.json
 */
const cmd_scripts = {
    "nucleo:d": `env-cmd -f ${env_file_path} ${cmd_scripts_path}/mega_nucleo_download.cmd`,
    "nucleo:u": `env-cmd -f ${env_file_path} ${cmd_scripts_path}/mega_nucleo_upload.cmd`,
    "mongol:u": `env-cmd -f ${env_file_path} ${cmd_scripts_path}/mongo_local_upload.cmd`,
    "mongol:d": `env-cmd -f ${env_file_path} ${cmd_scripts_path}/mongo_local_download.cmd`,
    "mongoe:u": `env-cmd -f ${env_file_path} ${cmd_scripts_path}/mongo_externe_upload.cmd`,
    "mongoe:d": `env-cmd -f ${env_file_path} ${cmd_scripts_path}/mongo_externe_download.cmd`

}
/**
 * Iniciara el proceso para inyectar los scripts en el package.json, determinara si usar scripts, batch, powrshell o cmd. Por defecto usara cmd.
 * @param {{
    debug: boolean
 * }}
 * debug - Para activar el modo debug
 * @return {void}
 */
function packageInit({debug},callback) {
//TODO: crear un proceso donde verifiquemos si existe el archivo pacjage.json
    const NAME_ = 'packageInit';
    const cmdScripts = cmd_scripts;
    if(debug)name(NAME_,'service');
    packageInitCmd({debug,scripts:cmdScripts});
    if(debug)done(NAME_);
    callback();
}
/**
 * Esta funcion se encarga de verificar que los scripts sean inyectados correctamente, viendo si existe el package.json, viendo que no este vacio y que exista el objeto scripts en el. 
 * @param {{
    debug: boolean
    scripts: String[]
 * }} 
 * debug - Para activar el modo debug.
 * @param scripts - Los scripts que se van a inyectar.
 * @return {void}
 */
//TODO: modificar el proceso, aqui se usa packageCmdEmpty
function packageInitCmd({debug,scripts}) {
    const NAME_ = 'packageInitCmd';
    if (debug) name(NAME_,'sub-service');
    const Package = packageLocation;
    const arg = {
        Package,
        scripts
    }
    if (debug)values(arg);
    const read = readFileSync(Package,'utf-8');
    if (!read) {
        packageCmdEmpty({debug,scripts,Package});
        return;
    }
    if (read) {
        const data = JSON.parse(read);
        packageCMdScript({data,debug,scripts,Package});
    }
    if (debug) done(NAME_);
}
/**
 * En caso de que el package.json este vacio, se iniciara un nuevo package con "npm init -y", y continuara con el proceso para agregar los scripts. 
 * @param {{
    debug: boolean
    scripts: string[]
    Package: string
 * }}
 * debug - Para activar el modo debug
 * @param scripts - Los scripts para ser inyectados en el package.json
 * @param Package - La ruta del package.json a ser inyectado.
 * @return {boolean} - Retornara "true", si esta vacio el package de lo contrario retornara "false".
 */
//TODO: esta funcion no debe continuar con el proceso de inyectar el script, solo debe hacer su trabajo de iniciar un nuevo paquete. retornara true si el proceso es exitoso, false si no se puede cumplir el proceso.
function packageCmdEmpty({debug,scripts,Package}) {
    const NAME_ = 'packageCmdEmpty';
    if (debug) name(NAME_,'subservice');
        error('El package esta vacio, iniciando un nuevo package');
        newPackage({debug},()=>{
    const read = readFileSync(Package,'utf-8');
            if(read) {
                const data = JSON.parse(read);
                deleteDependencies({debug,data,Package});
                packageCMdScript({debug,data,scripts,Package});
            } else {
                error('No se puede iniciar un nuevo package');
            }
            if(debug)done(NAME_);
        });
}
/**
 * Vacia las dependencias, por alguna razon, cuando se inicia un nuevo paquete se crean un monton de dependencias.
 * @param {{
    debug: boolean
    data: any
    Package: string
 * }}
 * debug - Para activar el modo debug.
 * @param data - El package.json que se esta editando.
 * @param Package - La ruta del package.json que se esta editando.
 * @return {void}
 */
function deleteDependencies({debug,data,Package}){
const NAME_ = "deleteDependencies";
if(debug)name(NAME_,'sub-services');
if (data.dependencies !== undefined && data.hasOwnProperty('dependencies')) {
data.dependencies = {};
const complete = JSON.stringify(data,null,2);
writeFile(Package,complete,(err) => {
    if (err) {
    error('Error al modificar el package.json');
throw err;
}
console.log('Dependencias eliminadas');
});
}
if(debug)done(NAME_);
}
/**
 * Este es el proceso para verificar si existe la propiedad script, en caso de que no exista se crea una nueva porpiedad script y se inyextaran los scripts en ella. En caso de que exista, tambien agregara los scripts.
 * ? es necesario clocar la funcion packageCmd aqui? no seria mejor dejarla aparte?
* @param {{
    debug: boolean
    data: any
    scripts: string[]
    Package: string
 * }}
 * debug - Para activar el modo debug.
* @param data - El package.json que se esta editando.
* @param Package - La ruta del package.json que se esta editando.
* @param scripts - Los scripts para ser inyectados en el package.json
* @return {void}
 */
//TODO: esta funcion no debe inyectar los scripts, tan solo verificar si existe el objeto scripts, true si existe, false en caso de que no exista.
function packageCMdScript({data,debug,scripts,Package}) {
    const NAME_ = 'packageCMdScript';
    if (debug) name(NAME_,'subservice');
        info('El package tiene contenido');
        if (data.scripts == undefined && !data.hasOwnProperty('scripts')) {
            warning('No existe la propiedad scripts, creando scripts');
            scriptsCmd({debug,data,scripts,Package});
        } else {
            info('Modificando la propiedad scripts');
            packageCmd({debug,data,scripts,Package});
        }
        
    if(debug)done(NAME_);
}
/**
 * Esta funcion se encarga de crear una nueva propiedad scripts, en caso de que no exista en el package.json y inyectar los scripts.
 * @param {{
    debug: boolean
    data: any
    scripts: string[]
    Package: string
 * }}
* debug - Para activar el modo debug.
* @param data - El package.json que se esta editando.
* @param Package - La ruta del package.json que se esta editando.
* @param scripts - Los scripts para ser inyectados en el package.json
 */
//TODO: Esta funcion solo debe de encargarse de crear el objeto scripts, no de inyectar los scripts.
function scriptsCmd({debug,data,scripts,Package}) {
    const NAME_ = 'scriptsCmd';
    if (debug) name(NAME_,'service');
    const object = scripts;
    data.scripts = {}
    for (const key in object) {
        if (object.hasOwnProperty.call(object, key)) {
            const values = object[key];
            data.scripts[key] = values;
        }
    }
    const complete = JSON.stringify(data,null,2);
    writeFile(Package,complete,(err) => {
        if (err) {
        error('Error al modificar el package.json');
    throw err;
        }
        console.log('package.json modificado!');
    });
    if (debug) done(NAME_);
}
/**
 * Inyectara los scripts, al package.json.
 * @param {{
    debug: boolean
    data: any
    scripts: string[]
    Package: string
 * }}
 * debug - Para activar el modo debug
* @param scripts - Los scripts para ser inyectados en el package.json
 * @param data - Contiene el package.json abierto y parseado.
 * @param Package - La ruta del package.json que se editara.
 * @return {void}
 */
function packageCmd({debug,data,scripts,Package}) {
    const NAME_ = 'packageCmd';
    if (debug) name(NAME_,'service');
    const object = scripts;
for (const key in object) {
    if (object.hasOwnProperty.call(object, key)) {
        const values = object[key];
        data.scripts[key] = values;
    }
}
    const complete = JSON.stringify(data,null,2);
    writeFile(Package,complete,(err) => {
        if (err) {
        error('Error al modificar el package.json');
    throw err;
        }
        console.log('package.json modificado!');
    });
    if (debug) done(NAME_);
}
/**
 * Se encarga de volver a iniciar el package en caso de que este vacio. Por alguna razon cuando se inicia crea depenencias. 
* @param {{
    debug: boolean
 * }}
    * debug - Para activar el modo debug.
* @param {function} callback 
 */
function newPackage({debug},callback) { 
const NAME_ = 'newPackage';
if(debug)name(NAME_,"service");
const command = 'npm init -y';
const arg={
    command
}
if(debug)values(arg);
    exec(command,(error,stdout, stderr)=> {
        console.log('Iniciando un nuevo package:')
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`Resultado: ${stdout}`);
        callback();
        if(debug)done(NAME_);
    })
//----------------------------------------------------------------------------------
}
/**
 * Verifica si existe el package.json
* @param {{
    debug: boolean
    Package: string
 * }}
* debug - Para activar el modo debug.
* @param Package - La ruta del package.json que se esta editando.
 */
//TODO: falta por terminar.
function verifyPackage({debug,Package}) {
const NAME_ = 'verifyNucleo';
if(debug)debug.name(NAME_,'sub-service');
const arg = {
    Package
}
if(debug)values(arg);

}
module.exports = {
    packageInit
}