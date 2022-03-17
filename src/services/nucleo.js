/**
 * Modulo para administrar las funciones relacionadas con el .nucleo
 * @module services/env
 */
//TODO: implementar el debuger
const path = require("path");
const debug = require("./debug");
const dirPromise = require('./dirPromise');
/**
 * La ruta del .nucleo del proyecto actual.
 */
const nucleoPath = path.join(process.cwd(), "/.nucleo");
/**
 * Las carpetas que constituyen del nucleo.
 */
const nucleoContent = {
  //TODO: unir las rutas con el nucleoPath
  img: path.join(`${process.cwd()}/.nucleo/img`),
  video: path.join(`${process.cwd()}/.nucleo/video`),
  audio: path.join(`${process.cwd()}/.nucleo/audio`),
  txt: path.join(`${process.cwd()}/.nucleo/txt`),
  custom: path.join(`${process.cwd()}/.nucleo/custom`),
  data: path.join(`${process.cwd()}/.nucleo/data`),
  sql: path.join(`${process.cwd()}/.nucleo/data/sql`),
  mongo: path.join(`${process.cwd()}/.nucleo/data/mongo`),
  json: path.join(`${process.cwd()}/.nucleo/data/json`),
  data_custom: path.join(`${process.cwd()}/.nucleo/data/data_custom`),
};
/**
 * El encargado de gestionar el proceso de creacion del .nucleo .
 * @param {{
    Debug: boolean
 * }}
  * Debug - Para activar el modo Debug
  * @return void
 */
async function nucleoInit({ Debug }) {
  try {
    const name = "nucleoInit";
  debug.name(Debug, name);
  const nucleo = await dirPromise.checkDir({dir: nucleoPath},{Debug});
  if (!nucleo) {
    debug.data(Debug,"Creando un nuevo nucleo");
    await dirPromise.createDir({dir: nucleoPath},{Debug});
  } else {
    debug.warning(Debug, "Ya existe el nucleo");
  }
  if (nucleo) {
    await dirPromise.editAtribute({attr: "h", dir: nucleoPath,state: "+"},{Debug});
    await dirPromise.addContent({content: nucleoContent,Debug});
  } else {
    throw new Error(
      "No existe el nucleo, no se puede volver invisible y no se le puede agregar el contenido"
    );
  }
  debug.done(Debug, name);
  return true;
  } catch (error) {
    console.error(error);
  }
}
module.exports = {
  nucleoInit,
};
