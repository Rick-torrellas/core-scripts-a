/**
 * Modulo para agregar las dependencias para que funcione esta paquete. 
 * @module services/dependencies
 */
const { exec } = require("child_process");
// TODO: verificar si existe ya esta dependencia, para no volverla a instalar
/**
 * Instala las dependencias para que este paquete pueda funcionar.
 */
//TODO: esta funcion deberia ser la que controle el flujo principal del proceso y crear una funcion independendiente, para la accion en si de instalar.
function dependenciesInit() {
    exec("npm i env-cmd",(error,stdout, stderr)=> {
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
    })
}module.exports = {
    dependenciesInit
}