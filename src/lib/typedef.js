/**
 * Un objeto con valores por defecto para algunos procesos.
 * @typedef {Object} defaults
 * @property {Object} package_
 * @property {string} package_.scripts 
 */
/**
 * Guarda todos los valores para ejecutar solo un proceso. Por ejemplo solo nucleo.
 * @typedef {Object} only
 * @property {boolean} onlyEnvFile
 * @property {boolean} onlyNucleo
 * @property {boolean} onlyDependencies
 * @property {boolean} onlyPackage
 */
/**
 * Objeto con valores booleanos, ayuda a escojer que script seran inyectados en el package.json
 * @typedef {Object} script
 * @property {boolean} sh
 * @property {boolean} cmd
 */
module.exports = {
    /**
     * defaults
     * @type {defaults}
     */
    /**
     * only
     * @type {only}
     */
    /**
     * script
     * @type {script}
     */
}