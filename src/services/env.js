const path = require("path");
const {existsSync,writeFile} = require('fs');
const envFile = path.join(process.cwd()+'/.env.core');
function createEnv() {
    const file = envFile;
    const content = "MEGA_MAIL_A=\nMEGA_PASS_A=\nMONGO_USER=\nMONGO_PASSWORD=\nMONGO_URI_DOWNLOAD=\nMONGO_URI_UPLOAD=";
    if (verifyEnv()) {
        console.log('Ya existe el archivo .env.core');
        return;
    } else {
        writeFile(file, content, function (err) {
            if (err) throw err;
        });
        console.log('Archivo env.core creado!');
    }
}
function verifyEnv() {
    if (existsSync(envFile)) {
        return true;
    } else {
        return false;
    }
}
module.exports = {
    createEnv
}
