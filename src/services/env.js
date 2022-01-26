const path = require("path");
const fs = require('fs');
const envFile = path.join(process.cwd()+'/.env.core');
function createEnv() {
    const file = envFile;
    const content = "MEGA_MAIL_A=\nMEGA_PASS_A=\nMONGO_USER=\nMONGO_PASSWORD=\nMONGO_URI_DOWNLOAD=\nMONGO_URI_UPLOAD="
    fs.writeFile(file, content, function (err) {
        if (err) throw err;
        console.log('Archivo env.core creado!');
      });
}
module.exports = {
    createEnv
}