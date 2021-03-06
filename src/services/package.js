/**
 * Modulo para controlar las funciones relacionadas con el package.json.
 * @module services/env
 */
const { execSync } = require("child_process");
const { join } = require("path");
const debug = require("./debug");
const { envFileRelative } = require("./env");
const json_Promise = require("./json_Promise");
const filePromise = require("./filePromise");
//TODO: verificar si existe el package.json, si no se tiene que crear.
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
async function packageInit({ Debug, defaults, script }) {
  let scripts, Package, arg, read, data;
  const NAME_ = "packageInit";
  debug.name(Debug, NAME_, "service");
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
  try {
    scripts = choseScript({ Debug, defaults, script });
  Package = packageLocation;
  arg = {
    Package,
    scripts,
  };
  debug.values(Debug, arg);
  await handlePackage({ Debug });
  await dependencies();
  read = await json_Promise.readJson({ Debug, file: Package });
  if (!read) {
    await newPackage({ Debug });
    read = await json_Promise.readJson({ Debug, file: Package });
    if (!read) throw new Error("Error al reiniciar el package.json");
    data = JSON.parse(read);
    await json_Promise.replaceProperty({
      Debug,
      data,
      properties: "dependencies",
      value: {},
      file: Package,
    });
  }
  data = data ? data : JSON.parse(read);
  if (read) {
    await handleScripts({
      Debug,
      data,
    });
  } else {
    throw new Error("El packaje.json esta vacio.");
  }
  if (read) {
    await json_Promise.putValueProperty({
      Debug,
      data,
      properties: "scripts",
      value: scripts,
      file: Package,
    });
  } else {
    throw new Error("El packaje.json esta vacio.");
  }
  debug.done(Debug, NAME_);
  } catch (error) {
    debug.error(error);
  }
}
function handlePackage({ Debug }) {
  const name = "handlePackage";
  debug.name(Debug, name);
  return new Promise((resolve) => {
    resolve(filePromise.checkFile({ file: packageLocation }));
  })
    .then((res) => {
      if (!res) {
        debug.done(Debug, name);
        return newPackage({ Debug });
      }
      debug.done(Debug, name);
      return false;
    })
    .catch((err) => {
      debug.error(err);
    });
}
/**
 * Se encarga de verificar si existe el objeto scripts, si no existe se crea.
 */
function handleScripts({
  Debug,
  data,
  properties = "scripts",
  value = {},
  file = packageLocation,
}) {
  return new Promise((resolve) => {
    resolve(json_Promise.checkProperty({ Debug, data, properties }));
  })
    .then((res) => {
      if (!res) {
        return json_Promise.createProperty({
          Debug,
          data,
          properties,
          value,
          file,
        });
      }
      return false;
    })
    .catch((err) => {
      debug.error(err);
    });
}
/**
 * Determina que scripts inyectar en el package.json, ya sea bash, cmd o powershell. Por defecto inyectara cmd.
 * @param Debug Para activar el debuger
 * @param defaults Los valores por defecto para el package.
 * @param scripts Los scripts para escojer cual script inyectar.
 * @returns
 */
function choseScript({ defaults, script }) {
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
 * Se encarga de volver a iniciar el package en caso de que este vacio. Por alguna razon cuando se inicia crea depenencias. 
* @param {{
    debug: boolean
 * }}
    * debug - Para activar el modo debug.
* @return Regresa true si se pudo ejecutar el comando.
 */
function newPackage({ Debug }) {
  const NAME_ = "newPackage";
  debug.name(Debug, NAME_, "service");
  const command = "npm init -y";
  const arg = {
    command,
  };
  debug.values(Debug, arg);
  return new Promise((resolve) => {
    const result = execSync(command).toString();
    console.log(result);
    resolve(true);
  });
}
function dependencies() {
  const dependencies = "env-cmd";
  const command = `npm install ${dependencies} `;
  console.log(`Instalando dependencias: ${dependencies}`);
  return new Promise((resolve) => {
    const result = execSync(command).toString();
    console.log(result);
    resolve(true);
  })
    .then((res) => {
      if (res) {
        const dependencies = "@core_/scripts";
        const command = `npm install ${dependencies}`;
        console.log(`Instalando dependencias: ${dependencies}`);
        const result = execSync(command).toString();
        console.log(result);
        return true;
      }
    })
    .catch((err) => {
      debug.error(err);
    });
}
module.exports = {
  packageInit,
  newPackage,
  choseScript,
};
