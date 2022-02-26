/**
 * Modulo para administrar las funciones relacionadas con el .nucleo 
 * @module services/env
 */
//TODO: implementar el debuger
const { exec } = require("child_process");
const path = require("path");
const {existsSync,mkdir} = require('fs');
const debug = require('./Debug');
/** 
 * La ruta del .nucleo del proyecto actual.
 */
const nucleoPath = path.join(process.cwd(),'/.nucleo');
/**
 * Las carpetas que constituyen del nucleo.
 */
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
/**
 * El encargado de gestionar el proceso de creacion del .nucleo .
 * @param {{
    Debug: boolean
 * }}
  * Debug - Para activar el modo Debug
  * @return void
 */
//TODO: no tiene sentido, primero se crea el nulcoe y luego se verifica si existe?, se tiene que primero verificar el nucleo y luego se manda a crear.
function nucleoInit({Debug}) {
const NAME_ = 'nucleoInit';
if(Debug)debug.name(NAME_,'service');
    createNucleo({Debug});
    if (verifyNucleo({Debug})) {
      hiddenNucleo({Debug});
      createContentNucleo({Debug});
    } else {
      debug.error('No existe el nucleo, no se puede volver invisible y no se le puede agregar el contenido');
    }
if(Debug)debug.done(NAME_);
}
/**
 * Va a crear la carpeta nucleo.
* @param {{
    Debug: boolean
 * }}
* Debug - Para activar el debugger.
 * @returns void
 */
//TODO: esta funcion no deberia verificar si existe el nucleo antes de crearlo. tan solo debe crearlo, true si logro creralo y false 
//TODO: el proceso de verificado despues de crearlo, deberia colocarlo dentro del callback del mkdir, para que sea asyncrono.
//TODO: esta funcion deberia ser un callback, por que es la primera en inciar el proceso.
function createNucleo({Debug}) {
const NAME_ = 'createNucleo';
if(Debug)debug.name(NAME_,'service');
    var folder = nucleoPath;
const arg = {
  folder
}
if(Debug)debug.values(arg);
      if (verifyNucleo({Debug})) {
    console.log('Ya existe el nucleo');
        return false;
      }
      mkdir(folder,(err) => {
        if (err) throw err;
      });
      if (verifyNucleo({Debug})) {
        console.log('Nucleo creado');
if(Debug)debug.done(NAME_);
        return true
        }
        error('Error al crear el nucleo')
      return false
}
/**
 * Verifica si existe el nucleo syncronamente. 
 * 
* @param {{
    Debug: boolean
 * }}
* Debug - Para activar el debugger.
 * @return {boolean} Regresa true si existe, false si no existe
 */
//TODO: el path del nucleo, tiene que ser dado via parametro.
function verifyNucleo({Debug}) {
const NAME_ = 'verifyNucleo';
if(Debug)debug.name(NAME_,'service');
const nucleo = nucleoPath;
const arg = {
  nucleo
}
if(Debug)debug.values(arg);
    if (existsSync(nucleo)) {
if(Debug)debug.done(NAME_);
        return true
      } else {
if(Debug)debug.done(NAME_);
        return false
      }
}
/**
 * Vuelve invisible la carpeta nucleo.
* @param {{
    Debug: boolean
 * }}
* Debug - Para activar el debugger.
 */
//TODO: La ruta del nucleo se la deberiamos pasar por parametros.
function hiddenNucleo({Debug}) {
const NAME_ = 'hiddenNucleo';
if(Debug)debug.name(NAME_,'service');
    const nucleo = nucleoPath;
    const command = `attrib +h "${nucleo}"`;
  const arg = {
    nucleo,
    command
  }
  if(Debug)debug.values(arg);
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
    });
if(Debug)done(NAME_);
}
/**
 * Crea el contenido del nucleo.
* @param {{
    Debug: boolean
 * }}
* Debug - Para activar el debugger.
 */
//TODO: el contenido del nucleo se deberia pasar por parmetro
function createContentNucleo({Debug}) {
const NAME_ = 'createContentNucleo';
if(Debug)debug.name(NAME_,'service');
       const object = nucleoContent;
const arg = {
  object
}
if(Debug)debug.values(arg);
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
if(Debug)debug.done(NAME_);
}
module.exports = {
  nucleoInit
}