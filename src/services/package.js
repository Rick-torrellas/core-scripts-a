const { exec } = require("child_process");
const {join} = require('path');
const {readFileSync,writeFile} = require('fs');
const packageLocation = join(`${process.cwd()}/package.json`);
const {name,values,error,done,info,warning} = require('./debug');
const env_file_path="./.env.core";
const cmd_scripts_path="./node_modules/@core_/scripts/bin/cmd";
const cmd_scripts = {
    "nucleo:d": `env-cmd -f ${env_file_path} ${cmd_scripts_path}/mega_nucleo_download.cmd`,
    "nucleo:u": `env-cmd -f ${env_file_path} ${cmd_scripts_path}/mega_nucleo_upload.cmd`,
    "mongol:u": `env-cmd -f ${env_file_path} ${cmd_scripts_path}/mongo_local_upload.cmd`,
    "mongol:d": `env-cmd -f ${env_file_path} ${cmd_scripts_path}/mongo_local_download.cmd`,
    "mongoe:u": `env-cmd -f ${env_file_path} ${cmd_scripts_path}/mongo_externe_upload.cmd`,
    "mongoe:d": `env-cmd -f ${env_file_path} ${cmd_scripts_path}/mongo_externe_download.cmd`

}
function packageInit({debug},callback) {
//TODO: crear un proceso donde verifiquemos si existe el archivo pacjage.json
    const NAME_ = 'packageInit';
    const cmdScripts = cmd_scripts;
    if(debug)name(NAME_,'service');
    packageInitCmd({debug,scripts:cmdScripts});
    if(debug)done(NAME_);
    callback();
//----------------------------------------------------------------------------
}
/**
 * Esta funcion es el proceso superior para agregar los scripts para cmd, en el pacjage.json, esto quiere decir, que va a buscar todos los posibles ecenarios donde no va a funcionar la ejecucion y buscar soluciones. 
 */
function packageInitCmd({debug,scripts}) {
    const NAME_ = 'packageInitCmd';
    if (debug) name(NAME_,'sub-service');
    const package = packageLocation;
    const arg = {
        package,
        scripts
    }
    if (debug)values(arg);
    const read = readFileSync(package,'utf-8');
    if (!read) {
        packageCmdEmpty({debug,scripts,package});
        return;
    }
    if (read) {
        const data = JSON.parse(read);
        packageCMdScript({data,debug,scripts,package});
    }
    if (debug) done(NAME_);
//-----------------------------------------------------------------------------
}
/**
 * En caso de que el package.json este vacio, se iniciara un nuevo package con "npm init -y", y continuara con el proceso para agregar los scripts. Retornara "true", si esta vacio el package de lo contrario retornara "false".
 */
function packageCmdEmpty({debug,scripts,package}) {
    const NAME_ = 'packageCmdEmpty';
    if (debug) name(NAME_,'subservice');
        error('El package esta vacio, iniciando un nuevo package');
        newPackage({debug},()=>{
    const read = readFileSync(package,'utf-8');
            if(read) {
                const data = JSON.parse(read);
                deleteDependencies({debug,data,package});
                packageCMdScript({debug,data,scripts,package});
            } else {
                error('No se puede iniciar un nuevo package');
            }
            if(debug)done(NAME_);
        });
//--------------------------------------------------------------------------------
}
/**
 * Vacia las dependencias, por alguna razon, cuando se inicia un nuevo paquete se crean un monton de dependencias, en caso de que eso suceda, esta funcion las borra. 
 */
function deleteDependencies({debug,data,package}){
const NAME_ = "deleteDependencies";
if(debug)name(NAME_,'sub-services');
if (data.dependencies !== undefined && data.hasOwnProperty('dependencies')) {
data.dependencies = {};
const complete = JSON.stringify(data,null,2);
writeFile(package,complete,(err) => {
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
 * Este es el proceso para verificar si existe la propiedad script, en caso de que no exista se crea una nueva porpiedad script con los scritpts cmd. En caso de que exista, tambien agregara los scripts.
 * ? es necesario clocar la funcion packageCmd aqui? no seria mejor dejarla aparte?
 */
function packageCMdScript({data,debug,scripts,package}) {
    const NAME_ = 'packageCMdScript';
    if (debug) name(NAME_,'subservice');
        info('El package tiene contenido');
        if (data.scripts == undefined && !data.hasOwnProperty('scripts')) {
            warning('No existe la propiedad scripts, creando scripts');
            scriptsCmd({debug,data,scripts,package});
        } else {
            info('Modificando la propiedad scripts');
            packageCmd({debug,data,scripts,package});
        }
        
    if(debug)done(NAME_);
}
/**
 * Esta funcion se encarga de crear una nueva propiedad scripts, en caso de que no exista en el package.json.
 * TODO: textear a ver si funciona
 */
function scriptsCmd({debug,data,scripts,package}) {
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
    writeFile(package,complete,(err) => {
        if (err) {
        error('Error al modificar el package.json');
    throw err;
        }
        console.log('package.json modificado!');
    });
    if (debug) done(NAME_);
//------------------------------------------------------------------------------------    
}
/**
 * Esta funcion se ejecuta en condiciones normales, cuando el package.json no esta vacio y cuando existe la propiedad scripts, lo que hace es agregar scripts de cmd.
 */
function packageCmd({debug,data,scripts,package}) {
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
    writeFile(package,complete,(err) => {
        if (err) {
        error('Error al modificar el package.json');
    throw err;
        }
        console.log('package.json modificado!');
    });
    if (debug) done(NAME_);
// --------------------------------------------------------------------------------------------
}
/**
 * Se encarga de volver a iniciar el package en caso de que este vacio.
 * ! necesita usar el callback, por que iniciar el package demora un tiempo
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
function verifyPackage({debug}) {
const NAME_ = 'verifyNucleo';
if(debug)debug.name(NAME_,'sub-service');
const package = packageLocation;
const arg = {
    package
}
if(debug)values(arg);

}
module.exports = {
    packageInit
}