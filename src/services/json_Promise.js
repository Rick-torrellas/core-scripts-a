const debug = require("./debug");
const json_Sync = require("./json_Sync");
const { readFile, writeFile } = require("fs");
//TODO: crear una funcion que inicie un arcivo json, osea que le coloque los {} iniciales. o []
/**
 * Lee un archivo json.
 * @param {{{
    file:string
 * }}
 * @param file El archivo json a leer.
 * @returns {string} Retorna el contenido del archivo json como string.
 */
function readJson({ Debug = false, file, check }) {
  const NAME_ = "readJson";
  debug.name(NAME_, "service");
  if (file == undefined) throw new Error("file esta indefinido");
  //TODO: crear un checket para que solo pueda leer .json, la viana es que indexOf() es sensibles a las mayusculas, entonces es mejor usar search() pero ese usa expreciones regulares.
  //TODO: implementar esta funcion en todas las funciones que requieran readFile.
  if (check) {
    if (typeof file !== "string")
      throw new Error(`file nada mas puede ser string, file es ${typeof file}`);
  }
  return new Promise((resolve, reject) => {
    readFile(file, "utf-8", (err, read) => {
      if (err) return reject(err);
      if (!read) debug.warning("El archivo json esta vacio");
      resolve(read);
    });
  });
}
/**
 * Lee un archivo json.
 * @param {{{
    file:string
 * }}
 * @param file El archivo json a leer.
 * @returns {object} Retorna el contenido del archivo json como un objeto.
 */
function readJsonObject({ Debug = false, file, check }) {
  const NAME_ = "readJson";
  debug.name(NAME_, "service");
  if (file == undefined) throw new Error("file esta indefinido");
  if (check) {
    if (typeof file !== "string")
      throw new Error(`file nada mas puede ser string, file es ${typeof file}`);
  }
  return new Promise((resolve, reject) => {
    readFile(file, "utf-8", (err, read) => {
      if (err) return reject(err);
      if (!read) return reject("El arhivo json esta vacio");
      let data = JSON.parse(read);
      resolve(data);
    });
  });
}
/**
 * Inyecta valores a una propiedad ya existente, esta propiedad puede de cualquier tipo.
 * 
 * Los valores tambien pueden ser de cualquier tipo.
 * @param {{
    Debug: boolean
    value: any
    file: string
    properties: string
 * }}
 * debug - Para activar el modo debug
* @param value El valor que va a tener la propiedad, puede ser cualquier valor que acepte un json.
 * @param file El archivo json que quieres modificar.
 * @param properties Una string con la ruta hacia la propiedad que quieres modificar.
 * @return {Promise <boolean|void>} `true` si se pudo modificar el archivo json.
 * @example ```
 * addValue({Debug: true, value: {"propiedad_a": "valor","propiedad_b": "valor"},properties: "prop.masProps.estaProp"});
 * ``` 
 */
function addValueOpen({ Debug = false, value, file, properties, check = true }) {
  //TODO: crear una vercion de esta funcion open addValueOpen
  const NAME_ = "addObject";
  debug.name(Debug, NAME_, "service");
  if (value == undefined) throw new Error("value esta indefinido");
  if (file == undefined) throw new Error("file esta indefinido");
  if (properties == undefined) throw new Error("properties esta indefinido");
  return new Promise((resolve, reject) => {
    resolve(readJsonObject({ Debug, file, check: false }));
  })
    .then((data) => {
      if (check) {
        const checkProps = json_Sync.checkProperty({
          data,
          properties,
          check: false,
        });
        const checkType = json_Sync.checkPropertyType({
          data,
          properties,
          check: false,
        });
        if (checkProps == false)
          throw new Error(`No existe la propiedad ${properties}`);
        if (
          (checkType == "string" ||
            checkType == "number" ||
            checkType == "boolean" ||
            properties == null) &&
          typeof value === "object"
        )
          throw new Error(
            `La propiedad ${properties} es ${checkType} y value es ${typeof value}, no se puede realizar la insercion.`
          );
        if (
          checkType == "object" &&
          (typeof value == "string" ||
            typeof value == "number" ||
            typeof value == "boolean" ||
            value == null)
        )
          throw new Error(
            `La propiedad ${properties} es ${checkType} y value es ${typeof value}, no se puede realizar la insercion.`
          );
      }
      const data_ = json_Sync.addValueData({
        data,
        properties,
        value,
        check: false,
      });
      const complete = JSON.stringify(data_, null, 2);
      writeFile(file, complete, (err) => {
        if (err) {
          debug.done(Debug, NAME_);
          throw err;
        }
        debug.data("Objetos crados", value);
        debug.done(Debug, NAME_);
        return;
      });
      return true;
    })
    .catch((err) => {
      debug.error(err);
    });
}
/**
 * Inyecta valores a una propiedad ya existente, esta propiedad puede de cualquier tipo.
 * 
 * Los valores tambien pueden ser de cualquier tipo.
 * @param {{
    Debug: boolean
    value: any
    file: string
    properties: string
 * }}
 * debug - Para activar el modo debug
* @param value El valor que va a tener la propiedad, puede ser cualquier valor que acepte un json.
 * @param file El archivo json que quieres modificar.
 * @param properties Una string con la ruta hacia la propiedad que quieres modificar.
 * @return {Promise <boolean|void>} `true` si se pudo modificar el archivo json.
 * @example ```
 * addValue({Debug: true, value: {"propiedad_a": "valor","propiedad_b": "valor"},properties: "prop.masProps.estaProp"});
 * ``` 
 */
function addValue({ Debug = false, value, data, properties, check = true }) {
  //TODO: crear una vercion de esta funcion open addValueOpen
  const NAME_ = "addObject";
  debug.name(Debug, NAME_, "service");
  if (value == undefined) throw new Error("value esta indefinido");
  if (file == undefined) throw new Error("file esta indefinido");
  if (properties == undefined) throw new Error("properties esta indefinido");
  return new Promise((resolve, reject) => {
    if (check) {
      const checkProps = json_Sync.checkProperty({
        data,
        properties,
        check: false,
      });
      const checkType = json_Sync.checkPropertyType({
        data,
        properties,
        check: false,
      });
      if (checkProps == false)
        return reject(`No existe la propiedad ${properties}`);
      if (
        (checkType == "string" ||
          checkType == "number" ||
          checkType == "boolean" ||
          properties == null) &&
        typeof value === "object"
      )
        return reject(
          `La propiedad ${properties} es ${checkType} y value es ${typeof value}, no se puede realizar la insercion.`
        );
      if (
        checkType == "object" &&
        (typeof value == "string" ||
          typeof value == "number" ||
          typeof value == "boolean" ||
          value == null)
      )
        return reject(
          `La propiedad ${properties} es ${checkType} y value es ${typeof value}, no se puede realizar la insercion.`
        );
    }
    const data_ = json_Sync.addValueData({
      data,
      properties,
      value,
      check: false,
    });
    const complete = JSON.stringify(data_, null, 2);
    writeFile(file, complete, (err) => {
      if (err) {
        debug.done(Debug, NAME_);
        return reject(err);
      }
      debug.data(Debug,"Objetos crados", value);
      debug.done(Debug, NAME_);
      resolve(true);
    });
  })
}
/**
 * Verificara si existe una propiedad en el jason.
 *
 * Puede ser una propiedad que este dentro de otra propiedad.
 * @param {*} file
 * @param {*} properties
 * @param {*} innerProps
 * @example `checkProperty('./archivo.json','vaso');` verifica si existe `vaso` o `checkProperty('./archivo.json','vaso.color');` verifica si existe `color` ola
 */
function checkProperty(file, properties, innerProps) {
  //TODO: actualizar. ver checkProperty sync.
  const NAME_ = "addObject";
  const arrei = [];
  debug.name(NAME_, "service");
  if (typeof innerProps == "string") {
    arrei.push(innerProps);
    innerProps = arrei;
  }
  return new Promise((resolve, reject) => {
    readFile(file, "utf-8", (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(data);
    });
  })
    .then((read) => {
      const data = JSON.parse(read);
      if (checkInnerProperties_case(innerProps, data, properties)) {
        debug.data(Debug, `Existen las propiedades ${properties}`);
        debug.done(Debug, NAME_);
        return true;
      } else {
        debug.warning(Debug, `No existe la propiedad ${properties}`);
        debug.done(Debug, NAME_);
        return false;
      }
    })
    .catch((err) => {
      console.error(err);
    });
}
/**
 * Verifica si existe el archivo json.
* @param {{
    debug: boolean
    Package: string
 * }}
* debug - Para activar el modo debug.
* @param Package - La ruta del package.json que se esta editando.
 */
//TODO: falta por terminar.
function checkJson({ debug, file }) {
  const NAME_ = "verifyNucleo";
  if (debug) debug.name(NAME_, "sub-service");
  const arg = {
    Package,
  };
  if (debug) values(arg);
}
/**
 * 
 * @param {{
    debug: boolean
    data: any
    Package: string
 * }}
 * debug - Para activar el modo debug.
 * @param data - El package.json que se esta editando.
 * @param Package - La ruta del package.json que se esta editando.
 * @return 
 */
//TODO: crear una estancia de la funcion, donde no le entreguen solo la data, y el tengo que hacer el proceso completo, para leer el jason.
//TODO: dividir esta funcion en dos, una parte que verifique si existe detrminada propiedad y otra que la cree vacia.
function emptyObject(Debug, { data, Package, read, property }) {
  const NAME_ = "emptyObject";
  debug.name(Debug, NAME_, "sub-services");
  return new Promise((resolve, reject) => {
    if (data[property] !== undefined && data.hasOwnProperty(property)) {
      data.dependencies = {};
      const complete = JSON.stringify(data, null, 2);
      writeFile(Package, complete, (err) => {
        if (err) {
          return reject(`Error al modificar el package.json \n ${err}`);
        }
        debug.info("Dependencias eliminadas");
        const response = {
          data,
          Package,
        };
        debug.done(Debug, NAME_);
        resolve(response);
      });
    } else {
      return reject(`Ya existe la propiedad ${property}`);
    }
  });
}
/**
 * Crea propiedades en el archivo json.
 * @param {{
    Debug: boolean
    properties: string|Array<string>
    file: string
 * }}
* debug - Para activar el modo debug.
* @param data - El package.json que se esta editando.
* @param Package - La ruta del package.json que se esta editando.
* @return Retorna el pacjage.json que se esta editando. 
 */
//TODO: crear una vercion de esta funcion que sea, para un archivo ya abierto. createOpenProperties
//TODO: esta puede ser una vercion de addValue, solo que esta crea una propiedad no existente y le ingresa valores. en las properties, el unico o ultimo valor dado, sera el nombre de la propiedad a crear. entonces si dices scripts se creara scripts si dices scripts.algo algo sera creado.
function createProperties({ Debug, file, properties }) {
  const NAME_ = "createProperties";
  debug.name(Debug, NAME_, "service");
  return new Promise((resolve, reject) => {
    readFile(file, "utf-8", (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(data);
    });
  })
    .then((read) => {
      const data = JSON.parse(read);
      data[properties] = {};
      const complete = JSON.stringify(data, null, 2);
      writeFile(file, complete, (err) => {
        if (err) {
          debug.done(Debug, NAME_);
          throw err;
        }
        debug.data("Propiedades creada", properties);
        debug.done(Debug, NAME_);
        return;
      });
      return true;
    })
    .catch((err) => {
      debug.error(err);
    });
}
/**
 * Lee un archivo.json y verifica si tiene una propiedado varias propiedades.
 * 
 * ! en construccion, todabia no verifica muchas propiedades.
 * @param {{
    Debug: boolean
    file: string
    properties: Array<string>|string
 * }}
 * debug - Para activar el modo debug.
 * @param File El archivo json.
 * @param properties La propiedad/es que se estan verificando. Puede ser una string o un array de strings.
 * @return {Promise<boolean>} Retorna `true` si existe la propiedad/es y `false` en caso de que no.
 */
/* TODO: crear un proceso donde se verifiquen un array de propiedades.
Se pueden verificar usando un loop, si te paasan una string, transformarla en array usando este proceso.
const arrei = []
  if (typeof propiedad == 'string') {
      arrei.push(propiedad)
      propiedad=arrei;
  }
Lo que no me esta tan claro, es cual deberia ser el retorno de la funcion.
true si todas las propiedades existe?
false si alguna no existe? pero no seria bueno, regresar cuales no existe? podria hacer un simple console.log pero seria un poco chaborro.
tambien se podria regresar un objeto con el false y un array con las propiedades que no existen.
*/
function checkProperties({ Debug, file, properties }) {
  const NAME_ = "checkProperty";
  debug.name(Debug, NAME_, "subservice");
  return new Promise((resolve, reject) => {
    readFile(file, "utf-8", (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(data);
    });
  })
    .then((read) => {
      const data = JSON.parse(read);
      if (data[properties] == undefined && !data.hasOwnProperty(properties)) {
        debug.warning(Debug, `No existe la propiedad ${properties}`);
        debug.done(Debug, NAME_);
        return false;
      } else {
        debug.data(Debug, `Existen las propiedades ${properties}`);
        debug.done(Debug, NAME_);
        return true;
      }
    })
    .catch((err) => {
      console.error(err);
    });
}
/**
 * 
* @param {{
    debug: boolean
    data: any
    scripts: string[]
    Package: string
 * }}
 * debug - Para activar el modo debug.
* @param data - El package.json que se esta editando.
* @return {void}
 */
//TODO: crear una estancia de la funcion, donde no le entreguen solo la data, y el tengo que hacer el proceso completo, para leer el jason.
function checkOpenProperty({ Debug, data, read }) {
  const NAME_ = "checkProperty";
  if (debug) name(NAME_, "subservice");
  if (data.scripts == undefined && !data.hasOwnProperty("scripts")) {
    warning("No existe la propiedad scripts");
    if (debug) done(NAME_);
    return false;
  } else {
    info("Existe la propiedad scripts");
    if (debug) done(NAME_);
    return true;
  }
}
//TODO: crer una funcion que anadir el primer {} a un archivo json vacio.
//TODO: crear una funcion que verifique si existen propiedades internas con un switch.
module.exports = {
  checkProperties,
};
