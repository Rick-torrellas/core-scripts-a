/**
 * Modulo para controlar las funciones relacionadas con el package.json. 
 * @module services/env
 */
const { exec } = require("child_process");
const {join} = require('path');
const {readFileSync,writeFile} = require('fs');
//TODO: implementar el debuger sin destrcuturarlo.
//TODO: cambiar todos los readFileSync por readFile asyncrono. Para usar sus callbacks.
const {name,values,error,done,info,warning} = require('./debug');
const {envFileRelative} = require('./env');
//              typedef
/**
 * 
 * @typedef {import("./../typedef").defaults} defaults 
 */
/**
 * @typedef {import("./../typedef").script} script
 */
// --
//          Variables
/**
 * La ubicacion del package.json del proyecto actual.
 */
const packageLocation = join(`${process.cwd()}/package.json`);
/**
 * La ubicacion del archivo .env.core . Mirar {@link envFileRelative}
 */
const env_file_path=envFileRelative;
/**
 * La ruta donde se guardan los scripts cmd.
 */
const cmd_scripts_path="./node_modules/@core_/scripts/bin/cmd";
/**
 * La ruta donde se guardan los scripts bash.
 */
const bash_scripts_path="./node_modules/@core_/scripts/bin/bash";
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
/**Va a guardar los scripts bash, que se van a usar en el package.json
 */
 const bash_scripts = {
    "nucleo:d": `env-cmd -f ${env_file_path} ${bash_scripts_path}/mega_nucleo_download.sh`,
    "nucleo:u": `env-sh -f ${env_file_path} ${bash_scripts_path}/mega_nucleo_upload.sh`,
    "mongol:u": `env-sh -f ${env_file_path} ${bash_scripts_path}/mongo_local_upload.sh`,
    "mongol:d": `env-sh -f ${env_file_path} ${bash_scripts_path}/mongo_local_download.sh`,
    "mongoe:u": `env-sh -f ${env_file_path} ${bash_scripts_path}/mongo_externe_upload.sh`,
    "mongoe:d": `env-sh -f ${env_file_path} ${bash_scripts_path}/mongo_externe_download.sh`
}
// --
//              Funciones
/**
 * Iniciara el proceso para inyectar los scripts en el package.json, determinara si usar scripts, bash, powrshell o cmd. Por defecto usara cmd.
 * @param {{
    debug: boolean
    defaults: defaults
    scripts: script
 * }}
 * Debug - Para activar el modo debug
 * @param defaults - Valores por defecto para los procesos.
 * @param script Para escojer que scripts inyectar.
 * @return {void}
 */
function packageInit({Debug,defaults,script},callback) {
//TODO: unir esta funcion, con la funcion del proceso total.
    const NAME_ = 'packageInit';
    if(debug)name(NAME_,'service');
    const scripts = choseScript({Debug,defaults,script});
    const Package = packageLocation;
    const arg = {
        Package,
        scripts
    }
    if (debug)values(arg);
    const read = readFileSync(Package,'utf-8');
// proceso en caso de que este vacio el package.json
    if (!read) {
        processPackageEmpty({Debug,scripts,Package},()=> {
            const read = readFileSync(Package,'utf-8');
            if (read) {
                const data = JSON.parse(read);
                if (!checkScriptObject({data,Debug})) {
                    
                }
            }
        });
        return;
    }
// proceso en caso de que no exista el objeto script
    if (read) {
        const data = JSON.parse(read);
        checkScriptObject({data,Debug,scripts,Package});
    }
// proceso en que todo esta bien y solo anade los scripts.
    if(debug)done(NAME_);
    callback();
}
/**
 * Determina que scripts inyectar en el package.json, ya sea bash, cmd o powershell. Por defecto inyectara cmd.
 * @param Debug Para activar el debuger
 * @param defaults Los valores por defecto para el package.
 * @param scripts Los scripts para escojer cual script inyectar.
 * @returns 
 */
function choseScript({Debug,defaults,script}) {
    const {sh,cmd} = script;
    const {package_: {
        scripts_
    }} = defaults;
    if (sh) {
        const script = bash_scripts;
        return script;
    } else if (cmd) {
        const script = cmd_scripts;
        return script;
    } else {
        switch (scripts_) {
            case "cmd":
        const script = cmd_scripts;   
        return script; 
            case "sh":
        const script = bash_scripts;   
        return script; 
        }
    }
}
/**
 * En caso de que el package.json este vacio, se iniciara un nuevo package con "npm init -y", y continuara con el proceso para agregar los scripts. 
 * @param {{
    debug: boolean
    Package: string
 * }}
 * debug - Para activar el modo debug
 * @param Package - La ruta del package.json a ser inyectado.
 * @return - Retornara "true", si esta vacio el package de lo contrario retornara "false".
 */
//TODO: esta funcion no debe continuar con el proceso de inyectar el script, solo debe hacer su trabajo de iniciar un nuevo paquete. eso quiere decir 
function processPackageEmpty({debug,Package},callback) {
    const NAME_ = 'packageEmpty';
    if (debug) name(NAME_,'subservice');
        warning('El package esta vacio, iniciando un nuevo package');
     newPackage({debug},()=>{
    const read = readFileSync(Package,'utf-8');
            if(read) {
                const data = JSON.parse(read);
                deleteDependencies({debug,data,Package});
                return;
//TODO: colocar un debug.succeess aqui
            } else {
                error('No se puede iniciar un nuevo package');
                return;
            }
        });
callback();
if(debug)done(NAME_);
    }
/**
 * Vacia las dependencias, por alguna razon, cuando se inicia un nuevo paquete se crean un monton de dependencias.
 * 
 * ? esta funcion se podria reusar, si se enfoca en vacias cualquier propiedad de un json, se llamaria emptyObject y perteneceria al serivicio json.
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
* @return {void}
 */
function checkScriptObject({data,debug}) {
    const NAME_ = 'checkScriptObject';
    if (debug) name(NAME_,'subservice');
        if (data.scripts == undefined && !data.hasOwnProperty('scripts')) {
            warning('No existe la propiedad scripts');
            if(debug)done(NAME_);
            return false;
        } else {
            info('Existe la propiedad scripts');
            if(debug)done(NAME_);
            return true;
        }
        
}
/**
 * Esta funcion se encarga de crear una nueva propiedad scripts, en caso de que no exista en el package.json y inyectar los scripts.
 * 
 * ? no es mejor transformar esta funcion que agrege cualquier objeto en el package.json?
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
function createScriptObject({debug,data,scripts,Package}) {
    const NAME_ = 'createScriptObject';
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
 * 
 * ? esta funcion podria resultilizarse, si se enfoca en agregar cualquier tipo de porpiedades a un objeto, puede pertenencer al serivicio json_, y e podria llamar addProperties
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
function addScripts({debug,data,scripts,Package}) {
    const NAME_ = 'addScripts';
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
 * 
 * ? no seria mejor que esta fuere una funcion para verificar archivos en si. para un servicio aparte llamado files.
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
/**
 * Verifica si existen los scripts inyectados con {@link addScripts} en el package.json.
 * 
 * ? esta funcion podria ser checkProperties, de cuaquier archivo json, las properties se pasan por parametro. Pertenece al servicio, json_.
 */
//TODO: falta por terminar
function checkScripts() {

}
// --
module.exports = {
    packageInit
}