/**
 * Modulo del proceso inicial del paquete, instala todos los componentes necesarios, para que funcione el paquete.
 * @module command/init
 */
const program = require("commander");
const { packageInit } = require("./../services/package");
const env = require("./../services/env");
const nucleo = require("./../services/nucleo");
const { cliconsole } = require("@core_/cli-tools");

program
  .command("init")
  .description(
    "Para agregar los scripts al package.json, por defecto agregara scripts de cmd"
  )
  .option("-v, --verbose", "Ejecuta un depurador del codigo.")
  .option("-cmd, --batch", "Para inyectar scripts en batch.")
  .option("-sh, --bash", "Para inyectar scripts en bash.")
  .option("-op, --onlyPackage", "Solo agrega los scripts al package.json")
  .option("-oe, --onlyEnvFile", "Solo crea el archivo .env.core")
  .option("-on, --onlyNucleo", "Solo crea la carpeta nucleo")
  .action((cmdObj) => {
    const { verbose, onlyEnvFile, onlyNucleo, onlyPackage, sh, cmd } = cmdObj;
    const defaults = {
      package_: {
        scripts_: "cmd",
      },
    };
    /**
     * Guarda todos los valores para ejecutar solo un proceso. Por ejemplo solo nucleo.
     */
    const only = {
      onlyEnvFile,
      onlyNucleo,
      onlyPackage,
    };
    /**
     * Objeto con valores booleanos, ayuda a escojer que script seran inyectados en el package.json
     */
    const script = {
      sh,
      cmd,
    };
    init({ verbose, defaults, only, script });
  });
/**
 * Controla todo el flujo y la logica del comando.
 * 
 * Permite ejecutar solo un proceso si se quiere y que tipo de script se quere agregar.
 * 
 * Por defecto enyectara los scripts cmd.
 * @param {{
    verbose: boolean
    onlyEnvFile: boolean
    onlyNucleo: boolean
    onlyPackage: boolean
 * }}
 * verbose  Para activar el modo verboseger
 * @param onlyEnvFile Para activar solo el proceso del archivo env.
 * @param onlyNucleo Para activar solo el proceso del nucleo
 * @param onlyPackage Para activar solo el proceso del package.json
 * @param onlyDeprendencies Para activar solo el proceso para instalar las dependencias {@link defaults}
 * @returns {void}
 */
function init({ verbose, only, defaults, script }) {
  //TODO: crear un error, si estan las optiones bash, batch o powerllshell al mismo timepo, crear un error, solo se puede usar una d estas a la vez.
  const { onlyEnvFile, onlyNucleo, onlyPackage } = only;
  if (onlyEnvFile || onlyNucleo || onlyPackage) {
    initOnly({ verbose, only, defaults, script });
    return;
  }
  defaultProcess({ verbose, defaults, script });
}
/**
 * Es la ejecuccion por defecto de {@link init}
 * 
 * Iniciara todos los procesos, por defecto inyectara los scripts cmd.
 * @param {{
    verbose: boolean
     
 * }}
 * verbose Para activar el modo verboseger
 * @param defaults Los valores por defecto de cada proceso.
 * @param script Los scripts que se van a usar en el proceso del package.
 * @return 
 */
async function defaultProcess({ verbose, script, defaults }) {
  packageInit({ verbose, script, defaults });
  env.envInit({verbose});
  nucleo.nucleoInit({ verbose });
}
/**
 * Se activa en caso de que se quiera ejecutar solo uno o varios procesos. Pero se quieran omitir otros.
 * @param {{
    verbose: boolean
 * }} 
 * @param verbose Para activar el verboseger.
 * @param only Objeto con los procesos a ejecutarse.
 * @param defaults Los valores por defecto de cada proceso.
 * @param script Los scripts que se van a usar en el proceso del package.
 * @returns {void}
 */
function initOnly({ verbose, only, defaults, script }) {
  //TODO: implementar el verboseer aqui, con un info o un name que diga, se activo onlyPackage.
  const { onlyEnvFile, onlyNucleo, onlyPackage } = only;
  if (onlyPackage) {
    packageInit({ verbose, defaults, script });
  }
  if (onlyEnvFile) {
    env.envInit({verbose});
  }
  if (onlyNucleo) {
    nucleo.nucleoInit({ verbose });
  }
}