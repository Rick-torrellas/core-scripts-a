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
function packageInit({debug}) {
//TODO: crear un proceso donde verifiquemos si existe el archivo pacjage.json
    const NAME_ = 'packageInit';
    if(debug)name(NAME_,'service');
    packageInitCmd({debug});
    if(debug)done(NAME_);
//----------------------------------------------------------------------------
}
function packageInitCmd({debug}) {
    const NAME_ = 'packageInitCmd';
    if (debug) name(NAME_,'service');
    const package = packageLocation;
    const arg = {
        package
    }
    if (debug)values(arg);
    const read = readFileSync(package,'utf-8');
    if (!read) {
        error('El package esta vacio, iniciando un nuevo package');
        newPackage({debug});
        if(!read)error('No se puede iniciar un nuevo package');
    }
    if (read) {
        info('El package tiene contenido');
        const data = JSON.parse(read);
        if (data.scripts == undefined && !data.hasOwnProperty('scripts')) {
            warning('No existe la propiedad scripts');
            scriptsCmd({debug});
        } else {
            info('Modificando la propiedad scripts');
            packageCmd({debug});
        }
        
    }
    if (debug) done(NAME_);
//-----------------------------------------------------------------------------
}
function scriptsCmd({debug}) {
    const NAME_ = 'scriptsCmd';
    if (debug) name(NAME_,'service');
    const package = packageLocation;
    const env_file = env_file_path;
    const home_path = cmd_scripts_path;
    const arg = {
        package,
        env_file,
        home_path
    }
    if (debug)values(arg);
    const data = JSON.parse(read);
    data.scripts = {
        
    }
//------------------------------------------------------------------------------------    
}
function packageCmd({debug}) {
    const NAME_ = 'packageCmd';
    if (debug) name(NAME_,'service');
    const package = packageLocation;
    const env_file = env_file_path;
    const home_path = cmd_scripts_path;
    const object = cmd_scripts;
    const arg = {
        package,
        env_file,
        home_path,
        object
    }
    if (debug)values(arg);
    const read = readFileSync(package,'utf-8');
    const data = JSON.parse(read);
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
    });
    console.log('package.json modificado!');
    if (debug) done(NAME_);
// --------------------------------------------------------------------------------------------
}
function newPackage({debug}) { 
const NAME_ = 'newPackage';
if(debug)name(NAME_,"service");
const command = 'npm init -y';
const arg={
    command
}
if(debug)values(arg);
    exec(command,(error,stdout, stderr)=> {
        console.log('Instalando dependencias:')
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`Resultado: ${stdout}`);
        if(debug)done(NAME_);
    })
//----------------------------------------------------------------------------------
}
module.exports = {
    packageInit
}