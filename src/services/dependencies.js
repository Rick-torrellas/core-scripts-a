const { exec } = require("child_process");
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