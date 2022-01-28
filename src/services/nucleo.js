const { exec } = require("child_process");
const path = require("path");
const {existsSync,mkdir} = require('fs');
const {name,values,error,done} = require('./debug');
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
    "data_custom": path.join(`${process.cwd()}/.nucleo/data/data_custom`)
}
function nucleoInit({debug}) {
const NAME_ = 'nucleoInit';
if(debug)name(NAME_,'service');
    createNucleo({debug});
    if (verifyNucleo({debug})) {
      hiddenNucleo({debug});
      createContentNucleo();
    } else {
      error('No existe el nucleo, no se puede volver invisible y no se le puede agregar el contenido');
    }
if(debug)done(NAME_);
}
function createNucleo({debug}) {
const NAME_ = 'createNucleo';
if(debug)name(NAME_,'service');
    var folder = nucleoPath;
const arg = {
  folder
}
if(debug)values(arg);
      if (verifyNucleo({debug})) {
    console.log('Ya existe el nucleo');
        return false;
      }
      mkdir(folder,(err) => {
        if (err) throw err;
      });
      if (verifyNucleo({debug})) {
        console.log('Nucleo creado');
if(debug)done(NAME_);
        return true
        }
        error('Error al crear el nucleo')
      return false
}
function verifyNucleo({debug}) {
const NAME_ = 'verifyNucleo';
if(debug)name(NAME_);
const arg = {
  nucleoPath
}
if(debug)values(arg);
    if (existsSync(nucleoPath)) {
        return true
      } else {
        return false
      }
}
function hiddenNucleo({debug}) {
//FIXME: no funciona
const NAME_ = 'hiddenNucleo';
if(debug)name(NAME_,'service');
    const nucleo = nucleoPath;
    const command = `attrib +h "${nucleo}"`;
  const arg = {
    nucleo,
    command
  }
  if(debug)values(arg);
      exec(command,(error,stdout,stderr)=>{
        if (error) {
          console.log(`error: ${error.message}`);
          return;
      }
      if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
      }
      console.log(`Resultado: ${stdout}`);
      if(debug)done(NAME_);
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
              if (existsSync(element)) {
                console.log(`Se creo correctamente: '${key}`);
              } else {
                console.log(`'No se pudo crear: '${key}`);
              }
            })
           } else {
             console.log(`${key}:' Ya esta creado'`);
           }
         }
       }
}
module.exports = {
  nucleoInit
}