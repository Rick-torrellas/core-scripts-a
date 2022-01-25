const fs = require('fs');
const nucleoPath = path.join(process.cwd()+'/.nucleo');
const nucleoContent = {
    "img": path.join(`${process.cwd()}/.nucleo/img`),
    "video": path.join(`${process.cwd()}/.nucleo/video`),
    "audio": path.join(`${process.cwd()}/.nucleo/audio`),
    "txt": path.join(`${process.cwd()}/.nucleo/txt`),
    "data": path.join(`${process.cwd()}/.nucleo/data`),
    "custom": path.join(`${process.cwd()}/.nucleo/custom`)
}
function nucleoInit() {
    createNucleo();
    hiddenNucleo();
    createContentNucleo();
}
function createNucleo() {
    var folder = nucleoInit;
      if (verifyNucleo()) {
    console.log('Ya existe el nucleo');
        return false
      }
      fs.mkdirSync(folder);
      if (verify.nucleo()) {
        console.log('Nucleo creado');
        return true
        }
        console.log('Error al crear el nucleo');
      return false
}
function verifyNucleo() {
    if (fs.existsSync(nucleoPath)) {
        return true
      } else {
        return false
      }
}
function hiddenNucleo() {
    const nucleo = nucleoPath;
      execSync(`attrib +h ${nucleo}`);
}
function createContentNucleo() {
       const object = nucleoContent;
       for (const key in object) {
         if (object.hasOwnProperty(key)) {
           const element = object[key];
           if (fs.existsSync(element) == false) {
             fs.mkdirSync(element)
             if (fs.existsSync(element)) {
               console.log(`Se creo correctamente: '${key}`);
             } else {
               console.log(`'No se pudo crear: '${key}`);
             }
           } else {
             console.log(`${key}:' Ya esta creado'`);
           }
         }
       }
}
module.exports = {
  nucleoInit
}