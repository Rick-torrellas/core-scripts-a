/**
 * Modulo del proceso inicial del paquete, instala todos los componentes necesarios, para que funcione el paquete.
 * @module command/init
 */
const program = require('commander');
const {packageInit} = require('./../services/package');
const dependencies = require('./../services/dependencies');
const env = require('./../services/env');
const nucleo = require('./../services/nucleo');
const {start} = require('./../services/Debug');
program
.command('init')
.description('Para agregar los scripts al package.json, por defecto agregara scripts de cmd')
.option('-d, --Debug', 'Ejecuta un depurador del codigo.')
.option('-b, --batch', 'Para inyectar scripts en batch.')
.option('-op, --onlyPackage', 'Solo agrega los scripts al package.json')
.option('-od, --onlyDependencies', 'Solo agrega las dependencias para que funcionen los scripts')
.option('-oe, --onlyEnvFile', 'Solo crea el archivo .env.core')
.option('-on, --onlyNucleo', 'Solo crea la carpeta nucleo')
.action((cmdObj) => {
    const {Debug,onlyEnvFile,onlyNucleo,onlyDependencies,onlyPackage} = cmdObj;
    if (Debug) start();
    initCmd({Debug,onlyEnvFile,onlyNucleo,onlyDependencies,onlyPackage});
}
)
/**
 * Controla todo el flujo y la logica del comando.
 * 
 * Permite ejecutar solo un proceso si se quiere y que tipo de script se quere agregar.
 * 
 * Por defecto enyectara los scripts cmd.
 * @param {{
    Debug: boolean
    onlyEnvFile: boolean
    onlyNucleo: boolean
    onlyDependencies: boolean
    onlyPackage: boolean
 * }}
 * Debug  Para activar el modo debugger
 * @param onlyEnvFile Para activar solo el proceso del archivo env.
 * @param onlyNucleo Para activar solo el proceso del nucleo
 * @param onlyPackage Para activar solo el proceso del package.json
 * @param onlyDeprendencies Para activar solo el proceso para instalar las dependencias
 * @returns {void}
 */
function initCmd({Debug,onlyEnvFile,onlyNucleo,onlyDependencies,onlyPackage}) {
    if (onlyPackage) {
        packageInit({Debug},()=>{});
        return;
    }
    if (onlyEnvFile) {
        env.createEnv();
        return;
    }
    if (onlyNucleo) {
        nucleo.nucleoInit({Debug});
        return;
    }
    if (onlyDependencies) {
        dependencies.dependenciesInit();
        return;
    }
    initFullProcess({Debug});
}
/**
 * Es la ejecuccion por defecto de {@link initCmd}
 * 
 * Iniciara todos los procesos, por defecto inyectara los scripts cmd.
 * @param {{
    Debug: boolean
 * }}
 * Debug Para activar el modo debugger
 * @return {void}
 */
//TODO: en esta funcion crear el todo el proceso, para decidir que script sera pasado.
function initFullProcess({Debug}) {
    packageInit({Debug},()=>{
        dependencies.dependenciesInit();
    });
    env.createEnv();
    nucleo.nucleoInit({Debug});
}