const {mkdirSync,rmSync,existsSync} = require("fs");
const debug = require('./debug');
//TODO: se puede crear una funcion replaceDir, y ejecutar createDir({dir},{Debug,overwrite=true,recursive=true})
function checkDir({dir},{Debug}) {
//TODO: crear una vercion de esta funcion que verifique el contenido de la carpeta checkDirContent()
    const name = "checkDir";
}

/**
 * Crea una carpeta 
 * @returns True si logro crearla.
 */
function createDir({dir},{Debug=false,overwrite=false,recursive=false}) {
    const name = "createDir";
    debug.name(Debug, name);
    return new Promise(resolve=>{ 
      resolve(existsSync(dir))
    })
    .then(res => {
      if(res) {
          debug.warning(Debug, `La carpeta: ${dir} ya existe`);
          if(overwrite) {
          debug.warning(Debug, `Se va a sobreescribir la carpeta: ${dir}`);  
          rmSync(dir,{recursive: true,force: true});
        } else {
            debug.done(Debug, name);
          throw new Error(`La carpeta: ${dir} ya existe`);
        }
      }
      mkdirSync(dir, {recursive: recursive});
      debug.info(`Carpeta: ${dir} creada`);
      debug.done(Debug, name);
      return true;
    })
    .catch(err => {
      console.log(err);
    })
}
module.exports = {
    createDir,
}