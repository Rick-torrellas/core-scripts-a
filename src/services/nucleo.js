const { exec } = require("child_process");
const path = require("path");
const {existsSync,mkdir} = require('fs');
const nucleoPath = path.join(process.cwd()+'/.nucleo');
const nucleoContent = {
//TODO: unir las rutas con el nucleoPath
    "img": path.join(`${process.cwd()}/.nucleo/img`),
    "video": path.join(`${process.cwd()}/.nucleo/video`),
    "audio": path.join(`${process.cwd()}/.nucleo/audio`),
    "txt": path.join(`${process.cwd()}/.nucleo/txt`),
    "custom": path.join(`${process.cwd()}/.nucleo/custom`),
    "data": path.join(`${process.cwd()}/.nucleo/data`),
    "sql": path.join(`${process.cwd()}/.nucleo/data/sql`),
    "mongo": path.join(`${process.cwd()}/.nucleo/data/mongo`),
    "json": path.join(`${process.cwd()}/.nucleo/data/json`),
    "data_custom": path.join(`${process.cwd()}/.nucleo/data_custom`)
}
function nucleoInit() {
    createNucleo();
    hiddenNucleo();
    createContentNucleo();
}
function createNucleo() {
    var folder = nucleoPath;
      if (verifyNucleo()) {
    console.log('Ya existe el nucleo');
        return false
      }
      mkdir(folder,(err) => {
        if (err) throw err;
      });
      if (verifyNucleo()) {
        console.log('Nucleo creado');
        return true
        }
        console.log('Error al crear el nucleo');
      return false
}
function verifyNucleo() {
    if (existsSync(nucleoPath)) {
        return true
      } else {
        return false
      }
}
function hiddenNucleo() {
//FIXME: no funciona
    const nucleo = nucleoPath;
      exec(`attrib +h ${nucleo}`,(error,stdout,stderr)=>{
        if (error) {
          console.log(`error: ${error.message}`);
          return;
      }
      if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
      }
      console.log(`Resultado: ${stdout}`);
      });
}
function createContentNucleo() {
       const object = nucleoContent;
       for (const key in object) {
         if (object.hasOwnProperty(key)) {
           const element = object[key];
           if (existsSync(element) == false) {
             mkdir(element,(err) => {
              if (err) throw err;
            })
             if (existsSync(element)) {
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