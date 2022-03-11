/**
 * Modulo para controlar las funciones relacionadas con el package.json.
 * @module services/env
 */
const { exec } = require("child_process");
const { join } = require("path");
const { readFileSync, writeFile } = require("fs");
//TODO: implementar el debuger sin destrcuturarlo.
//TODO: cambiar todos los readFileSync por readFile asyncrono. Para usar sus callbacks.
const debug = require("./debug");
const { envFileRelative } = require("./env");
//              typedef
/**
 *
 * @typedef {import("../lib/typedef").defaults} defaults
 */
/**
 * @typedef {import("../lib/typedef").script} script
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
const env_file_path = envFileRelative;
/**
 * La ruta donde se guardan los scripts cmd.
 */
const cmd_scripts_path = "./node_modules/@core_/scripts/bin/cmd";
/**
 * La ruta donde se guardan los scripts bash.
 */
const bash_scripts_path = "./node_modules/@core_/scripts/bin/bash";
/**Va a guardar los scripts cmd, que se van a usar en el package.json
 */
const cmd_scripts = {
  "nucleo:d": `env-cmd -f ${env_file_path} ${cmd_scripts_path}/mega_nucleo_download.cmd`,
  "nucleo:u": `env-cmd -f ${env_file_path} ${cmd_scripts_path}/mega_nucleo_upload.cmd`,
  "mongol:u": `env-cmd -f ${env_file_path} ${cmd_scripts_path}/mongo_local_upload.cmd`,
  "mongol:d": `env-cmd -f ${env_file_path} ${cmd_scripts_path}/mongo_local_download.cmd`,
  "mongoe:u": `env-cmd -f ${env_file_path} ${cmd_scripts_path}/mongo_externe_upload.cmd`,
  "mongoe:d": `env-cmd -f ${env_file_path} ${cmd_scripts_path}/mongo_externe_download.cmd`,
};
/**Va a guardar los scripts bash, que se van a usar en el package.json
 */
const bash_scripts = {
  "nucleo:d": `env-cmd -f ${env_file_path} ${bash_scripts_path}/mega_nucleo_download.sh`,
  "nucleo:u": `env-sh -f ${env_file_path} ${bash_scripts_path}/mega_nucleo_upload.sh`,
  "mongol:u": `env-sh -f ${env_file_path} ${bash_scripts_path}/mongo_local_upload.sh`,
  "mongol:d": `env-sh -f ${env_file_path} ${bash_scripts_path}/mongo_local_download.sh`,
  "mongoe:u": `env-sh -f ${env_file_path} ${bash_scripts_path}/mongo_externe_upload.sh`,
  "mongoe:d": `env-sh -f ${env_file_path} ${bash_scripts_path}/mongo_externe_download.sh`,
};
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
async function packageInit({ Debug, defaults, script }, callback) {
  const NAME_ = "packageInit";
  debug.name(Debug,NAME_, "service");
  /* 
    Proceso packageInit
    * Primero se tiene que escojer que paquete de scripts se va a inyectar en el json. [sync] + 
    * Abrir el archivo json [Promise] +
    * Luego se tiene que verificar si el json esta vacio [condicional]
        * En caso de que no reiniciarlo [Promise] +
        * Vaciarles las depencias por que hay veces que viene con dependencias. [Promise] +
    * Verificar si existe la propiedad script [sync] +
        * Si no crearla [Promise] +
    * Por ultimo se inyectaran los scripts [Promise] +
    */
  const scripts = choseScript({ Debug, defaults, script });
  const Package = packageLocation;
  const arg = {
    Package,
    scripts,
  };

  debug.values(arg);
  const read = readFileSync(Package, "utf-8");
  // proceso en caso de que este vacio el package.json, se tiene que terminar el proceso, por que se esta usando callbacks.
  if (!read) {
    processPackageEmpty({ Debug, scripts, Package }, () => {
      processNoScript({ Debug, Package, scripts });
    });
    return;
  }
  // proceso en caso de que no exista el objeto script
  if (read) {
    const data = JSON.parse(read);
    checkProperty({ data, Debug, scripts, Package });
  }
  // proceso en que todo esta bien y solo anade los scripts.
  if (debug) done(NAME_);
  callback();
}
/**
 * Proceso para manejar el obejto script.
 *
 * Verifica si existe, el objeto script y si no lo crea, tambien agrega los scripts.
 */
function processNoScript({ Debug, Package, scripts }) {
  const read = readFileSync(Package, "utf-8");
  if (read) {
    const data = JSON.parse(read);
    if (!checkProperty({ data, Debug })) {
      createProperties({ Debug, data, Package }, () => {
        addObjects({ Debug, data, scripts, Package });
      });
    }
  }
}
/**
 * Determina que scripts inyectar en el package.json, ya sea bash, cmd o powershell. Por defecto inyectara cmd.
 * @param Debug Para activar el debuger
 * @param defaults Los valores por defecto para el package.
 * @param scripts Los scripts para escojer cual script inyectar.
 * @returns
 */
function choseScript({ Debug, defaults, script }) {
  const { sh, cmd } = script;
  const {
    package_: { scripts_ },
  } = defaults;
  if (sh) {
    const script = bash_scripts;
    return script;
  } else if (cmd) {
    script = cmd_scripts;
    return script;
  } else {
    switch (scripts_) {
      case "cmd":
        script = cmd_scripts;
        return script;
      case "sh":
        script = bash_scripts;
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
function processPackageEmpty({ debug, Package }, callback) {
  const NAME_ = "packageEmpty";
  if (debug) name(NAME_, "subservice");
  warning("El package esta vacio, iniciando un nuevo package");
  newPackage({ debug }, () => {
    const read = readFileSync(Package, "utf-8");
    if (read) {
      const data = JSON.parse(read);
      emptyObject({ debug, data, Package });
      return;
      //TODO: colocar un debug.succeess aqui
    } else {
      error("No se puede iniciar un nuevo package");
      return;
    }
  });
  callback();
  if (debug) done(NAME_);
}
/**
 * Se encarga de volver a iniciar el package en caso de que este vacio. Por alguna razon cuando se inicia crea depenencias. 
* @param {{
    debug: boolean
 * }}
    * debug - Para activar el modo debug.
* @return {boolean} Regresa true si se pudo ejecutar el comando.
 */
function newPackage({ Debug }) {
  const NAME_ = "newPackage";
  debug.name(Debug,NAME_, "service");
  const command = "npm init -y";
  const arg = {
    command,
  };
  debug.values(Debug,arg);
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      debug.info("Iniciando un nuevo package:");
      if (error) return reject(error);
      if (stderr) return reject(stderr);
      debug.info(`Resultado: ${stdout}`);
      debug.done(NAME_);
    });
    resolve(true);
  });
}
/**
 * Verifica si existen los scripts inyectados con {@link addObjects} en el package.json.
 *
 * ? esta funcion podria ser checkProperties, de cuaquier archivo json, las properties se pasan por parametro. Pertenece al servicio, json_.
 *
 * sync
 */
//TODO: falta por terminar
function checkScripts() {}
// --
module.exports = {
  packageInit,
};
