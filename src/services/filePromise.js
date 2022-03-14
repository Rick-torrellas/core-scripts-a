const { existsSync} = require("fs");
//TODO: comentar mejor 🍡
/**
 * Vertifica si existe un archivo
 * @return {boolean} Retorna `true` si existe, `false` si no existe
 */
function checkFile({file}) {
    return new Promise((resolve) => {
        if (existsSync(file)) {
            resolve(true);
        } else {
            resolve(false);
        }
    });
}
module.exports = {
    checkFile
}